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
      status,
      hospitalId,
    } = body;

    // Verify the doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // If only updating hospitalId (adding existing doctor to hospital)
    if (hospitalId && Object.keys(body).length === 1) {
      // Get current hospitalId array
      const currentHospitalId = existingDoctor.hospitalId || [];

      // Check if hospital is already in the array
      if (currentHospitalId.includes(hospitalId)) {
        return NextResponse.json(
          {
            message: "Doctor is already assigned to this hospital",
            data: existingDoctor,
          },
          { status: 200 }
        );
      }

      // Add the hospital to the array
      const updatedHospitalId = [...currentHospitalId, hospitalId];

      // Update doctor and create DoctorHospital relationship
      const updatedDoctor = await prisma.doctor.update({
        where: { id: doctorId },
        data: {
          hospitalId: updatedHospitalId,
        },
      });

      // Create the DoctorHospital relationship
      await prisma.doctorHospital.upsert({
        where: {
          doctorId_hospitalId: {
            doctorId: doctorId,
            hospitalId: hospitalId,
          },
        },
        create: {
          doctorId: doctorId,
          hospitalId: hospitalId,
          isActive: true,
        },
        update: {
          isActive: true,
        },
      });

      return NextResponse.json(
        {
          message: "Doctor added to hospital successfully",
          data: updatedDoctor,
        },
        { status: 200 }
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
        ...(status && { status }), // Only update status if provided
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

    // Get hospital ID from the logged-in user
    const hospital = await prisma.hospital.findUnique({
      where: { email: userEmail || "" },
      select: { id: true },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Verify the doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Check if the doctor is assigned to this hospital
    const currentHospitalId = existingDoctor.hospitalId || [];
    if (!currentHospitalId.includes(hospital.id)) {
      return NextResponse.json(
        { error: "Doctor is not assigned to your hospital" },
        { status: 403 }
      );
    }

    // Remove the hospital from the doctor's hospitalId array
    const updatedHospitalId = currentHospitalId.filter(
      (id) => id !== hospital.id
    );

    // Update the doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        hospitalId: updatedHospitalId,
      },
    });

    // Deactivate or delete the DoctorHospital relationship
    await prisma.doctorHospital.deleteMany({
      where: {
        doctorId: doctorId,
        hospitalId: hospital.id,
      },
    });

    return NextResponse.json(
      {
        message: "Doctor removed from hospital successfully",
        data: updatedDoctor,
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
