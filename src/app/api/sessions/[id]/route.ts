import { NextResponse } from "next/server";
import { getSessionById } from "@/controllers/sessionController";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionById(id);
    if (!session)
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    return NextResponse.json(session);
  } catch (err: any) {
    console.error("🔥 GET /api/sessions/[id] error:", err);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err?.message || err?.toString(),
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Get the first nurse from Nurse table (required for foreign key)
    const firstNurse = await prisma.nurse.findFirst();

    if (!firstNurse) {
      return NextResponse.json(
        { message: "No nurses found in the system" },
        { status: 400 }
      );
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        doctorId: body.doctorId,
        doctorName: body.doctorName,
        nurseId: firstNurse.id, // Required for FK constraint
        nurseName: body.nurseName || null,
        nurseDetailId: body.nurseId, // Store actual nurse detail ID
        capacity: body.capacity || 20,
        location: body.location || null,
        hospitalId: body.hospitalId,
        status: body.status || "scheduled",
        startTime: body.startTime ? new Date(body.startTime) : null,
        endTime: body.endTime ? new Date(body.endTime) : null,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (err: any) {
    console.error("Error updating session:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update session" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting session:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete session" },
      { status: 500 }
    );
  }
}
