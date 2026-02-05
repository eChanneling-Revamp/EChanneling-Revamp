import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find cashier by email
    const cashier = await prisma.cashier.findUnique({
      where: { email },
    });

    if (!cashier) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if cashier is active
    if (!cashier.isActive) {
      return NextResponse.json(
        {
          error:
            "Account is inactive. Please contact your hospital administrator.",
        },
        { status: 403 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, cashier.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = sign(
      {
        id: cashier.id,
        email: cashier.email,
        role: "cashier",
        hospitalId: cashier.hospitalId,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Get hospital info
    const hospital = await prisma.hospital.findUnique({
      where: { id: cashier.hospitalId },
      select: { id: true, name: true },
    });

    // Prepare user data (exclude password)
    const userData = {
      id: cashier.id,
      name: cashier.name,
      email: cashier.email,
      role: "cashier",
      hospitalId: cashier.hospitalId,
      hospitalName: hospital?.name || "",
      profileImage: cashier.profileImage,
    };

    // Set cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userData,
        token,
      },
      { status: 200 },
    );

    // Set HTTP-only cookie with token
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Set user data cookie
    response.cookies.set("user", JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Cashier login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
