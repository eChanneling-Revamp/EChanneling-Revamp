import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { validateData, updateHospitalSchema } from '@/utils/validators';
import { ApiResponse, HospitalResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * GET /api/admin/hospitals/[id]
 * Get hospital by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<HospitalResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const hospital = await prisma.hospital.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        doctors: {
          select: { id: true, name: true, status: true }
        },
        branches: {
          select: { id: true, name: true, city: true, status: true }
        },
        hospitalFunctions: {
          select: { id: true, name: true, status: true }
        },
        fees: {
          select: { id: true, name: true, amount: true, type: true, status: true }
        },
        discounts: {
          select: { id: true, name: true, type: true, status: true }
        },
        invoices: {
          select: { id: true, invoiceNumber: true, totalAmount: true, status: true }
        },
        _count: {
          select: {
            doctors: true,
            branches: true,
            hospitalFunctions: true,
            fees: true,
            discounts: true,
            invoices: true,
          }
        }
      }
    });

    if (!hospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found',
      }, { status: 404 });
    }

    const response: HospitalResponse = {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      city: hospital.city,
      province: hospital.province,
      phone: hospital.phone,
      email: hospital.email,
      website: hospital.website,
      description: hospital.description,
      status: hospital.status,
      registrationNumber: hospital.registrationNumber,
      licenseNumber: hospital.licenseNumber,
      createdAt: hospital.createdAt.toISOString(),
      updatedAt: hospital.updatedAt.toISOString(),
      userId: hospital.userId,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Hospital retrieved successfully',
    });

  } catch (error: any) {
    console.error('Get hospital API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hospital',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/hospitals/[id]
 * Update hospital by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<HospitalResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = validateData(updateHospitalSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const updateData = validation.data!;

    // Check if hospital exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: params.id }
    });

    if (!existingHospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found',
      }, { status: 404 });
    }

    // Check for email conflicts if email is being updated
    if (updateData.email && updateData.email !== existingHospital.email) {
      const emailConflict = await prisma.hospital.findUnique({
        where: { email: updateData.email }
      });

      if (emailConflict) {
        return NextResponse.json({
          success: false,
          error: 'Hospital with this email already exists',
        }, { status: 409 });
      }
    }

    // Check for registration number conflicts
    if (updateData.registrationNumber && updateData.registrationNumber !== existingHospital.registrationNumber) {
      const regConflict = await prisma.hospital.findUnique({
        where: { registrationNumber: updateData.registrationNumber }
      });

      if (regConflict) {
        return NextResponse.json({
          success: false,
          error: 'Hospital with this registration number already exists',
        }, { status: 409 });
      }
    }

    // Check for license number conflicts
    if (updateData.licenseNumber && updateData.licenseNumber !== existingHospital.licenseNumber) {
      const licenseConflict = await prisma.hospital.findUnique({
        where: { licenseNumber: updateData.licenseNumber }
      });

      if (licenseConflict) {
        return NextResponse.json({
          success: false,
          error: 'Hospital with this license number already exists',
        }, { status: 409 });
      }
    }

    // Update hospital
    const updatedHospital = await prisma.hospital.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'UPDATE',
      entityType: 'HOSPITAL',
      entityId: params.id,
      userId: (await getUserSession(request))?.userId || 'system',
      oldValues: existingHospital,
      newValues: updateData,
    });

    const response: HospitalResponse = {
      id: updatedHospital.id,
      name: updatedHospital.name,
      address: updatedHospital.address,
      city: updatedHospital.city,
      province: updatedHospital.province,
      phone: updatedHospital.phone,
      email: updatedHospital.email,
      website: updatedHospital.website,
      description: updatedHospital.description,
      status: updatedHospital.status,
      registrationNumber: updatedHospital.registrationNumber,
      licenseNumber: updatedHospital.licenseNumber,
      createdAt: updatedHospital.createdAt.toISOString(),
      updatedAt: updatedHospital.updatedAt.toISOString(),
      userId: updatedHospital.userId,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Hospital updated successfully',
    });

  } catch (error: any) {
    console.error('Update hospital API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update hospital',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/hospitals/[id]
 * Delete hospital by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    // Check if hospital exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            doctors: true,
            branches: true,
            invoices: true,
          }
        }
      }
    });

    if (!existingHospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found',
      }, { status: 404 });
    }

    // Check if hospital has associated data
    if (existingHospital._count.doctors > 0 || 
        existingHospital._count.branches > 0 || 
        existingHospital._count.invoices > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete hospital with associated doctors, branches, or invoices',
        message: 'Please remove all associated data before deleting the hospital',
      }, { status: 409 });
    }

    // Delete hospital
    await prisma.hospital.delete({
      where: { id: params.id }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'DELETE',
      entityType: 'HOSPITAL',
      entityId: params.id,
      userId: (await getUserSession(request))?.userId || 'system',
      oldValues: existingHospital,
    });

    return NextResponse.json({
      success: true,
      message: 'Hospital deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete hospital API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete hospital',
      message: error.message,
    }, { status: 500 });
  }
}
