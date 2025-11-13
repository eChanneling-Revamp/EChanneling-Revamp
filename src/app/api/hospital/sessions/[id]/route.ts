import { NextResponse } from "next/server";
import { getSessionById } from "@/controllers/Hospital_SessionController";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionById(params.id);
    if (!session)
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
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
