// filepath: src/app/doctor/dashboard/page.tsx
"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Users,
  Pill,
  Star,
  TrendingUp,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  StatCard,
  AppointmentCard,
  SessionCard,
  PrescriptionCard,
  SectionHeader,
  EmptyState,
} from "@/components/doctor/DashboardComponents";

interface DashboardData {
  doctor: {
    id: string;
    name: string;
    email: string;
    specialization: string;
    qualification: string;
    experience: number;
    rating: string;
    profileImage: string | null;
    consultationFee: string;
    status: string;
  };
  statistics: {
    totalAppointments: number;
    completedAppointments: number;
    thisMonthAppointments: number;
    appointmentsThisWeek: number;
    totalPrescriptions: number;
    prescriptionsThisMonth: number;
    rating: string;
    totalSessions: number;
  };
  sessions: {
    upcomingSessions: any[];
    todaySessions: any[];
    totalUpcoming: number;
  };
  recentAppointments: any[];
  prescriptions: any[];
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["doctor"],
  });
  const { status, isLoading: statusLoading, needsSetup } = useDoctorStatus();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to setup if doctor needs to complete profile
    if (!statusLoading && needsSetup) {
      router.push("/doctor-setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsSetup, statusLoading]);

  useEffect(() => {
    if (isAuthorized && status === "APPROVED") {
      const fetchDashboardData = async () => {
        try {
          const response = await axios.get("/api/doctor/dashboard", {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          setDashboardData(response.data.data);
          setError(null);
        } catch (err: any) {
          console.error("Error fetching dashboard data:", err);
          setError(
            err.response?.data?.error ||
              err.message ||
              "Failed to load dashboard data",
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthorized, status]);

  if (isLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Show pending approval screen if doctor is pending
  if (status === "PENDING") {
    return <PendingApprovalScreen />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8">
        <p className="text-gray-600">No dashboard data available.</p>
      </div>
    );
  }

  const { doctor, statistics, sessions, recentAppointments, prescriptions } =
    dashboardData;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {doctor.profileImage && (
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {doctor.name}
                </h1>
                <p className="text-gray-600">
                  {doctor.specialization} • {doctor.experience} years experience
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-gray-900">
                  {statistics.rating}
                </span>
              </div>
              <p className="text-sm text-gray-600">Patient Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Appointments"
            value={statistics.totalAppointments}
            icon={<Users className="w-8 h-8" />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            label="This Month"
            value={statistics.thisMonthAppointments}
            icon={<Calendar className="w-8 h-8" />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            label="Prescriptions"
            value={statistics.totalPrescriptions}
            icon={<Pill className="w-8 h-8" />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            label="Completed"
            value={statistics.completedAppointments}
            icon={<TrendingUp className="w-8 h-8" />}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Sessions */}
            <section className="bg-white rounded-lg shadow p-6">
              <SectionHeader
                title={`Today's Sessions (${sessions.todaySessions.length})`}
                icon={<Clock className="w-5 h-5 mr-2 text-blue-600" />}
              />
              {sessions.todaySessions.length > 0 ? (
                <div>
                  {sessions.todaySessions.slice(0, 5).map((session) => (
                    <SessionCard
                      key={session.id}
                      hospital={session.hospitals?.name || "Hospital"}
                      location={session.location}
                      date={formatDate(session.scheduledAt)}
                      time={formatTime(session.startTime)}
                      capacity={session.capacity}
                      bookedSlots={session.appointments.length}
                      status={session.status}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No sessions scheduled for today"
                  icon={<Clock className="w-12 h-12 text-gray-300" />}
                />
              )}
            </section>

            {/* Upcoming Sessions */}
            <section className="bg-white rounded-lg shadow p-6">
              <SectionHeader
                title={`Upcoming Sessions (${sessions.totalUpcoming})`}
                icon={<Calendar className="w-5 h-5 mr-2 text-blue-600" />}
              />
              {sessions.upcomingSessions.length > 0 ? (
                <div>
                  {sessions.upcomingSessions.slice(0, 5).map((session) => (
                    <SessionCard
                      key={session.id}
                      hospital={session.hospitals?.name || "Hospital"}
                      location={session.location}
                      date={formatDate(session.scheduledAt)}
                      time={formatTime(session.startTime)}
                      capacity={session.capacity}
                      bookedSlots={session.appointments.length}
                      status={session.status}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No upcoming sessions"
                  icon={<Calendar className="w-12 h-12 text-gray-300" />}
                />
              )}
            </section>

            {/* Recent Appointments */}
            <section className="bg-white rounded-lg shadow p-6">
              <SectionHeader
                title={`Recent Appointments (${recentAppointments.length})`}
                icon={<Users className="w-5 h-5 mr-2 text-blue-600" />}
              />
              {recentAppointments.length > 0 ? (
                <div>
                  {recentAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      patientName={appointment.patientName}
                      patientPhone={appointment.patientPhone}
                      time={formatDate(appointment.createdAt)}
                      status={appointment.status}
                      consultationFee={appointment.consultationFee.toString()}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No recent appointments"
                  icon={<Users className="w-12 h-12 text-gray-300" />}
                />
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Doctor Info Card */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="font-semibold text-gray-900">
                    {doctor.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Qualification</p>
                  <p className="font-semibold text-gray-900">
                    {doctor.qualification}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">
                    {doctor.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultation Fee</p>
                  <p className="font-semibold text-blue-600 text-lg">
                    Rs. {doctor.consultationFee}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {doctor.status}
                  </span>
                </div>
              </div>
            </section>

            {/* Prescriptions This Month */}
            <section className="bg-white rounded-lg shadow p-6">
              <SectionHeader
                title={`Prescriptions (${statistics.prescriptionsThisMonth})`}
                icon={<Pill className="w-5 h-5 mr-2 text-purple-600" />}
              />
              {prescriptions.length > 0 ? (
                <div>
                  {prescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      patientEmail={prescription.patientEmail}
                      appointmentNumber={prescription.prescriptionNumber}
                      date={formatDate(prescription.createdAt)}
                      status={prescription.status}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No prescriptions this month"
                  icon={<Pill className="w-12 h-12 text-gray-300" />}
                />
              )}
            </section>

            {/* Quick Stats */}
            <section className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <h3 className="text-lg font-bold mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Appointments</span>
                  <span className="text-2xl font-bold">
                    {statistics.appointmentsThisWeek}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Completed</span>
                  <span className="text-2xl font-bold">
                    {statistics.completedAppointments}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
