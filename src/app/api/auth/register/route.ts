import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create a new user with Better Auth
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
