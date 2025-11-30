"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";

export default function DoctorHospitalsPage() {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["doctor"],
  });
  const { status, isLoading: statusLoading } = useDoctorStatus();

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">My Hospitals</h1>
      <p className="text-gray-700">View hospitals where you work.</p>
    </div>
  );
}
