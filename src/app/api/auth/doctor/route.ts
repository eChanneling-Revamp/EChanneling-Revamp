import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateData, createUserSchema } from '@/utils/validators';
import { ApiResponse, UserResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';

const prisma = new PrismaClient();

/**
 * POST /api/auth/doctor
 * Register a new doctor
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

    // For doctor registration, only allow DOCTOR role
    if (userData.role !== 'DOCTOR') {
      return NextResponse.json({
        success: false,
        error: 'Only DOCTOR role is allowed for doctor registration',
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
        role: 'DOCTOR', // Force DOCTOR role for doctor registration
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
      message: 'Doctor registered successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Doctor registration API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to register doctor',
      message: error.message,
    }, { status: 500 });
  }
}
