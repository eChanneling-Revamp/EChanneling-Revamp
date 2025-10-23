"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import ListHospitals from "@/components/hospitals/ListHospitals"; // Corrected import
import doctorsData from "@/app/staff/data/doctor";
import { admin } from "better-auth/plugins";
import DoctorCard from "@/components/staff/DoctorCard";

export default function HospitalsPage() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  const [q, setQ] = useState("");
    const [specialty, setSpecialty] = useState("All");
    const [status, setStatus] = useState("All");

    const specialties = useMemo(() => ["All Specializations", ...Array.from(new Set(doctorsData.map(d => d.specialty)))], []);
    const statuses = ["All Status", "Active", "On Leave", "Inactive"];

    const filtered = doctorsData.filter(d => {
        const matchesQ = q === "" || `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(q.toLowerCase());
        const matchesSpecialty = specialty === "All" || d.specialty === specialty;
        const matchesStatus = status === "All" || d.status === status;
        return matchesQ && matchesSpecialty && matchesStatus;
    });




  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  // if (!session) {
  //   return <div className="p-6">Please log in to access this page.</div>;
  // }


   return (
        <div className="p-4 bg-[#f3f4f6] h-lvw">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

            <div className="flex justify-between gap-3 mb-6 ">
                {/* <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search staff..." className="flex-1 px-4 py-2 rounded border" /> */}
               <div className="flex flex-row gap-3">
                 <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search staff..." className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white" />

                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="px-3 py-2 rounded bg-white border-[1px] border-gray-200 ">
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded bg-white border-[1px] border-gray-200">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
               </div>

                <button  onClick={() => router.push("/staff/add")} className="bg-[#013e7f] text-white px-4 py-2 rounded">+ Add Doctor</button>
            </div>

            <div className="bg-white rounded shadow p-4 ">
                <div className="w-full flex justify-start py-2 text-xl">Our medical staff</div>
                <hr className="border-gray-200 mb-4"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
                </div>
            </div>
        </div>
    );
    
}