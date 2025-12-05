import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/prescriptions/last?patientNIC=xxx - Get last prescription by patient NIC
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientNIC = searchParams.get("patientNIC");

    if (!patientNIC) {
      return NextResponse.json(
        { message: "patientNIC parameter is required" },
        { status: 400 }
      );
    }

    // Find the last prescription for this patient NIC
    const lastPrescription = await prisma.prescription.findFirst({
      where: {
        appointment: {
          patientNIC: patientNIC,
        },
        isLatestVersion: true,
      },
      include: {
        appointment: {
          select: {
            patientName: true,
            patientEmail: true,
            patientNIC: true,
            patientDateOfBirth: true,
          },
        },
        doctor: {
          select: {
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastPrescription) {
      return NextResponse.json(
        { message: "No previous prescription found for this patient" },
        { status: 404 }
      );
    }

    return NextResponse.json(lastPrescription);
  } catch (err: any) {
    console.error("Error fetching last prescription:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch last prescription" },
      { status: 500 }
    );
  }
}
