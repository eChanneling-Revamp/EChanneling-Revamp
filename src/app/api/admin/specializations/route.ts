import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { validateData, createSpecializationSchema, updateSpecializationSchema } from '@/utils/validators';
import { ApiResponse, PaginatedResponse, SpecializationResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * GET /api/admin/specializations
 * Fetch all specializations with pagination and search
 */
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<SpecializationResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameSinhala: { contains: search, mode: 'insensitive' } },
        { nameTamil: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    // Get total count
    const total = await prisma.specialization.count({ where });

    // Get specializations with pagination
    const specializations = await prisma.specialization.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            doctors: true,
          }
        }
      }
    });

    // Format response
    const formattedSpecializations: SpecializationResponse[] = specializations.map(specialization => ({
      id: specialization.id,
      name: specialization.name,
      nameSinhala: specialization.nameSinhala,
      nameTamil: specialization.nameTamil,
      description: specialization.description,
      status: specialization.status,
      createdAt: specialization.createdAt.toISOString(),
      updatedAt: specialization.updatedAt.toISOString(),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedSpecializations,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Specializations retrieved successfully',
    });

  } catch (error: any) {
    console.error('Specializations API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch specializations',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/specializations
 * Create a new specialization
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SpecializationResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    
    // Validate input
    const validation = validateData(createSpecializationSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const specializationData = validation.data!;

    // Check if name already exists
    const existingSpecialization = await prisma.specialization.findUnique({
      where: { name: specializationData.name }
    });

    if (existingSpecialization) {
      return NextResponse.json({
        success: false,
        error: 'Specialization with this name already exists',
      }, { status: 409 });
    }

    // Create specialization
    const specialization = await prisma.specialization.create({
      data: specializationData
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'CREATE',
      entityType: 'SPECIALIZATION',
      entityId: specialization.id,
      userId: (await getUserSession(request))?.userId || 'system',
      newValues: specializationData,
    });

    const response: SpecializationResponse = {
      id: specialization.id,
      name: specialization.name,
      nameSinhala: specialization.nameSinhala,
      nameTamil: specialization.nameTamil,
      description: specialization.description,
      status: specialization.status,
      createdAt: specialization.createdAt.toISOString(),
      updatedAt: specialization.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Specialization created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create specialization API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create specialization',
      message: error.message,
    }, { status: 500 });
  }
}
