"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import DoctorCard from "@/components/staff/DoctorCard";
import EditDoctorDialog from "@/components/staff/EditDoctorDialog";
import axios from "axios";

interface Doctor {
  phonenumber: string;
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  rating?: number;
  profileImage?: string;
  description?: string;
  languages: string[];
  availableDays: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HospitalStaffPage() {
  const router = useRouter();
  const { isAuthorized, isLoading: authLoading } = useRoleProtection({
    allowedRoles: ["hospital"],
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitalId, setHospitalId] = useState("");

  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    // Get hospital data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        fetchHospitalData(userData.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchHospitalData = async (email: string) => {
    try {
      const response = await axios.get(`/api/hospital/check?email=${email}`);
      if (response.data.exists && response.data.data) {
        const hospitalId = response.data.data.id;
        setHospitalId(hospitalId);
        fetchDoctors(hospitalId);
      } else {
        setError("Hospital information not found");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      setError("Failed to load hospital information");
      setIsLoading(false);
    }
  };

  const fetchDoctors = async (hospitalId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/hospital/doctor?hospitalId=${hospitalId}`
      );
      if (response.data && response.data.data) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (doctorCard: any) => {
    // Find the full doctor data from the doctors array
    const fullDoctor = doctors.find((d) => d.id === doctorCard.id);
    if (fullDoctor) {
      setSelectedDoctor(fullDoctor);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = async (doctorId: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    try {
      await axios.delete(`/api/hospital/doctor/${doctorId}`);
      // Refresh the doctors list
      if (hospitalId) {
        fetchDoctors(hospitalId);
      }
    } catch (error: any) {
      console.error("Error deleting doctor:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete doctor"
      );
    }
  };

  const handleEditSuccess = () => {
    // Refresh the doctors list after successful edit
    if (hospitalId) {
      fetchDoctors(hospitalId);
    }
  };

  const specialties = useMemo(() => {
    const uniqueSpecialties = Array.from(
      new Set(doctors.map((d) => d.specialization))
    );
    return ["All Specializations", ...uniqueSpecialties];
  }, [doctors]);

  const statuses = ["All Status", "Active", "Inactive"];

  const filtered = doctors.filter((d) => {
    const matchesQ =
      q === "" ||
      `${d.name} ${d.email} ${d.specialization}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchesSpecialty =
      specialty === "All" ||
      specialty === "All Specializations" ||
      d.specialization === specialty;
    const matchesStatus =
      filterStatus === "All" ||
      filterStatus === "All Status" ||
      (filterStatus === "Active" && d.isActive) ||
      (filterStatus === "Inactive" && !d.isActive);
    return matchesQ && matchesSpecialty && matchesStatus;
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Our Medical Staff
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-3 mb-6">
          <div className="flex flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search staff..."
              className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
            />

            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-3 py-2 rounded bg-white border-[1px] border-gray-200 text-gray-900"
            >
              {specialties.map((s) => (
                <option key={s} value={s} className="text-gray-900">
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded bg-white border-[1px] border-gray-200 text-gray-900"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="text-gray-900">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => router.push("/hospital/staff/add")}
            className="bg-[#013e7f] text-white px-4 py-2 rounded font-medium hover:bg-[#012d5f] transition-colors"
          >
            + Add Doctor
          </button>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="w-full flex justify-between items-center py-2 mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Our medical staff
            </h3>
            <span className="text-sm text-gray-600">
              {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <hr className="border-gray-200 mb-6" />
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((d) => (
                <DoctorCard
                  key={d.id}
                  doctor={{
                    id: d.id,
                    name: d.name,
                    email: d.email,
                    specialty: d.specialization,
                    phone: d.phonenumber || "Not provided",
                    sessions: d.availableDays.join(", ") || "Not set",
                    status: d.isActive ? "Active" : "Inactive",
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {doctors.length === 0
                  ? "No doctors added yet. Click 'Add Doctor' to get started."
                  : "No doctors match your search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Doctor Dialog */}
      <EditDoctorDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        doctor={selectedDoctor}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
