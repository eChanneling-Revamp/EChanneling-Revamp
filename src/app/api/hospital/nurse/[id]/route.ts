import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE: Delete a nurse
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params
    const { id } = await params;

    // Get auth token from cookies
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from cookies
    const userCookie = request.cookies.get("user")?.value;
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
            "Insufficient privileges. Only hospital users can delete nurses.",
        },
        { status: 403 }
      );
    }

    // Get hospital ID from database
    const hospital = await prisma.hospital.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Check if nurse exists and belongs to this hospital
    const nurse = await prisma.nurse_Detail.findUnique({
      where: { id },
      select: { hospitalId: true },
    });

    if (!nurse) {
      return NextResponse.json({ error: "Nurse not found" }, { status: 404 });
    }

    if (nurse.hospitalId !== hospital.id) {
      return NextResponse.json(
        { error: "You can only delete your own nurses" },
        { status: 403 }
      );
    }

    // Delete the nurse
    await prisma.nurse_Detail.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Nurse deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting nurse:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete nurse" },
      { status: 500 }
    );
  }
}

// PUT: Update a nurse
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params
    const { id } = await params;

    // Get auth token from cookies
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from cookies
    const userCookie = request.cookies.get("user")?.value;
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
            "Insufficient privileges. Only hospital users can update nurses.",
        },
        { status: 403 }
      );
    }

    // Get hospital ID from database
    const hospital = await prisma.hospital.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Check if nurse exists and belongs to this hospital
    const nurse = await prisma.nurse_Detail.findUnique({
      where: { id },
      select: { hospitalId: true, email: true },
    });

    if (!nurse) {
      return NextResponse.json({ error: "Nurse not found" }, { status: 404 });
    }

    if (nurse.hospitalId !== hospital.id) {
      return NextResponse.json(
        { error: "You can only update your own nurses" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      name,
      email,
      phonenumber,
      experience,
      profileImage,
      availableDays,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !email || !phonenumber) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required" },
        { status: 400 }
      );
    }

    // Check if email is already taken by another nurse
    if (email !== nurse.email) {
      const existingNurse = await prisma.nurse_Detail.findUnique({
        where: { email },
      });

      if (existingNurse) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
    }

    // Update the nurse
    const updatedNurse = await prisma.nurse_Detail.update({
      where: { id },
      data: {
        name,
        email,
        phonenumber,
        experience: experience ? parseInt(experience) : 0,
        profileImage: profileImage || null,
        availableDays: availableDays || [],
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Nurse updated successfully",
      data: updatedNurse,
    });
  } catch (error: any) {
    console.error("Error updating nurse:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update nurse" },
      { status: 500 }
    );
  }
}
