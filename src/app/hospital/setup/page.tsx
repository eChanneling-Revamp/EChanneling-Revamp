"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HospitalSetupForm } from "@/components/hospitals/HospitalSetupForm";
import axios from "axios";

export default function HospitalSetupPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (!userDataStr) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);

      // Check if user has hospital role
      if (userData.role?.toLowerCase() !== "hospital") {
        router.push("/dashboard");
        return;
      }

      setUserEmail(userData.email);

      // Check if hospital data already exists
      axios
        .get(`/api/hospital/check?email=${userData.email}`)
        .then((response) => {
          if (response.data.exists) {
            // Hospital data already exists, redirect to dashboard
            router.push("/hospital/dashboard");
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error checking hospital data:", error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <HospitalSetupForm userEmail={userEmail} />;
}
