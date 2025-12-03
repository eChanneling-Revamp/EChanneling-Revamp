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

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        doctorId: body.doctorId,
        nurseId: body.nurseId,
        capacity: body.capacity || 5,
        location: body.location,
        hospitalId: body.hospitalId,
        status: body.status || "scheduled",
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
      },
      include: {
        doctors: true,
        nurse_details: true,
        hospitals: true,
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
