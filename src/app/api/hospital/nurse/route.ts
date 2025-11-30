import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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
          error: "Insufficient privileges. Only hospital users can add nurses.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      phonenumber,
      experience,
      profileImage,
      availableDays,
      hospitalId,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phonenumber ||
      experience === undefined ||
      !hospitalId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the hospital belongs to the logged-in user
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: { email: true },
    });

    if (!hospital || hospital.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only add nurses to your own hospital" },
        { status: 403 }
      );
    }

    // Check if nurse with this email already exists
    const existingNurse = await prisma.nurse_Detail.findUnique({
      where: { email },
    });

    if (existingNurse) {
      return NextResponse.json(
        { error: "A nurse with this email already exists" },
        { status: 409 }
      );
    }

    // Create new nurse
    const nurse = await prisma.nurse_Detail.create({
      data: {
        name,
        email,
        phonenumber,
        experience: parseInt(experience),
        profileImage: profileImage || null,
        availableDays: availableDays || [],
        hospitalId,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: "Nurse added successfully",
        data: nurse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating nurse:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A nurse with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to add nurse",
      },
      { status: 500 }
    );
  }
}

// GET - Get all nurses for a hospital
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    const where: any = {};
    if (hospitalId) {
      where.hospitalId = hospitalId;
    }

    const nurses = await prisma.nurse_Detail.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
        experience: true,
        profileImage: true,
        availableDays: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Nurses retrieved successfully",
      data: nurses,
      count: nurses.length,
    });
  } catch (error: any) {
    console.error("Error fetching nurses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
