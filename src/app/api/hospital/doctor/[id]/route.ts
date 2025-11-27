import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Update a doctor
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
            "Insufficient privileges. Only hospital users can update doctors.",
        },
        { status: 403 }
      );
    }

    const { id: doctorId } = await params;
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
      isActive,
    } = body;

    // Verify the doctor exists and belongs to the logged-in hospital
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospitals: {
          select: { email: true },
        },
      },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    if (existingDoctor.hospitals.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only update doctors from your own hospital" },
        { status: 403 }
      );
    }

    // If email is being changed, check if it's already in use
    if (email !== existingDoctor.email) {
      const emailExists = await prisma.doctor.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "A doctor with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Update the doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
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
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        message: "Doctor updated successfully",
        data: updatedDoctor,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating doctor:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A doctor with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to update doctor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a doctor
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
            "Insufficient privileges. Only hospital users can delete doctors.",
        },
        { status: 403 }
      );
    }

    const { id: doctorId } = await params;

    // Verify the doctor exists and belongs to the logged-in hospital
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        hospitals: {
          select: { email: true },
        },
      },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    if (existingDoctor.hospitals.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only delete doctors from your own hospital" },
        { status: 403 }
      );
    }

    // Delete the doctor
    await prisma.doctor.delete({
      where: { id: doctorId },
    });

    return NextResponse.json(
      {
        message: "Doctor deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting doctor:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to delete doctor",
      },
      { status: 500 }
    );
  }
}
