import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const rawToken =
      req.cookies.get("authToken")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const token = rawToken ? verifyAuthToken(rawToken) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get doctor by email from token
    const doctor = await prisma.doctor.findUnique({
      where: { email: token.email as string },
      include: {
        sessions: {
          include: {
            appointments: true,
            hospitals: true,
          },
        },
        prescriptions: {
          include: {
            appointment: true,
          },
        },
        hospitals: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Calculate statistics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const upcomingSessions = doctor.sessions.filter(
      (s) => new Date(s.scheduledAt) > now,
    );

    const todaySessions = doctor.sessions.filter((s) => {
      const sessionDate = new Date(s.scheduledAt);
      return (
        sessionDate.toDateString() === now.toDateString() &&
        new Date(s.startTime) > now
      );
    });

    const completedAppointments = doctor.sessions.reduce((sum, session) => {
      return (
        sum +
        session.appointments.filter((a) => a.status === "COMPLETED").length
      );
    }, 0);

    const thisMonthAppointments = doctor.sessions.reduce((sum, session) => {
      return (
        sum +
        session.appointments.filter((a) => {
          const appointmentDate = new Date(a.createdAt);
          return appointmentDate >= thisMonth && appointmentDate < nextMonth;
        }).length
      );
    }, 0);

    const recentAppointments = doctor.sessions
      .flatMap((s) => s.appointments)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    const prescriptionsThisMonth = doctor.prescriptions.filter((p) => {
      const prescriptionDate = new Date(p.createdAt);
      return prescriptionDate >= thisMonth && prescriptionDate < nextMonth;
    });

    const appointmentsThisWeek = doctor.sessions.reduce((sum, session) => {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      return (
        sum +
        session.appointments.filter((a) => {
          const appointmentDate = new Date(a.createdAt);
          return appointmentDate >= weekStart && appointmentDate < weekEnd;
        }).length
      );
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experience,
          rating: doctor.rating,
          profileImage: doctor.profileImage,
          consultationFee: doctor.consultationFee,
          status: doctor.status,
        },
        statistics: {
          totalAppointments: doctor.sessions.reduce(
            (sum, s) => sum + s.appointments.length,
            0,
          ),
          completedAppointments,
          thisMonthAppointments,
          appointmentsThisWeek,
          totalPrescriptions: doctor.prescriptions.length,
          prescriptionsThisMonth: prescriptionsThisMonth.length,
          rating: doctor.rating?.toString() || "0",
          totalSessions: doctor.sessions.length,
        },
        sessions: {
          upcomingSessions: upcomingSessions.slice(0, 5),
          todaySessions,
          totalUpcoming: upcomingSessions.length,
        },
        recentAppointments,
        prescriptions: prescriptionsThisMonth.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
