"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HospitalDetail from "@/components/hospitals/HospitalDetail";

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
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

  if (!isAuthenticated) {
    return null;
  }

  if (!id || typeof id !== "string") {
    return <div className="p-6">Invalid hospital ID</div>;
  }

  return <HospitalDetail hospitalId={id} />;
}
