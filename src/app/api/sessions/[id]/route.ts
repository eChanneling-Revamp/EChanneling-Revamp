import { NextResponse } from "next/server";
import { getSessionById } from "@/controllers/sessionController";

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
