import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Hospital from "@/models/Hospital";
import mongoose from "mongoose";

// GET specific hospital
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
    }

    const hospital = await Hospital.findById(id).select('-__v');
    
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Hospital retrieved successfully",
      data: hospital
    });
  } catch (error: any) {
    console.error("Error fetching hospital:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update hospital information
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or hospital role
    if (!["admin", "hospital"].includes(token.role as string)) {
      return NextResponse.json({ error: "Insufficient privileges" }, { status: 403 });
    }

    await connectDB();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
    }

    const body = await req.json();
    const updateData = { ...body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const hospital = await Hospital.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Hospital updated successfully",
      data: hospital
    });
  } catch (error: any) {
    console.error("Error updating hospital:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Hospital with this registration number, email, or tax ID already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE hospital
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can delete hospitals
    if (token.role !== "admin") {
      return NextResponse.json({ error: "Insufficient privileges" }, { status: 403 });
    }

    await connectDB();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
    }

    const hospital = await Hospital.findByIdAndDelete(id);
    
    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Hospital deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting hospital:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}