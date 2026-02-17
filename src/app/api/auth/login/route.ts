import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateAuthToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const userLog = await prisma.userLog.findUnique({ where: { email } });

    if (!userLog) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, userLog.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Try to find user profile in User table (they might have completed setup)
    const user = await prisma.user.findUnique({ where: { email } });

    // If user hasn't completed profile setup yet, create a temporary userData from UserLog
    let userData;
    let userId = userLog.id;

    if (user) {
      // User has completed setup - use their full profile
      const authRole = user.userType || user.role;
      const token = generateAuthToken({
        id: user.id,
        email: user.email,
        role: String(authRole),
      });

      userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: authRole,
      };

      // Prepare response with user data
      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: userData,
          token,
        },
        { status: 200 },
      );

      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      response.cookies.set("user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    } else {
      // User hasn't completed profile setup yet - allow login with UserLog data
      const token = generateAuthToken({
        id: userLog.id,
        email: userLog.email,
        role: userLog.role || "pending",
      });

      userData = {
        id: userLog.id,
        email: userLog.email,
        role: userLog.role,
        name: userLog.email.split("@")[0], // Use email prefix as temporary name
      };

      // Prepare response with UserLog data
      const response = NextResponse.json(
        {
          success: true,
          message: "Login successful",
          user: userData,
          token,
        },
        { status: 200 },
      );

      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      response.cookies.set("user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage = error?.message || "An error occurred during login";
    console.error("Error message:", errorMessage);
    console.error("Error stack:", error?.stack);

    return NextResponse.json(
      { error: errorMessage || "An error occurred during login" },
      { status: 500 },
    );
  }
}
