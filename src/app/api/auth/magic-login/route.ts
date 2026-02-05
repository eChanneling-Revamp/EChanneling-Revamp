import { NextResponse } from "next/server";
import { verifyMagicLinkToken } from "@/lib/jwt";
import axios from "axios";

const EXTERNAL_API_URL = "https://dpdlab1.slt.lk:8645/auth/api";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 },
      );
    }

    // Verify the JWT token
    const payload = verifyMagicLinkToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Verify user exists in external API
    try {
      // You might need to implement a user verification endpoint in your external API
      // For now, we'll return the user data from the token

      const user = {
        email: payload.email,
        name: payload.name,
        phoneNumber: payload.phoneNumber,
        role: payload.role,
        createdByHospital: payload.createdByHospital || false,
        hospitalId: payload.hospitalId || null,
        hospitalName: payload.hospitalName || null,
      };

      const hospitalInfo = payload.hospitalId
        ? {
            hospitalId: payload.hospitalId,
            hospitalName: payload.hospitalName,
          }
        : null;

      // Create response with cookies
      const response = NextResponse.json({
        success: true,
        user,
        hospitalInfo,
        message: "Login successful",
      });

      // Set auth cookies for API access
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      response.cookies.set("user", JSON.stringify(user), {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    } catch (error: any) {
      console.error("User verification error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to verify user account",
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Magic login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
