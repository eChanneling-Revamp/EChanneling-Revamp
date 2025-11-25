"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddHospital from "@/components/hospitals/Addhospital";

export default function AddHospitalPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (!token || !userString) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      const userRole = user.role?.toLowerCase();

      if (["admin", "super_admin", "hospital"].includes(userRole)) {
        setIsAuthorized(true);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
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

  return <AddHospital />;
}
