import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import Hospital from "@/models/Hospital";

// GET hospital information
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Get all hospitals or filter based on query parameters
    const { searchParams } = new URL(req.url);
    const hospitalType = searchParams.get('type');
    const isActive = searchParams.get('active');
    
    const filter: any = {};
    if (hospitalType) filter.hospitalType = hospitalType;
    if (isActive !== null) filter.isActive = isActive === 'true';
    
    const hospitals = await Hospital.find(filter).select('-__v');
    
    return NextResponse.json({
      message: "Hospitals retrieved successfully",
      data: hospitals,
      count: hospitals.length
    });
  } catch (error: any) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new hospital
export async function POST(req: NextRequest) {
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
    
    const body = await req.json();
    const {
      name,
      registrationNumber,
      address,
      taxId,
      contactNumber,
      email,
      hospitalType,
      operatingHours
    } = body;

    // Validate required fields
    if (!name || !registrationNumber || !address || !taxId || !contactNumber || !email || !hospitalType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({
      $or: [
        { registrationNumber },
        { email },
        { taxId }
      ]
    });

    if (existingHospital) {
      return NextResponse.json(
        { error: "Hospital with this registration number, email, or tax ID already exists" },
        { status: 409 }
      );
    }

    // Create new hospital
    const hospital = new Hospital({
      name,
      registrationNumber,
      address,
      taxId,
      contactNumber,
      email,
      hospitalType,
      operatingHours: operatingHours || undefined // Use default if not provided
    });

    await hospital.save();

    return NextResponse.json({
      message: "Hospital created successfully",
      data: hospital
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating hospital:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
