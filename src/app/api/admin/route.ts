import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    if (token.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: "Forbidden - Admin access required" 
      }, { status: 403 });
    }

    return NextResponse.json({
      message: `Hello Admin (${token.email})`,
      user: {
        id: token.userId,
        email: token.email,
        name: token.name,
        role: token.role,
      },
    });
  } catch (error) {
    console.error("Admin route error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
