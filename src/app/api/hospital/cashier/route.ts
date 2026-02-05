import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from cookies
    const userCookie = req.cookies.get("user")?.value;
    let userRole = null;
    let userEmail = null;

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        userRole = userData.role?.toLowerCase();
        userEmail = userData.email;
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    // Check if user has hospital role
    if (userRole !== "hospital") {
      return NextResponse.json(
        {
          error:
            "Insufficient privileges. Only hospital users can add cashiers.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      phonenumber,
      password,
      age,
      profileImage,
      hospitalId,
      gender,
      nic,
    } = body;

    // Validate required fields
    if (!name || !email || !phonenumber || !password || !hospitalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify the hospital belongs to the logged-in user
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { email: true },
    });

    if (!hospital || hospital.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only add cashiers to your own hospital" },
        { status: 403 },
      );
    }

    // Check if cashier with this email already exists
    const existingCashier = await prisma.cashier.findUnique({
      where: { email },
    });

    if (existingCashier) {
      return NextResponse.json(
        { error: "A cashier with this email already exists" },
        { status: 409 },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new cashier
    const cashier = await prisma.cashier.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phonenumber,
        age: age ? parseInt(age) : null,
        profileImage: profileImage || null,
        hospitalId,
        isActive: true,
        gender: gender || null,
        nic: nic || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cashier added successfully",
        data: cashier,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating cashier:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A cashier with this email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to add cashier",
      },
      { status: 500 },
    );
  }
}

// GET - Get all cashiers for a hospital
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    const where: any = {};
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    const cashiers = await prisma.cashier.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
        age: true,
        profileImage: true,
        isActive: true,
        hospitalId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Cashiers retrieved successfully",
        data: cashiers,
        count: cashiers.length,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching cashiers:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashiers" },
      { status: 500 },
    );
  }
}
