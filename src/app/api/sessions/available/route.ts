import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/sessions/available - Get available sessions for booking
 * Query params: doctorId, hospitalId, date
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const hospitalId = searchParams.get("hospitalId");
    const date = searchParams.get("date");

    const where: any = {
      status: "SCHEDULED",
    };

    if (doctorId) where.doctorId = doctorId;
    if (hospitalId) where.hospitalId = hospitalId;

    // If date is provided, filter by date range
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.startTime = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      // Only show future sessions
      where.startTime = {
        gte: new Date(),
      };
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        doctors: true,
        nurse_details: true,
        hospitals: true,
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Calculate available slots for each session
    const availableSessions = sessions
      .map((session) => ({
        ...session,
        bookedSlots: session._count.appointments,
        availableSlots: session.capacity - session._count.appointments,
        isAvailable: session._count.appointments < session.capacity,
      }))
      .filter((session) => session.isAvailable);

    return NextResponse.json(availableSessions);
  } catch (err: any) {
    console.error("Error fetching available sessions:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch available sessions" },
      { status: 500 }
    );
  }
}
