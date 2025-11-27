import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Check if hospital data exists for logged-in user
export async function GET(req: NextRequest) {
  try {
    // Get user email from query parameter
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Check if hospital with this email exists
    const hospital = await prisma.hospital.findFirst({
      where: {
        email: email,
      },
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
      exists: !!hospital,
      data: hospital,
    });
  } catch (error: any) {
    console.error("Error checking hospital data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
