import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateData, createUserSchema } from '@/utils/validators';
import { ApiResponse, UserResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * POST /api/auth/hospital
 * Register a new hospital
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<UserResponse>>> {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(createUserSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: validation.error,
      }, { status: 400 });
    }

    const userData = validation.data!;

    // For hospital registration, only allow HOSPITAL role
    if (userData.role !== 'HOSPITAL') {
      return NextResponse.json({
        success: false,
        error: 'Only HOSPITAL role is allowed for hospital registration',
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists',
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'HOSPITAL', // Force HOSPITAL role for hospital registration
        status: 'ACTIVE',
      }
    });

    // Send Kafka event
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendUserCreatedEvent({
      userId: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
    });

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
      message: 'Hospital registered successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Hospital registration API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to register hospital',
      message: error.message,
    }, { status: 500 });
  }
}
