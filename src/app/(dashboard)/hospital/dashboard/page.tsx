// filepath: src/app/hospital/dashboard/page.tsx
"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useHospitalStatus } from "@/hooks/useHospitalStatus";
import PendingApprovalScreen from "@/components/hospital/PendingApprovalScreen";
import {
  Users,
  Calendar,
  ClipboardList,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function HospitalAdminDashboard() {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["hospital"],
  });
  const { status: hospitalStatus, isLoading: statusLoading } =
    useHospitalStatus();

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

  // Show pending approval screen if hospital status is PENDING
  if (hospitalStatus === "PENDING") {
    return <PendingApprovalScreen />;
  }

  // Show rejection message if hospital status is REJECTED
  if (hospitalStatus === "REJECTED") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Rejected
          </h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your hospital registration has been rejected. Please
            contact support for more information.
          </p>
          <a
            href="mailto:support@echanneling.com"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // Dummy data for Today's Sessions
  const todaysSessions = [
    {
      doctor: "Dr. Jayawardena",
      specialty: "Cardiology",
      time: "09:00 AM - 12:00 PM",
      appointments: 17,
      room: "204",
    },
    {
      doctor: "Dr. Silva",
      specialty: "Neurology",
      time: "10:00 AM - 02:00 PM",
      appointments: 23,
      room: "105",
    },
    {
      doctor: "Dr. Perera",
      specialty: "Pediatrics",
      time: "01:00 PM - 05:00 PM",
      appointments: 15,
      room: "310",
    },
  ];

  // Dummy data for Settlement Status
  const settlements = [
    {
      doctor: "Dr. Jayawardena",
      specialty: "Cardiology",
      amount: 120000,
      status: "Processed",
      statusType: "success",
    },
    {
      doctor: "Dr. Silva",
      specialty: "Neurology",
      amount: 85000,
      status: "Pending",
      statusType: "pending",
    },
    {
      doctor: "Dr. Fernando",
      specialty: "Dermatology",
      amount: 65000,
      status: "Delayed",
      statusType: "delayed",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Doctors Card */}
        <div className="bg-blue-900 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 mb-2">
                Active Doctors
              </p>
              <p className="text-4xl font-bold mb-2">48</p>
              <div className="flex items-center text-sm text-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>↑ 5% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-800 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Today's Sessions Card */}
        <div className="bg-cyan-400 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-50 mb-2">
                Today&apos;s Sessions
              </p>
              <p className="text-4xl font-bold">12</p>
            </div>
            <div className="p-3 bg-cyan-500 rounded-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Today's Appointments Card */}
        <div className="bg-green-500 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-50 mb-2">
                Today&apos;s Appointments
              </p>
              <p className="text-4xl font-bold">87</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <ClipboardList className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Pending Settlements Card */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100 mb-2">
                Pending Settlements
              </p>
              <p className="text-4xl font-bold">Rs. 450K</p>
            </div>
            <div className="p-3 bg-blue-900 rounded-lg">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Sessions and Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Today&apos;s Sessions
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {todaysSessions.map((session, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {session.doctor} - {session.specialty}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{session.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-500 font-medium">
                      {session.appointments} Appointments
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Room {session.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settlement Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Settlement Status
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {settlements.map((settlement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {settlement.statusType === "success" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {settlement.statusType === "pending" && (
                      <Clock className="w-6 h-6 text-yellow-500" />
                    )}
                    {settlement.statusType === "delayed" && (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {settlement.doctor} - {settlement.specialty}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Rs. {settlement.amount.toLocaleString()} -{" "}
                      <span
                        className={
                          settlement.statusType === "success"
                            ? "text-green-600"
                            : settlement.statusType === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {settlement.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
