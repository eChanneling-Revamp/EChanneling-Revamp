import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateData, createUserSchema } from '@/utils/validators';
import { ApiResponse, UserResponse } from '@/types/api';
import { getKafkaProducer } from '@/kafka/producer';
import { mailer } from '@/config/mailer';

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Register a new user
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
        role: userData.role,
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

    // Send welcome email
    await mailer.sendEmail({
      to: user.email,
      subject: 'Welcome to EChanneling',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to EChanneling!</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for registering with EChanneling. Your account has been created successfully.</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role}</p>
          <p>You can now log in to your account and start using our healthcare platform.</p>
          <p>If you have any questions, please contact our support team.</p>
          <br>
          <p>Best regards,<br>EChanneling Team</p>
        </div>
      `,
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
      message: 'User registered successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Register API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to register user',
      message: error.message,
    }, { status: 500 });
  }
}