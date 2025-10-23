// components/DoctorCard.tsx
"use client";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { Doctor } from "@/data/doctors";


export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
    sessions: string; // e.g. "Mon, Wed, Fri"
    status: "Active" | "On Leave" | "Inactive";
    color?: string; // avatar bg color
};


export default function DoctorCard({ doctor }: { doctor: Doctor }) {
    const statusColor =
        doctor.status === "Active" ? "bg-green-100 text-green-800" :
            doctor.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800";

    return (
        <div className="bg-white rounded-lg shadow p-4 border-[1px] border-gray-200">
            <div className="flex gap-4 items-start">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white ${doctor.color ?? " bg-[#013e7f]"}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="3" fill="white" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="white" />
                    </svg>
                </div>

                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="font-semibold text-black-500">{doctor.name}</div>
                            <div className="text-xs text-gray-500">{doctor.specialty}</div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <button className="p-2 rounded hover:bg-gray-50"><FiEdit /></button>
                            <button className="p-2 rounded hover:bg-gray-50 text-red-500"><FiTrash2 /></button>
                        </div>
                    </div>

                    <div className="mt-3 text-sm space-y-1 text-gray-700">
                        <div><span className="font-medium">Email:</span> {doctor.email}</div>
                        <div><span className="font-medium">Phone:</span> {doctor.phone}</div>
                        <div><span className="font-medium">Sessions:</span> {doctor.sessions}</div>
                    </div>

                    <div className="mt-3">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${statusColor}`}>{doctor.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
