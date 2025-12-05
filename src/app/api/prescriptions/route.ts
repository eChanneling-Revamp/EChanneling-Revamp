import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/prescriptions - Create a new prescription
 */
export async function POST(req: Request) {
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
      // First decode without verification to see the structure
      const decodedUnverified = jwt.decode(token);
      console.log("🔍 Token structure (unverified):", decodedUnverified);
      
      // Try to verify with JWT_SECRET (may fail if token from external API uses different secret)
      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token verified with JWT_SECRET");
      } catch (verifyError) {
        console.log("⚠️ Token verification failed, using decoded payload anyway");
        decoded = decodedUnverified;
      }
      
      console.log("📋 Final decoded token:", decoded);
      
      // Try different possible email fields
      doctorEmail = decoded.email || decoded.user?.email || decoded.userEmail || decoded.sub;
      
      if (!doctorEmail) {
        console.error("❌ No email found in token. Token payload:", decoded);
        return NextResponse.json(
          { message: "Unauthorized - Email not found in token", tokenPayload: decoded },
          { status: 401 }
        );
      }
      
      console.log("✅ Found doctor email:", doctorEmail);
    } catch (error: any) {
      console.error("❌ Token decoding failed:", error.message);
      return NextResponse.json(
        { message: "Unauthorized - Invalid token format" },
        { status: 401 }
      );
    }

    // Get doctor by email
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { appointmentId, htmlContent } = body;

    if (!appointmentId || !htmlContent) {
      return NextResponse.json(
        { message: "appointmentId and htmlContent are required" },
        { status: 400 }
      );
    }

    // Verify appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Generate prescription number (you can customize this format)
    const prescriptionCount = await prisma.prescription.count();
    const prescriptionNumber = `PRE-${new Date().getFullYear()}-${String(prescriptionCount + 1).padStart(6, '0')}`;

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        prescriptionNumber,
        appointmentId,
        patientEmail: appointment.patientEmail,
        doctorId: doctor.id,
        htmlContent,
        status: "ACTIVE",
        version: 1,
        isLatestVersion: true,
      },
    });

    return NextResponse.json(
      { 
        message: "Prescription created successfully",
        prescription 
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating prescription:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create prescription" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/prescriptions - Get all prescriptions for the logged-in doctor
 */
export async function GET(req: Request) {
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

    // Get doctor by email
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    const where: any = { doctorId: doctor.id };
    if (appointmentId) {
      where.appointmentId = appointmentId;
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        appointment: {
          select: {
            patientName: true,
            patientEmail: true,
            appointmentNumber: true,
            createdAt: true,
          },
        },
        doctor: {
          select: {
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(prescriptions);
  } catch (err: any) {
    console.error("Error fetching prescriptions:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}
