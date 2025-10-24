"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ListHospitals from "@/components/hospitals/ListHospitals"; // Corrected import

export default function HospitalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return <div className="p-6">Please log in to access this page.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospital Management</h1>
        {["admin", "hospital"].includes(session.user.role) && (
          <button
            onClick={() => router.push("/hospitals/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Hospital
          </button>
        )}
      </div>

      <ListHospitals refreshTrigger={refreshTrigger} />
    </div>
  );
}