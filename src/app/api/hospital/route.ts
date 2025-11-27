import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET hospital information
export async function GET(req: NextRequest) {
  try {
    // Get all hospitals or filter based on query parameters
    const { searchParams } = new URL(req.url);
    const hospitalType = searchParams.get("type");
    const isActive = searchParams.get("active");

    const where: any = {};
    if (hospitalType) where.hospitalType = hospitalType;
    if (isActive !== null) where.isActive = isActive === "true";

    const hospitals = await prisma.hospital.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        district: true,
        contactNumber: true,
        email: true,
        website: true,
        facilities: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            doctors: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Hospitals retrieved successfully",
      data: hospitals,
      count: hospitals.length,
    });
  } catch (error: any) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new hospital
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

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        userRole = userData.role?.toLowerCase();
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    // Check if user has hospital role
    if (userRole !== "hospital") {
      return NextResponse.json(
        {
          error:
            "Insufficient privileges. Only hospital users can create hospital profiles.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      address,
      city,
      district,
      contactNumber,
      email,
      website,
      facilities,
    } = body;

    // Validate required fields
    if (!name || !address || !city || !district || !contactNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if hospital already exists
    const existingHospital = await prisma.hospital.findFirst({
      where: {
        email,
      },
    });

    if (existingHospital) {
      return NextResponse.json(
        {
          error: "Hospital with this email already exists",
        },
        { status: 409 }
      );
    }

    // Create new hospital
    const hospital = await prisma.hospital.create({
      data: {
        name,
        address,
        city,
        district,
        contactNumber,
        email,
        website: website || null,
        facilities: facilities || [],
      },
    });

    return NextResponse.json(
      {
        message: "Hospital created successfully",
        data: hospital,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating hospital:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    
    // Return more specific error message
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message || "Failed to create hospital"
      },
      { status: 500 }
    );
  }
}
