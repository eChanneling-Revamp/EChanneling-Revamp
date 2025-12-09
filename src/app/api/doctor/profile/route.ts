import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

interface JWTPayload {
  email: string;
  role: string;
  [key: string]: any;
}

// Helper function to get user from token
async function getUserFromToken(req: NextRequest) {
  const token =
    req.cookies.get("authToken")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// GET /api/doctor/profile - Get doctor profile
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role?.toLowerCase() !== "doctor") {
      return NextResponse.json(
        { error: "Forbidden - Only doctors can access this endpoint" },
        { status: 403 }
      );
    }

    // Fetch doctor profile with hospital affiliations
    const doctor = await prisma.doctor.findUnique({
      where: { email: user.email },
      include: {
        hospitals: {
          where: { isActive: true },
          include: {
            hospital: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                district: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Format response
    const response = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      phonenumber: doctor.phonenumber,
      consultationFee: doctor.consultationFee.toString(),
      rating: doctor.rating?.toString() || null,
      profileImage: doctor.profileImage,
      description: doctor.description,
      languages: doctor.languages,
      availableDays: doctor.availableDays,
      isActive: doctor.isActive,
      status: doctor.status,
      hospitalAffiliations: doctor.hospitals.map((dh) => ({
        id: dh.hospital.id,
        name: dh.hospital.name,
        address: dh.hospital.address,
        city: dh.hospital.city,
        district: dh.hospital.district,
        assignedAt: dh.assignedAt,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/doctor/profile - Update doctor profile
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role?.toLowerCase() !== "doctor") {
      return NextResponse.json(
        { error: "Forbidden - Only doctors can access this endpoint" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      phonenumber,
      specialization,
      description,
      languages,
      availableDays,
    } = body;

    // Update doctor profile
    const updatedDoctor = await prisma.doctor.update({
      where: { email: user.email },
      data: {
        ...(name && { name }),
        ...(phonenumber && { phonenumber }),
        ...(specialization && { specialization }),
        ...(description !== undefined && { description }),
        ...(languages && { languages }),
        ...(availableDays && { availableDays }),
      },
      include: {
        hospitals: {
          where: { isActive: true },
          include: {
            hospital: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                district: true,
              },
            },
          },
        },
      },
    });

    // Format response
    const response = {
      id: updatedDoctor.id,
      name: updatedDoctor.name,
      email: updatedDoctor.email,
      specialization: updatedDoctor.specialization,
      qualification: updatedDoctor.qualification,
      experience: updatedDoctor.experience,
      phonenumber: updatedDoctor.phonenumber,
      consultationFee: updatedDoctor.consultationFee.toString(),
      rating: updatedDoctor.rating?.toString() || null,
      profileImage: updatedDoctor.profileImage,
      description: updatedDoctor.description,
      languages: updatedDoctor.languages,
      availableDays: updatedDoctor.availableDays,
      isActive: updatedDoctor.isActive,
      status: updatedDoctor.status,
      hospitalAffiliations: updatedDoctor.hospitals.map((dh) => ({
        id: dh.hospital.id,
        name: dh.hospital.name,
        address: dh.hospital.address,
        city: dh.hospital.city,
        district: dh.hospital.district,
        assignedAt: dh.assignedAt,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
