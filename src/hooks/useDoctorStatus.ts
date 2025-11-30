import { useState, useEffect } from "react";
import axios from "axios";

interface DoctorStatusResult {
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | null;
  isLoading: boolean;
  error: string | null;
  doctorData: any;
}

export function useDoctorStatus(): DoctorStatusResult {
  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<any>(null);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem("user");
        if (!userDataStr) {
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(userDataStr);
        const userRole = userData.role?.toLowerCase();

        // Only check for doctor role
        if (userRole !== "doctor") {
          setIsLoading(false);
          return;
        }

        // Fetch doctor data
        const response = await axios.get(
          `/api/hospital/doctor?email=${userData.email}`
        );

        if (response.data.data) {
          const doctor = response.data.data;
          setDoctorData(doctor);
          setStatus(doctor.status || "PENDING");
        }
      } catch (err: any) {
        console.error("Error checking doctor status:", err);
        setError(err.message || "Failed to check doctor status");
      } finally {
        setIsLoading(false);
      }
    };

    checkDoctorStatus();
  }, []);

  return { status, isLoading, error, doctorData };
}
