import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// GET hospital information
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or hospital role
    if (!["admin", "hospital"].includes(token.role as string)) {
      return NextResponse.json(
        { error: "Insufficient privileges" },
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
