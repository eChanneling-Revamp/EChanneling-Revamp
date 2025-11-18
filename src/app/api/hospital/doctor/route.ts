import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      email,
      specialization,
      qualification,
      experience,
      consultationFee,
      hospitalId,
    } = await req.json();

    // Validate required fields
    if (!name || !email || !specialization || !qualification || !hospitalId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        email,
        specialization,
        qualification,
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        hospitalId,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error: any) {
    console.error("Error creating doctor:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Doctor with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
