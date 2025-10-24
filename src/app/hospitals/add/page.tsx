"use client";

import { useSession } from "next-auth/react";
import AddHospital from "@/components/hospitals/AddHospital";

export default function AddHospitalPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return <div className="p-6">Please log in to access this page.</div>;
  }

  if (!["admin", "hospital"].includes(session.user.role)) {
    return <div className="p-6 text-black">You don't have permission to add hospitals.</div>;
  }

  return <AddHospital />;
}