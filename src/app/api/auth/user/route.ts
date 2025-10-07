import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth, getUserSession, getUserRole } from '@/lib/auth';
import { validateData, updateUserSchema } from '@/utils/validators';
import { ApiResponse, UserResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * GET /api/auth/user
 * Get current user profile
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<UserResponse>>> {
  try {
    // Check authentication
    await requireAuth(request);

    const session = await getUserSession(request);
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID not found in session',
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    const response: UserResponse = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'User profile retrieved successfully',
    });

  } catch (error: any) {
    console.error('Get user profile API error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user profile',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * PUT /api/auth/user
 * Update current user profile
 */
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<UserResponse>>> {
  try {
    // Check authentication
    await requireAuth(request);

    const session = await getUserSession(request);
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID not found in session',
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validation = validateData(updateUserSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const updateData = validation.data!;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Check for email conflicts if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: updateData.email }
      });

      if (emailConflict) {
        return NextResponse.json({
          success: false,
          error: 'User with this email already exists',
        }, { status: 409 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendUserUpdatedEvent({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || '',
      role: updatedUser.role,
      changes: updateData,
    });

    const response: UserResponse = {
      id: updatedUser.id,
      name: updatedUser.name || '',
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'User profile updated successfully',
    });

  } catch (error: any) {
    console.error('Update user profile API error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update user profile',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/user
 * Delete current user account
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Check authentication
    await requireAuth(request);

    const session = await getUserSession(request);
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID not found in session',
      }, { status: 401 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            doctorProfile: true,
            hospitalProfile: true,
            invoices: true,
            payments: true,
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
      }, { status: 404 });
    }

    // Check if user has associated data
    if (existingUser._count.doctorProfile > 0 || 
        existingUser._count.hospitalProfile > 0 || 
        existingUser._count.invoices > 0 || 
        existingUser._count.payments > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete user with associated data',
        message: 'Please remove all associated data before deleting the account',
      }, { status: 409 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'DELETE',
      entityType: 'USER',
      entityId: userId,
      userId: userId,
      oldValues: existingUser,
    });

    return NextResponse.json({
      success: true,
      message: 'User account deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete user account API error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete user account',
      message: error.message,
    }, { status: 500 });
  }
}
