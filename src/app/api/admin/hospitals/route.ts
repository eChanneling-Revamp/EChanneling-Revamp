import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { validateData, createHospitalSchema, updateHospitalSchema } from '@/utils/validators';
import { ApiResponse, PaginatedResponse, HospitalResponse, SearchParams } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * GET /api/admin/hospitals
 * Fetch all hospitals with pagination and search
 */
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<HospitalResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const city = searchParams.get('city') || '';
    const province = searchParams.get('province') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { province: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    if (province) {
      where.province = { contains: province, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.hospital.count({ where });

    // Get hospitals with pagination
    const hospitals = await prisma.hospital.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: {
            doctors: true,
            branches: true,
          }
        }
      }
    });

    // Format response
    const formattedHospitals: HospitalResponse[] = hospitals.map(hospital => ({
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
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedHospitals,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Hospitals retrieved successfully',
    });

  } catch (error: any) {
    console.error('Hospitals API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hospitals',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/hospitals
 * Create a new hospital
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<HospitalResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = validateData(createHospitalSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const hospitalData = validation.data!;

    // Check if email already exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { email: hospitalData.email }
    });

    if (existingHospital) {
      return NextResponse.json({
        success: false,
        error: 'Hospital with this email already exists',
      }, { status: 409 });
    }

    // Check if registration number already exists
    const existingRegNumber = await prisma.hospital.findUnique({
      where: { registrationNumber: hospitalData.registrationNumber }
    });

    if (existingRegNumber) {
      return NextResponse.json({
        success: false,
        error: 'Hospital with this registration number already exists',
      }, { status: 409 });
    }

    // Check if license number already exists
    const existingLicense = await prisma.hospital.findUnique({
      where: { licenseNumber: hospitalData.licenseNumber }
    });

    if (existingLicense) {
      return NextResponse.json({
        success: false,
        error: 'Hospital with this license number already exists',
      }, { status: 409 });
    }

    // Create hospital
    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalData,
        status: 'PENDING_APPROVAL',
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'CREATE',
      entityType: 'HOSPITAL',
      entityId: hospital.id,
      userId: (await getUserSession(request))?.userId || 'system',
      newValues: hospitalData,
    });

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
      message: 'Hospital created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create hospital API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create hospital',
      message: error.message,
    }, { status: 500 });
  }
}
