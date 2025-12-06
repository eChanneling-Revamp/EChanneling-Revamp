import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET specific hospital
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        district: true,
        contactNumber: true,
        email: true,
        website: true,
        facilities: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        doctors: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            assignedAt: true,
            doctor: {
              select: {
                id: true,
                name: true,
                email: true,
                phonenumber: true,
                specialization: true,
                qualification: true,
                experience: true,
                consultationFee: true,
                rating: true,
                profileImage: true,
                description: true,
                languages: true,
                availableDays: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Hospital retrieved successfully",
      data: hospital,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookies
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from cookies
    const userCookie = req.cookies.get("user")?.value;
    let userRole = null;
    let userEmail = null;

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        userRole = userData.role?.toLowerCase();
        userEmail = userData.email;
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    // Check if user has admin or hospital role
    if (!["admin", "hospital"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Insufficient privileges" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // If user is hospital role, verify they own this hospital
    if (userRole === "hospital") {
      const existingHospital = await prisma.hospital.findUnique({
        where: { id },
        select: { email: true },
      });

      if (!existingHospital || existingHospital.email !== userEmail) {
        return NextResponse.json(
          { error: "You can only update your own hospital profile" },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const updateData: any = {};

    // Map fields appropriately
    if (body.name) updateData.name = body.name;
    if (body.address) updateData.address = body.address;
    if (body.city) updateData.city = body.city;
    if (body.district) updateData.district = body.district;
    if (body.contactNumber) updateData.contactNumber = body.contactNumber;
    if (body.email) updateData.email = body.email;
    if (body.website) updateData.website = body.website;
    if (body.facilities) updateData.facilities = body.facilities;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const hospital = await prisma.hospital.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        district: true,
        contactNumber: true,
        email: true,
        website: true,
        facilities: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Hospital updated successfully",
      data: hospital,
    });
  } catch (error: any) {
    console.error("Error updating hospital:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Hospital with this registration number, email, or tax ID already exists",
        },
        { status: 409 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from cookies
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from cookies
    const userCookie = req.cookies.get("user")?.value;
    let userRole = null;

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        userRole = userData.role?.toLowerCase();
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    // Only admin can delete hospitals
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Insufficient privileges" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const hospital = await prisma.hospital.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hospital deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting hospital:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
