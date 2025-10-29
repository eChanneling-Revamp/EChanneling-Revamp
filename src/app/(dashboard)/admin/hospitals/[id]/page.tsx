"use client";

import { useParams } from "next/navigation";
import HospitalDetail from "@/components/hospitals/HospitalDetail";

export default function ViewHospitalPage() {
  const params = useParams();
  const id = params.id as string;

  return <HospitalDetail hospitalId={id} />;
}