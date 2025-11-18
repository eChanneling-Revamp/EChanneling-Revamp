"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import HospitalDetail from "@/components/hospitals/HospitalDetail";

export default function HospitalDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  if (!session) {
    return <div className="p-6">Please log in to access this page.</div>;
  }

  if (!id || typeof id !== "string") {
    return <div className="p-6">Invalid hospital ID</div>;
  }

  return <HospitalDetail hospitalId={id} />;
}
