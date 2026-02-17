import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/config/mailer";

/**
 * POST /api/appointments/[id]/complete - Mark appointment as SERVED and send completion email
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Get appointment with related data
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            doctors: true,
            hospitals: true,
          },
        },
        prescriptions: {
          where: {
            isLatestVersion: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    // Check if appointment can be completed
    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Cannot complete a cancelled appointment" },
        { status: 400 },
      );
    }

    if (appointment.status === "SERVED") {
      return NextResponse.json(
        { error: "Appointment is already marked as served" },
        { status: 400 },
      );
    }

    // Update appointment status to SERVED
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: "SERVED",
        updatedAt: new Date(),
      },
      include: {
        session: {
          include: {
            doctors: true,
            hospitals: true,
          },
        },
        prescriptions: {
          where: {
            isLatestVersion: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Send completion email to patient
    try {
      const doctor = updatedAppointment.session?.doctors;
      const prescription = updatedAppointment.prescriptions?.[0];

      if (doctor) {
        const emailContent = emailTemplates.appointmentCompleted(
          updatedAppointment.patientName,
          doctor.name,
          updatedAppointment.appointmentNumber,
          updatedAppointment.consultationFee.toString(),
          prescription?.prescriptionNumber,
        );

        await sendEmail({
          to: updatedAppointment.patientEmail,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        console.log(
          `✅ Completion email sent to ${updatedAppointment.patientEmail}`,
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending completion email:", emailError);
      // Continue even if email fails - appointment is already updated
    }

    return NextResponse.json({
      success: true,
      message: "Appointment marked as completed successfully",
      data: updatedAppointment,
    });
  } catch (err: any) {
    console.error("Error completing appointment:", err);
    return NextResponse.json(
      {
        error: "Failed to complete appointment",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
