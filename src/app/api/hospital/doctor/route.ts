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
          error:
            "Insufficient privileges. Only hospital users can add doctors.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      email,
      phonenumber,
      specialization,
      qualification,
      experience,
      consultationFee,
      description,
      profileImage,
      languages,
      availableDays,
      hospitalId,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phonenumber ||
      !specialization ||
      !qualification ||
      experience === undefined ||
      consultationFee === undefined ||
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
        { error: "You can only add doctors to your own hospital" },
        { status: 403 }
      );
    }

    // Check if doctor with this email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: "A doctor with this email already exists" },
        { status: 409 }
      );
    }

    // Create new doctor
    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        phonenumber,
        specialization,
        qualification,
        experience: parseInt(experience),
        consultationFee: parseFloat(consultationFee),
        description: description || null,
        profileImage: profileImage || null,
        languages: languages || [],
        availableDays: availableDays || [],
        hospitalId,
        isActive: true,
        status: "PENDING", // Default status for new doctors
      },
    });

    return NextResponse.json(
      {
        message: "Doctor added successfully",
        data: doctor,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A doctor with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to add doctor",
      },
      { status: 500 }
    );
  }
}

// GET - Get all doctors for a hospital or get a specific doctor by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");
    const email = searchParams.get("email");

    // If email is provided, fetch specific doctor
    if (email) {
      const doctor = await prisma.doctor.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phonenumber: true,
          specialization: true,
          qualification: true,
          experience: true,
          consultationFee: true,
          rating: true,
          profileImage: true,
          description: true,
          languages: true,
          availableDays: true,
          isActive: true,
          status: true,
          hospitalId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!doctor) {
        return NextResponse.json(
          { error: "Doctor not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Doctor retrieved successfully",
        data: doctor,
      });
    }

    // Otherwise, require hospitalId to list all doctors
    if (!hospitalId) {
      return NextResponse.json(
        { error: "Hospital ID or email is required" },
        { status: 400 }
      );
    }

    const doctors = await prisma.doctor.findMany({
      where: {
        hospitalId: hospitalId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phonenumber: true,
        specialization: true,
        qualification: true,
        experience: true,
        consultationFee: true,
        rating: true,
        profileImage: true,
        description: true,
        languages: true,
        availableDays: true,
        isActive: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Doctors retrieved successfully",
      data: doctors,
      count: doctors.length,
    });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
