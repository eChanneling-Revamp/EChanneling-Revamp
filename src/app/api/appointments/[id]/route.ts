import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/appointments/[id] - Get appointment by ID
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
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

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (err: any) {
    console.error("Error fetching appointment:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/appointments/[id] - Update appointment
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};

    // Only update provided fields
    if (body.patientName !== undefined)
      updateData.patientName = body.patientName;
    if (body.patientPhone !== undefined)
      updateData.patientPhone = body.patientPhone;
    if (body.patientNIC !== undefined) updateData.patientNIC = body.patientNIC;
    if (body.appointmentDate !== undefined)
      updateData.appointmentDate = new Date(body.appointmentDate);
    if (body.appointmentTime !== undefined)
      updateData.appointmentTime = new Date(body.appointmentTime);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.paymentStatus !== undefined)
      updateData.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.cancellationReason !== undefined)
      updateData.cancellationReason = body.cancellationReason;
    if (body.medicalHistory !== undefined)
      updateData.medicalHistory = body.medicalHistory;
    if (body.currentMedications !== undefined)
      updateData.currentMedications = body.currentMedications;
    if (body.allergies !== undefined) updateData.allergies = body.allergies;

    // If cancelling, set cancellation date
    if (body.status === "CANCELLED") {
      updateData.cancellationDate = new Date();
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(appointment);
  } catch (err: any) {
    console.error("Error updating appointment:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update appointment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id] - Delete appointment
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting appointment:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
