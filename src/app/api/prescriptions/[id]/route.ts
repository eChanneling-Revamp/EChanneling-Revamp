import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/prescriptions/[id] - Get prescription by ID
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        appointment: true,
        doctor: {
          select: {
            name: true,
            specialization: true,
            email: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { message: "Prescription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (err: any) {
    console.error("Error fetching prescription:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch prescription" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/prescriptions/[id] - Update prescription (creates new version)
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get doctor email from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Decode JWT token to get email
    const jwt = require("jsonwebtoken");
    let doctorEmail: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
      doctorEmail = decoded.email;
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { htmlContent, editReason } = body;

    if (!htmlContent) {
      return NextResponse.json(
        { message: "htmlContent is required" },
        { status: 400 }
      );
    }

    // Get the current prescription
    const currentPrescription = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!currentPrescription) {
      return NextResponse.json(
        { message: "Prescription not found" },
        { status: 404 }
      );
    }

    // Verify doctor owns this prescription
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
    });

    if (!doctor || doctor.id !== currentPrescription.doctorId) {
      return NextResponse.json(
        { message: "Unauthorized to edit this prescription" },
        { status: 403 }
      );
    }

    // Mark current version as not latest
    await prisma.prescription.update({
      where: { id },
      data: { isLatestVersion: false },
    });

    // Create new version
    const newVersion = await prisma.prescription.create({
      data: {
        prescriptionNumber: currentPrescription.prescriptionNumber,
        appointmentId: currentPrescription.appointmentId,
        patientEmail: currentPrescription.patientEmail,
        doctorId: currentPrescription.doctorId,
        htmlContent,
        status: "ACTIVE",
        version: currentPrescription.version + 1,
        isLatestVersion: true,
        parentPrescriptionId: currentPrescription.parentPrescriptionId || id,
        editReason,
      },
    });

    return NextResponse.json({
      message: "Prescription updated successfully",
      prescription: newVersion,
    });
  } catch (err: any) {
    console.error("Error updating prescription:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update prescription" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/prescriptions/[id] - Delete prescription (soft delete by changing status)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get doctor email from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Decode JWT token to get email
    const jwt = require("jsonwebtoken");
    let doctorEmail: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      console.log("Decoded token:", decoded);
      
      // Try different possible email fields
      doctorEmail = decoded.email || decoded.user?.email || decoded.userEmail;
      
      if (!doctorEmail) {
        console.error("No email found in token. Token payload:", decoded);
        return NextResponse.json(
          { message: "Unauthorized - Email not found in token" },
          { status: 401 }
        );
      }
    } catch (error: any) {
      console.error("Token verification failed:", error.message);
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get the prescription
    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      return NextResponse.json(
        { message: "Prescription not found" },
        { status: 404 }
      );
    }

    // Verify doctor owns this prescription
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
    });

    if (!doctor || doctor.id !== prescription.doctorId) {
      return NextResponse.json(
        { message: "Unauthorized to delete this prescription" },
        { status: 403 }
      );
    }

    // Soft delete by changing status
    await prisma.prescription.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      message: "Prescription cancelled successfully",
    });
  } catch (err: any) {
    console.error("Error deleting prescription:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete prescription" },
      { status: 500 }
    );
  }
}
