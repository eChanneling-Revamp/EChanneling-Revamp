import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, role, nic } = await req.json();

    const normalizedRole = typeof role === "string" ? role.trim() : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // If role is doctor, NIC is required
    if (normalizedRole.toLowerCase() === "doctor" && !nic) {
      return NextResponse.json(
        { error: "NIC is required for doctors" },
        { status: 400 },
      );
    }

    const existing = await prisma.userLog.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userLog = await prisma.userLog.create({
      data: {
        email,
        password: hashedPassword,
        role: normalizedRole || null,
        nic: nic || null,
      },
    });

    return NextResponse.json(
      { message: "User created", email },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
