import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/appointments - Create a new appointment
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!body.bookedById) {
      return NextResponse.json(
        { error: "Booked by user ID is required" },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: body.bookedById },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please provide a valid bookedById" },
        { status: 404 }
      );
    }

    // Validate session exists and has capacity
    const session = await prisma.session.findUnique({
      where: { id: body.sessionId },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found. Please provide a valid sessionId" },
        { status: 404 }
      );
    }

    if (session._count.appointments >= session.capacity) {
      return NextResponse.json(
        { error: "Session is fully booked" },
        { status: 400 }
      );
    }

    // Generate unique appointment number
    const appointmentNumber = `APT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Get queue position
    const queuePosition =
      (await prisma.appointment.count({
        where: {
          sessionId: body.sessionId,
          status: { in: ["CONFIRMED", "RESCHEDULED"] },
        },
      })) + 1;

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNumber,
        patientName: body.patientName,
        patientEmail: body.patientEmail,
        patientPhone: body.patientPhone,
        patientNIC: body.patientNIC || null,
        patientDateOfBirth: body.patientDateOfBirth
          ? new Date(body.patientDateOfBirth)
          : null,
        patientGender: body.patientGender || null,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        medicalHistory: body.medicalHistory || null,
        currentMedications: body.currentMedications || null,
        allergies: body.allergies || null,
        insuranceProvider: body.insuranceProvider || null,
        insurancePolicyNumber: body.insurancePolicyNumber || null,
        isNewPatient: body.isNewPatient ?? true,
        sessionId: body.sessionId,
        bookedById: body.bookedById,
        queuePosition,
        estimatedWaitTime: body.estimatedWaitTime || null,
        status: body.status || "CONFIRMED",
        paymentStatus: body.paymentStatus || "PENDING",
        consultationFee: body.consultationFee,
        totalAmount: body.totalAmount,
        notes: body.notes || null,
      } as any,
      include: {
        session: {
          include: {
            doctors: true,
            hospitals: true,
            nurse_details: true,
          },
        },
        users: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (err: any) {
    console.error("Error creating appointment:", err);

    // Handle Prisma foreign key constraint errors
    if (err.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Invalid sessionId or bookedById - referenced record does not exist",
        },
        { status: 400 }
      );
    }

    // Handle unique constraint violations
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Appointment number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments - Get all appointments with optional filtering
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const patientEmail = searchParams.get("patientEmail");
    const status = searchParams.get("status");
    const bookedById = searchParams.get("bookedById");

    const where: any = {};

    if (sessionId) where.sessionId = sessionId;
    if (patientEmail) where.patientEmail = patientEmail;
    if (status) where.status = status;
    if (bookedById) where.bookedById = bookedById;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        session: {
          include: {
            doctors: true,
            hospitals: true,
            nurse_details: true,
          },
        },
        users: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (err: any) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
