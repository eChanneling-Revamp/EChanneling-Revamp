// filepath: src/app/doctor/dashboard/page.tsx
"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorDashboard() {
  const router = useRouter();
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["doctor"],
  });
  const { status, isLoading: statusLoading, needsSetup } = useDoctorStatus();

  useEffect(() => {
    // Redirect to setup if doctor needs to complete profile
    if (!statusLoading && needsSetup) {
      router.push("/doctor-setup");
    }
  }, [needsSetup, statusLoading, router]);

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
      <h1 className="text-3xl font-bold mb-4 text-blue-700">My Dashboard</h1>
      <p className="text-gray-700">Welcome to your doctor dashboard.</p>
    </div>
  );
}
