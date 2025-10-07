import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { validateData, updateDoctorSchema } from '@/utils/validators';
import { ApiResponse, DoctorResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';
import { mailer } from '@/config/mailer';

const prisma = new PrismaClient();

/**
 * GET /api/admin/doctors/[id]
 * Get doctor by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<DoctorResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const doctor = await prisma.doctor.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        specialization: {
          select: { name: true, nameSinhala: true, nameTamil: true }
        },
        hospital: {
          select: { name: true, city: true, province: true }
        },
        invoices: {
          select: { id: true, invoiceNumber: true, totalAmount: true, status: true }
        },
        _count: {
          select: {
            invoices: true,
          }
        }
      }
    });

    if (!doctor) {
      return NextResponse.json({
        success: false,
        error: 'Doctor not found',
      }, { status: 404 });
    }

    const response: DoctorResponse = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      licenseNumber: doctor.licenseNumber,
      specializationId: doctor.specializationId,
      hospitalId: doctor.hospitalId,
      status: doctor.status,
      experience: doctor.experience,
      qualifications: doctor.qualifications,
      consultationFee: doctor.consultationFee,
      availableDays: doctor.availableDays,
      availableHours: doctor.availableHours,
      bio: doctor.bio,
      profileImage: doctor.profileImage,
      createdAt: doctor.createdAt.toISOString(),
      updatedAt: doctor.updatedAt.toISOString(),
      userId: doctor.userId,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Doctor retrieved successfully',
    });

  } catch (error: any) {
    console.error('Get doctor API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch doctor',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/doctors/[id]
 * Update doctor by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<DoctorResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = validateData(updateDoctorSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const updateData = validation.data!;

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: params.id }
    });

    if (!existingDoctor) {
      return NextResponse.json({
        success: false,
        error: 'Doctor not found',
      }, { status: 404 });
    }

    // Check for email conflicts if email is being updated
    if (updateData.email && updateData.email !== existingDoctor.email) {
      const emailConflict = await prisma.doctor.findUnique({
        where: { email: updateData.email }
      });

      if (emailConflict) {
        return NextResponse.json({
          success: false,
          error: 'Doctor with this email already exists',
        }, { status: 409 });
      }
    }

    // Check for license number conflicts
    if (updateData.licenseNumber && updateData.licenseNumber !== existingDoctor.licenseNumber) {
      const licenseConflict = await prisma.doctor.findUnique({
        where: { licenseNumber: updateData.licenseNumber }
      });

      if (licenseConflict) {
        return NextResponse.json({
          success: false,
          error: 'Doctor with this license number already exists',
        }, { status: 409 });
      }
    }

    // Verify specialization exists if being updated
    if (updateData.specializationId) {
      const specialization = await prisma.specialization.findUnique({
        where: { id: updateData.specializationId }
      });

      if (!specialization) {
        return NextResponse.json({
          success: false,
          error: 'Specialization not found',
        }, { status: 404 });
      }
    }

    // Verify hospital exists if being updated
    if (updateData.hospitalId) {
      const hospital = await prisma.hospital.findUnique({
        where: { id: updateData.hospitalId }
      });

      if (!hospital) {
        return NextResponse.json({
          success: false,
          error: 'Hospital not found',
        }, { status: 404 });
      }
    }

    // Update doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: { name: true, email: true }
        },
        specialization: {
          select: { name: true, nameSinhala: true, nameTamil: true }
        },
        hospital: {
          select: { name: true, city: true, province: true }
        }
      }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'UPDATE',
      entityType: 'DOCTOR',
      entityId: params.id,
      userId: (await getUserSession(request))?.userId || 'system',
      oldValues: existingDoctor,
      newValues: updateData,
    });

    const response: DoctorResponse = {
      id: updatedDoctor.id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      phone: updatedDoctor.phone,
      licenseNumber: updatedDoctor.licenseNumber,
      specializationId: updatedDoctor.specializationId,
      hospitalId: updatedDoctor.hospitalId,
      status: updatedDoctor.status,
      experience: updatedDoctor.experience,
      qualifications: updatedDoctor.qualifications,
      consultationFee: updatedDoctor.consultationFee,
      availableDays: updatedDoctor.availableDays,
      availableHours: updatedDoctor.availableHours,
      bio: updatedDoctor.bio,
      profileImage: updatedDoctor.profileImage,
      createdAt: updatedDoctor.createdAt.toISOString(),
      updatedAt: updatedDoctor.updatedAt.toISOString(),
      userId: updatedDoctor.userId,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Doctor updated successfully',
    });

  } catch (error: any) {
    console.error('Update doctor API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update doctor',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/doctors/[id]
 * Delete doctor by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            invoices: true,
          }
        }
      }
    });

    if (!existingDoctor) {
      return NextResponse.json({
        success: false,
        error: 'Doctor not found',
      }, { status: 404 });
    }

    // Check if doctor has associated invoices
    if (existingDoctor._count.invoices > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete doctor with associated invoices',
        message: 'Please remove all associated invoices before deleting the doctor',
      }, { status: 409 });
    }

    // Delete doctor
    await prisma.doctor.delete({
      where: { id: params.id }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'DELETE',
      entityType: 'DOCTOR',
      entityId: params.id,
      userId: (await getUserSession(request))?.userId || 'system',
      oldValues: existingDoctor,
    });

    return NextResponse.json({
      success: true,
      message: 'Doctor deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete doctor API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete doctor',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/doctors/[id]/verify
 * Verify doctor
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        specialization: {
          select: { name: true }
        },
        hospital: {
          select: { name: true }
        }
      }
    });

    if (!existingDoctor) {
      return NextResponse.json({
        success: false,
        error: 'Doctor not found',
      }, { status: 404 });
    }

    if (existingDoctor.status === 'ACTIVE') {
      return NextResponse.json({
        success: false,
        error: 'Doctor is already verified',
      }, { status: 400 });
    }

    // Update doctor status to ACTIVE
    const updatedDoctor = await prisma.doctor.update({
      where: { id: params.id },
      data: { status: 'ACTIVE' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        specialization: {
          select: { name: true }
        },
        hospital: {
          select: { name: true }
        }
      }
    });

    // Send verification email
    await mailer.sendDoctorVerificationEmail(
      existingDoctor.email,
      existingDoctor.name,
      existingDoctor.hospital.name
    );

    // Send Kafka events
    const kafkaProducer = getKafkaProducer();
    
    // Send doctor verified event
    await kafkaProducer.sendDoctorVerifiedEvent({
      doctorId: params.id,
      name: existingDoctor.name,
      email: existingDoctor.email,
      hospitalId: existingDoctor.hospitalId,
      hospitalName: existingDoctor.hospital.name,
      specializationId: existingDoctor.specializationId,
      specializationName: existingDoctor.specialization.name,
    });

    // Send audit log event
    await kafkaProducer.sendAuditLogEvent({
      action: 'VERIFY',
      entityType: 'DOCTOR',
      entityId: params.id,
      userId: (await getUserSession(request))?.userId || 'system',
      oldValues: { status: existingDoctor.status },
      newValues: { status: 'ACTIVE' },
    });

    return NextResponse.json({
      success: true,
      message: 'Doctor verified successfully',
    });

  } catch (error: any) {
    console.error('Verify doctor API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to verify doctor',
      message: error.message,
    }, { status: 500 });
  }
}
