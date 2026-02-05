import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE - Delete a cashier
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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

    // Check if user has hospital role
    if (userRole !== "hospital") {
      return NextResponse.json(
        {
          error:
            "Insufficient privileges. Only hospital users can delete cashiers.",
        },
        { status: 403 },
      );
    }

    // Get the cashier to verify it belongs to the hospital
    const cashier = await prisma.cashier.findUnique({
      where: { id },
      select: { hospitalId: true },
    });

    if (!cashier) {
      return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
    }

    // Verify the hospital belongs to the logged-in user
    const hospital = await prisma.hospital.findUnique({
      where: { id: cashier.hospitalId },
      select: { email: true },
    });

    if (!hospital || hospital.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only delete cashiers from your own hospital" },
        { status: 403 },
      );
    }

    // Delete the cashier
    await prisma.cashier.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cashier deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting cashier:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to delete cashier",
      },
      { status: 500 },
    );
  }
}

// GET - Get a single cashier by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const cashier = await prisma.cashier.findUnique({
      where: { id },
    });

    if (!cashier) {
      return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: cashier,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching cashier:", error);
    return NextResponse.json(
      { error: "Failed to fetch cashier" },
      { status: 500 },
    );
  }
}

// PUT - Update a cashier
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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

    // Check if user has hospital role
    if (userRole !== "hospital") {
      return NextResponse.json(
        {
          error:
            "Insufficient privileges. Only hospital users can update cashiers.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, email, phonenumber, age, profileImage, isActive } = body;

    // Get the cashier to verify it belongs to the hospital
    const existingCashier = await prisma.cashier.findUnique({
      where: { id },
      select: { hospitalId: true },
    });

    if (!existingCashier) {
      return NextResponse.json({ error: "Cashier not found" }, { status: 404 });
    }

    // Verify the hospital belongs to the logged-in user
    const hospital = await prisma.hospital.findUnique({
      where: { id: existingCashier.hospitalId },
      select: { email: true },
    });

    if (!hospital || hospital.email !== userEmail) {
      return NextResponse.json(
        { error: "You can only update cashiers from your own hospital" },
        { status: 403 },
      );
    }

    // Update the cashier
    const updatedCashier = await prisma.cashier.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phonenumber && { phonenumber }),
        ...(age !== undefined && { age: age ? parseInt(age) : null }),
        ...(profileImage !== undefined && { profileImage }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cashier updated successfully",
        data: updatedCashier,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating cashier:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Failed to update cashier",
      },
      { status: 500 },
    );
  }
}
