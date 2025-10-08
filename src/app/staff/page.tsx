// app/staff/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import doctorsData from "@/data/doctors";
import DoctorCard from "@/components/DoctorCard";

export default function StaffPage() {
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

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

            <div className="flex gap-3 mb-6 ">
                {/* <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search staff..." className="flex-1 px-4 py-2 rounded border" /> */}
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search staff..." className="flex-1 px-4 py-2 rounded shadow " />

                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="px-3 py-2 rounded bg-gray-100 ">
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded bg-gray-100">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <button className="bg-blue-900 text-white px-4 py-2 rounded">+ Add Doctor</button>
            </div>

            <div className="bg-white rounded shadow p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
                </div>
            </div>
        </div>
    );
}
