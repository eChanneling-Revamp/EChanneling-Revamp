import { useState, useEffect } from "react";
import axios from "axios";

interface HospitalStatusResult {
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  isLoading: boolean;
  error: string | null;
  hospitalData: any;
}

export function useHospitalStatus(): HospitalStatusResult {
  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hospitalData, setHospitalData] = useState<any>(null);

  useEffect(() => {
    const checkHospitalStatus = async () => {
      try {
        // Get user data from localStorage
        const userDataStr = localStorage.getItem("user");
        if (!userDataStr) {
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(userDataStr);
        const userRole = userData.role?.toLowerCase();

        // Only check for hospital role
        if (userRole !== "hospital") {
          setIsLoading(false);
          return;
        }

        // Fetch hospital data
        const response = await axios.get(
          `/api/hospital/check?email=${userData.email}`
        );

        if (response.data.exists && response.data.data) {
          const hospital = response.data.data;
          setHospitalData(hospital);
          setStatus(hospital.status || "PENDING");
        }
      } catch (err: any) {
        console.error("Error checking hospital status:", err);
        setError(err.message || "Failed to check hospital status");
      } finally {
        setIsLoading(false);
      }
    };

    checkHospitalStatus();
  }, []);

  return { status, isLoading, error, hospitalData };
}
