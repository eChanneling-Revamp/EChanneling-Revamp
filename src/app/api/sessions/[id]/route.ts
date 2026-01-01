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

    // Transform session to include flat fields
    const transformedSession = {
      id: (session as any).id,
      doctorId: (session as any).doctorId,
      doctorName: (session as any).doctors?.name || "Unknown Doctor",
      nurseId: (session as any).nurseId,
      nurseName: (session as any).nurse_details?.name || "Unknown Nurse",
      nurseDetailId: (session as any).nurseId,
      capacity: (session as any).capacity,
      location: (session as any).location,
      hospitalId: (session as any).hospitalId,
      status: (session as any).status,
      createdAt: (session as any).createdAt,
      startTime: (session as any).startTime,
      endTime: (session as any).endTime,
      scheduledAt: (session as any).scheduledAt,
    };

    return NextResponse.json(transformedSession);
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
        status: body.status || "SCHEDULED",
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
      },
      include: {
        doctors: true,
        nurse_details: true,
        hospitals: true,
      },
    });

    // Transform session to include flat fields
    const transformedSession = {
      id: (updatedSession as any).id,
      doctorId: (updatedSession as any).doctorId,
      doctorName: (updatedSession as any).doctors?.name || "Unknown Doctor",
      nurseId: (updatedSession as any).nurseId,
      nurseName: (updatedSession as any).nurse_details?.name || "Unknown Nurse",
      nurseDetailId: (updatedSession as any).nurseId,
      capacity: (updatedSession as any).capacity,
      location: (updatedSession as any).location,
      hospitalId: (updatedSession as any).hospitalId,
      status: (updatedSession as any).status,
      createdAt: (updatedSession as any).createdAt,
      startTime: (updatedSession as any).startTime,
      endTime: (updatedSession as any).endTime,
      scheduledAt: (updatedSession as any).scheduledAt,
    };

    return NextResponse.json(transformedSession);
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
