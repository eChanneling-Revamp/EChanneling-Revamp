import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { validateData, createDoctorSchema, updateDoctorSchema } from '@/utils/validators';
import { ApiResponse, PaginatedResponse, DoctorResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * GET /api/admin/doctors
 * Fetch all doctors with pagination and search
 */
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<DoctorResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const specializationId = searchParams.get('specializationId') || '';
    const hospitalId = searchParams.get('hospitalId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (specializationId) {
      where.specializationId = specializationId;
    }
    
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    // Get total count
    const total = await prisma.doctor.count({ where });

    // Get doctors with pagination
    const doctors = await prisma.doctor.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
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
        _count: {
          select: {
            invoices: true,
          }
        }
      }
    });

    // Format response
    const formattedDoctors: DoctorResponse[] = doctors.map(doctor => ({
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
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedDoctors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Doctors retrieved successfully',
    });

  } catch (error: any) {
    console.error('Doctors API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch doctors',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/doctors
 * Create a new doctor
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<DoctorResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = validateData(createDoctorSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const doctorData = validation.data!;

    // Check if email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: doctorData.email }
    });

    if (existingDoctor) {
      return NextResponse.json({
        success: false,
        error: 'Doctor with this email already exists',
      }, { status: 409 });
    }

    // Check if license number already exists
    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber: doctorData.licenseNumber }
    });

    if (existingLicense) {
      return NextResponse.json({
        success: false,
        error: 'Doctor with this license number already exists',
      }, { status: 409 });
    }

    // Verify specialization exists
    const specialization = await prisma.specialization.findUnique({
      where: { id: doctorData.specializationId }
    });

    if (!specialization) {
      return NextResponse.json({
        success: false,
        error: 'Specialization not found',
      }, { status: 404 });
    }

    // Verify hospital exists
    const hospital = await prisma.hospital.findUnique({
      where: { id: doctorData.hospitalId }
    });

    if (!hospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital not found',
      }, { status: 404 });
    }

    // Create doctor
    const doctor = await prisma.doctor.create({
      data: {
        ...doctorData,
        status: 'PENDING',
      },
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
      action: 'CREATE',
      entityType: 'DOCTOR',
      entityId: doctor.id,
      userId: (await getUserSession(request))?.userId || 'system',
      newValues: doctorData,
    });

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
      message: 'Doctor created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create doctor API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create doctor',
      message: error.message,
    }, { status: 500 });
  }
}
