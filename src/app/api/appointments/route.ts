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
        { status: 400 },
      );
    }

    // For walk-in appointments (created by cashier), bookedById is optional
    // For online bookings, bookedById is required
    if (!body.bookedById && body.bookingType !== "walk-in") {
      return NextResponse.json(
        { error: "Booked by user ID is required for online bookings" },
        { status: 400 },
      );
    }

    // Validate user exists only if bookedById is provided
    if (body.bookedById) {
      const user = await prisma.user.findUnique({
        where: { id: body.bookedById },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found. Please provide a valid bookedById" },
          { status: 404 },
        );
      }
    }

    // Validate session exists and has capacity
    const session = await prisma.session.findUnique({
      where: { id: body.sessionId },
      include: {
        _count: {
          select: { appointments: true },
        },
        doctors: true, // Include doctor to get consultation fee
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found. Please provide a valid sessionId" },
        { status: 404 },
      );
    }

    if (session._count.appointments >= session.capacity) {
      return NextResponse.json(
        { error: "Session is fully booked" },
        { status: 400 },
      );
    }

    // Get doctor's consultation fee from the session
    const doctorConsultationFee = session.doctors?.consultationFee || 0;
    const consultationFee = body.consultationFee || doctorConsultationFee;
    const totalAmount = body.totalAmount || consultationFee;

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
        bookedById: body.bookedById || null, // Allow null for walk-in appointments
        queuePosition,
        estimatedWaitTime: body.estimatedWaitTime || null,
        status: body.status || "CONFIRMED",
        paymentStatus: body.paymentStatus || "PENDING",
        consultationFee: consultationFee,
        totalAmount: totalAmount,
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
        users: body.bookedById ? true : false, // Only include users if bookedById is provided
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment created successfully",
        data: appointment,
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Error creating appointment:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack,
    });

    // Handle Prisma foreign key constraint errors
    if (err.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Invalid sessionId or bookedById - referenced record does not exist",
          details: err.meta,
        },
        { status: 400 },
      );
    }

    // Handle unique constraint violations
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Appointment number already exists" },
        { status: 409 },
      );
    }

    // Handle missing required fields
    if (err.code === "P2000" || err.code === "P2001") {
      return NextResponse.json(
        { error: "Missing required field", details: err.meta },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: err.message || "Failed to create appointment",
        details: err.meta || err.code || "Unknown error",
      },
      { status: 500 },
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
    const hospitalId = searchParams.get("hospitalId");

    const where: any = {};

    if (sessionId) where.sessionId = sessionId;
    if (patientEmail) where.patientEmail = patientEmail;
    if (status) where.status = status;
    if (bookedById) where.bookedById = bookedById;

    // Filter by hospital through session relation
    if (hospitalId) {
      where.session = {
        hospitalId: hospitalId,
      };
    }

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

    // Transform appointments to include flat fields
    const transformedAppointments = appointments.map((appointment: any) => ({
      id: appointment.id,
      appointmentNumber: appointment.appointmentNumber,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone,
      patientNIC: appointment.patientNIC,
      patientDateOfBirth: appointment.patientDateOfBirth,
      patientAge: appointment.patientAge,
      patientGender: appointment.patientGender,
      emergencyContactName: appointment.emergencyContactName,
      emergencyContactPhone: appointment.emergencyContactPhone,
      medicalHistory: appointment.medicalHistory,
      currentMedications: appointment.currentMedications,
      allergies: appointment.allergies,
      insuranceProvider: appointment.insuranceProvider,
      insurancePolicyNumber: appointment.insurancePolicyNumber,
      isNewPatient: appointment.isNewPatient,
      queuePosition: appointment.queuePosition,
      estimatedWaitTime: appointment.estimatedWaitTime,
      consultationFee: appointment.consultationFee,
      totalAmount: appointment.totalAmount,
      sessionDate:
        appointment.session?.startTime || appointment.session?.scheduledAt,
      sessionTime:
        appointment.session?.startTime && appointment.session?.endTime
          ? `${new Date(appointment.session.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(appointment.session.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
          : "",
      doctorName: appointment.session?.doctors?.name || "Unknown",
      status: appointment.status,
      paymentStatus: appointment.paymentStatus,
      bookingType: appointment.isNewPatient ? "walk-in" : "online",
      notes: appointment.notes,
      cancellationReason: appointment.cancellationReason,
      cancellationDate: appointment.cancellationDate,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      session: appointment.session,
    }));

    return NextResponse.json({
      success: true,
      message: "Appointments retrieved successfully",
      data: transformedAppointments,
      count: transformedAppointments.length,
    });
  } catch (err: any) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
