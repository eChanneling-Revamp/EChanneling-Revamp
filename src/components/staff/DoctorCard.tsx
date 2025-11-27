// components/DoctorCard.tsx
"use client";
import React from "react";
import { FiEdit, FiTrash2, FiMail, FiPhone, FiCalendar, FiAward } from "react-icons/fi";

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

type DoctorCardProps = {
  doctor: Doctor;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctorId: string) => void;
};

export default function DoctorCard({ doctor, onEdit, onDelete }: DoctorCardProps) {
  const statusConfig = {
    Active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      border: "border-emerald-200",
    },
    "On Leave": {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      border: "border-amber-200",
    },
    Inactive: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      dot: "bg-gray-400",
      border: "border-gray-200",
    },
  };

  const config = statusConfig[doctor.status];

  // Extract initials from name
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
      {/* Header with gradient */}
      <div className="h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 relative">
        <div className="absolute -bottom-10 left-6">
          <div
            className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white ${
              doctor.color ?? "bg-gradient-to-br from-blue-700 to-indigo-700"
            }`}
          >
            <span className="text-2xl font-bold">{getInitials(doctor.name)}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onEdit?.(doctor)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow-md text-blue-600 hover:text-blue-700 transition-all"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete?.(doctor.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white shadow-md text-red-500 hover:text-red-600 transition-all"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        {/* Name and Specialty */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {doctor.name}
          </h3>
          <div className="flex items-center gap-2">
            <FiAward className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm font-medium text-blue-600 line-clamp-1">
              {doctor.specialty}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4">
          {/* Email */}
          <div className="flex items-start gap-3 group/item">
            <div className="mt-0.5 p-2 bg-blue-50 rounded-lg group-hover/item:bg-blue-100 transition-colors">
              <FiMail className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">Email</p>
              <p className="text-sm text-gray-900 truncate">{doctor.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3 group/item">
            <div className="mt-0.5 p-2 bg-green-50 rounded-lg group-hover/item:bg-green-100 transition-colors">
              <FiPhone className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">Phone</p>
              <p className="text-sm text-gray-900 truncate">{doctor.phone}</p>
            </div>
          </div>

          {/* Sessions */}
          <div className="flex items-start gap-3 group/item">
            <div className="mt-0.5 p-2 bg-purple-50 rounded-lg group-hover/item:bg-purple-100 transition-colors">
              <FiCalendar className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">Available Days</p>
              <p className="text-sm text-gray-900 line-clamp-2">{doctor.sessions}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-4 border-t border-gray-100">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}
          >
            <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`}></span>
            <span className={`text-xs font-semibold ${config.text}`}>
              {doctor.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
