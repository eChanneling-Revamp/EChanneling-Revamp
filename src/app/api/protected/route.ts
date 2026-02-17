import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const rawToken =
    req.cookies.get("authToken")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const token = rawToken ? verifyAuthToken(rawToken) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message: `Hello ${token.role} (${token.email})`,
    token,
  });
}
