import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { MongooseError } from "mongoose";
import Hospital from "@/models/Hospital";
import { connectDB } from "@/lib/mongodb";


export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token: Doctor", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message: `Hello Hospital(${token.email})`,
    token,
  });
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const {
      firstName,
      lastName,
      slmcNumber,
      nicNumber,
      email,
      phoneNumber,
      specialization,
    } = await req.json();

    const hospital = await Hospital.create({
      firstName,
      lastName,
      slmcNumber,
      nicNumber,
      email,
      phoneNumber,
      specialization,
    });

    return NextResponse.json(hospital, { status: 201 });
  } catch (error: MongooseError | unknown) {
    if (error instanceof MongooseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}