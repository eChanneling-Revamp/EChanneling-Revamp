import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/prescriptions/history?patientNIC=xxx - Get all prescriptions for a patient by NIC
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

    // Find all prescriptions for this patient NIC, only latest versions
    const prescriptions = await prisma.prescription.findMany({
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
            appointmentNumber: true,
            createdAt: true,
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

    return NextResponse.json(prescriptions);
  } catch (err: any) {
    console.error("Error fetching prescription history:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch prescription history" },
      { status: 500 }
    );
  }
}
