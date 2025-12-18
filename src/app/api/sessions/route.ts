import { NextResponse } from "next/server";
import {
  createSession,
  getAllSessions,
  cancelSession,
  deleteSession,
} from "@/controllers/sessionController";

/**
 * POST /api/sessions  → create a session
 * GET /api/sessions   → get all sessions
 * PUT /api/sessions?id=xyz&action=cancel → cancel a session
 * DELETE /api/sessions?id=xyz → delete a session
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await createSession(body);

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

    return NextResponse.json(transformedSession, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const hospitalId = searchParams.get("hospitalId");

    const sessions = await getAllSessions(doctorId, hospitalId);

    // Transform sessions to include flat doctorName and nurseName fields
    const transformedSessions = sessions.map((session: any) => ({
      id: session.id,
      doctorId: session.doctorId,
      doctorName: session.doctors?.name || "Unknown Doctor",
      nurseId: session.nurseId,
      nurseName: session.nurse_details?.name || "Unknown Nurse",
      nurseDetailId: session.nurseId,
      capacity: session.capacity,
      location: session.location,
      hospitalId: session.hospitalId,
      status: session.status,
      createdAt: session.createdAt,
      startTime: session.startTime,
      endTime: session.endTime,
      scheduledAt: session.scheduledAt,
    }));

    return NextResponse.json(transformedSessions);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    if (!id)
      return NextResponse.json(
        { message: "Session ID required" },
        { status: 400 }
      );
    if (action === "cancel") {
      const updated = await cancelSession(id);
      return NextResponse.json(updated);
    }
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { message: "Session ID required" },
        { status: 400 }
      );
    const deleted = await deleteSession(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
