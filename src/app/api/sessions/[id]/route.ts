import { NextResponse } from "next/server";
import { getSessionById } from "@/controllers/Doctor_SessionController";
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionById(params.id);
    if (!session)
      return NextResponse.json({ message: "Session not found" }, { status: 404 });
    return NextResponse.json(session);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
