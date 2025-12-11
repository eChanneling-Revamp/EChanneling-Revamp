"use client";

import { useState, useEffect } from "react";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { HospitalUserProfile } from "@/components/hospitals/HospitalUserProfile";
import { Loader2 } from "lucide-react";

export default function MyProfilePage() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );
  const { isLoading: authLoading } = useRoleProtection({
    allowedRoles: ["admin", "hospital", "doctor", "user", "nurse"],
  });

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUser({
          email: userData.email || "",
          role: userData.role?.toLowerCase() || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const renderProfileByRole = () => {
    if (!user) {
      return null;
    }

    switch (user.role) {
      case "hospital":
        return <HospitalUserProfile userEmail={user.email} />;
      // Add cases for other roles like 'doctor', 'user', etc. in the future
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            Profile page for role '{user.role}' is not yet implemented.
          </div>
        );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f6] min-h-full">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          View your personal and account information.
        </p>
      </div>
      <div className="px-6 pb-6">{renderProfileByRole()}</div>
    </div>
  );
}
