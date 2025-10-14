import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, setupKey } = await req.json();

    // Check if setup key is provided (for security)
    const validSetupKey = process.env.ADMIN_SETUP_KEY || "setup-admin-2024";
    if (setupKey !== validSetupKey) {
      return NextResponse.json(
        { error: "Invalid setup key" },
        { status: 403 }
      );
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists. Use the update endpoint instead." },
        { status: 409 }
      );
    }

    // Check if user with email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: name || "Administrator",
        email,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date(),
      }
    });

    return NextResponse.json({
      message: "Admin user created successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if any admin exists
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    return NextResponse.json({
      adminExists: adminCount > 0,
      adminCount,
      message: adminCount > 0 
        ? "Admin user already exists" 
        : "No admin user found. Use POST to create one."
    });

  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}