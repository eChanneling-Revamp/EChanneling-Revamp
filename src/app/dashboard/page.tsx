"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (!userString) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      const role = user.role?.toLowerCase();

      // Role-based redirection
      switch (role) {
        case "admin":
        case "super_admin":
          router.push("/admin/dashboard");
          break;
        case "doctor":
          router.push("/doctor/dashboard");
          break;
        case "hospital":
          router.push("/hospital/dashboard");
          break;
        case "corporateagent":
          window.location.href = "https://corporate-agent-frontend.vercel.app/";
          break;
        default:
          router.push("/user/dashboard");
          break;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
