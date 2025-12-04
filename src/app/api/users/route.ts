import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/users - Create a new user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: body.role || "AGENT",
        companyName: body.companyName,
        contactNumber: body.contactNumber,
        isActive: body.isActive !== undefined ? body.isActive : true,
        isEmailVerified: body.isEmailVerified || false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        contactNumber: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password from response
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users - Get all users with optional filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");
    const email = searchParams.get("email");

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    if (email) {
      where.email = {
        contains: email,
        mode: "insensitive",
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        contactNumber: true,
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and sensitive tokens
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users, count: users.length }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}
