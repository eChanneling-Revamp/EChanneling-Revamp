"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HospitalProfileForm } from "@/components/hospitals/HospitalProfileForm";
import { useRoleProtection } from "@/hooks/useRoleProtection";

export default function HospitalProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["hospital"],
  });

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserEmail(userData.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <HospitalProfileForm userEmail={userEmail} />;
}
