import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    if (!paymentStatus) {
      return NextResponse.json(
        { message: "Payment status is required" },
        { status: 400 },
      );
    }

    // Update appointment payment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        paymentStatus: paymentStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment payment status:", error);
    return NextResponse.json(
      { message: "Failed to update payment status" },
      { status: 500 },
    );
  }
}
