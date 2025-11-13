import { NextResponse } from "next/server";
import {
  createSession,
  getAllSessions,
  updateSession,
  cancelSession,
} from "@/controllers/Doctor_SessionController";

/**
 * POST /api/sessions  → create a session
 * GET /api/sessions   → get all sessions
 * PUT /api/sessions?id=xyz&action=cancel → cancel a session
 * PUT /api/sessions?id=xyz&action=update → update a session
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await createSession(body);
    return NextResponse.json(session, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await getAllSessions();
    return NextResponse.json(sessions);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    
    if (!id) {
      return NextResponse.json({ message: "Session ID required" }, { status: 400 });
    }
    
    if (action === "cancel") {
      const updated = await cancelSession(id);
      return NextResponse.json(updated);
    } else if (action === "update") {
      const body = await req.json();
      const updated = await updateSession(id, body);
      return NextResponse.json(updated);
    }
    
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


//https://ui.shadcn.com/docs/components/dialog