"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useHospitalStatus } from "@/hooks/useHospitalStatus";
import PendingApprovalScreen from "@/components/hospital/PendingApprovalScreen";
import DoctorCard from "@/components/staff/DoctorCard";
import NurseCard from "@/components/staff/NurseCard";
import EditDoctorDialog from "@/components/staff/EditDoctorDialog";
import EditNurseDialog from "@/components/staff/EditNurseDialog";
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
  status?: string;
  hospitalId?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Nurse {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  experience: number;
  profileImage?: string;
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
  const { status: hospitalStatus, isLoading: statusLoading } =
    useHospitalStatus();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [activeTab, setActiveTab] = useState<"doctor" | "nurse">("doctor");

  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditNurseDialogOpen, setIsEditNurseDialogOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

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
        fetchNurses(hospitalId);
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

  const fetchNurses = async (hospitalId: string) => {
    try {
      const response = await axios.get(
        `/api/hospital/nurse?hospitalId=${hospitalId}`
      );
      if (response.data && response.data.data) {
        setNurses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching nurses:", error);
      setError("Failed to load nurses");
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

  const handleNurseDelete = async (nurseId: string) => {
    if (!confirm("Are you sure you want to delete this nurse?")) {
      return;
    }

    try {
      await axios.delete(`/api/hospital/nurse/${nurseId}`);
      // Refresh the nurses list
      if (hospitalId) {
        fetchNurses(hospitalId);
      }
    } catch (error: any) {
      console.error("Error deleting nurse:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete nurse"
      );
    }
  };

  const handleNurseEdit = (nurseCard: any) => {
    // Find the full nurse data from the nurses array
    const fullNurse = nurses.find((n) => n.id === nurseCard.id);
    if (fullNurse) {
      setSelectedNurse(fullNurse);
      setIsEditNurseDialogOpen(true);
    }
  };

  const handleEditSuccess = () => {
    // Refresh the doctors list after successful edit
    if (hospitalId) {
      fetchDoctors(hospitalId);
    }
  };

  const handleNurseEditSuccess = () => {
    // Refresh the nurses list after successful edit
    if (hospitalId) {
      fetchNurses(hospitalId);
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

  const filteredNurses = nurses.filter((n) => {
    const matchesQ =
      q === "" ||
      `${n.name} ${n.email}`.toLowerCase().includes(q.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      filterStatus === "All Status" ||
      (filterStatus === "Active" && n.isActive) ||
      (filterStatus === "Inactive" && !n.isActive);
    return matchesQ && matchesStatus;
  });

  if (authLoading || statusLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading staff...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Show pending approval screen if hospital status is PENDING
  if (hospitalStatus === "PENDING") {
    return <PendingApprovalScreen />;
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

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => {
              setActiveTab("doctor");
              setQ("");
              setSpecialty("All");
              setFilterStatus("All");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "doctor"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => {
              setActiveTab("nurse");
              setQ("");
              setSpecialty("All");
              setFilterStatus("All");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "nurse"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nurses
          </button>
        </div>

        <div className="flex justify-between gap-3 mb-6">
          <div className="flex flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search staff..."
              className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
            />

            {activeTab === "doctor" && (
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
            )}

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
            + Add {activeTab === "doctor" ? "Doctor" : "Nurse"}
          </button>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="w-full flex justify-between items-center py-2 mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {activeTab === "doctor" ? "Our Doctors" : "Our Nurses"}
            </h3>
            <span className="text-sm text-gray-600">
              {activeTab === "doctor"
                ? `${filtered.length} doctor${
                    filtered.length !== 1 ? "s" : ""
                  } found`
                : `${filteredNurses.length} nurse${
                    filteredNurses.length !== 1 ? "s" : ""
                  } found`}
            </span>
          </div>
          <hr className="border-gray-200 mb-6" />

          {/* Doctors View */}
          {activeTab === "doctor" && (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map((d) => {
                    // Map database status to display status
                    let displayStatus:
                      | "PENDING"
                      | "APPROVED"
                      | "REJECTED"
                      | "SUSPENDED"
                      | "Active"
                      | "Inactive" = "PENDING";
                    if (d.status) {
                      displayStatus = d.status as any;
                    } else if (d.isActive) {
                      displayStatus = "Active";
                    } else {
                      displayStatus = "Inactive";
                    }

                    return (
                      <DoctorCard
                        key={d.id}
                        doctor={{
                          id: d.id,
                          name: d.name,
                          email: d.email,
                          specialty: d.specialization,
                          phone: d.phonenumber || "Not provided",
                          sessions: d.availableDays.join(", ") || "Not set",
                          status: displayStatus,
                        }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    );
                  })}
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
            </>
          )}

          {/* Nurses View */}
          {activeTab === "nurse" && (
            <>
              {filteredNurses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNurses.map((n) => (
                    <NurseCard
                      key={n.id}
                      nurse={{
                        id: n.id,
                        name: n.name,
                        email: n.email,
                        phone: n.phonenumber || "Not provided",
                        experience: `${n.experience} years`,
                        availableDays: n.availableDays.join(", ") || "Not set",
                        status: n.isActive ? "Active" : "Inactive",
                      }}
                      onEdit={handleNurseEdit}
                      onDelete={handleNurseDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {nurses.length === 0
                      ? "No nurses added yet. Click 'Add Nurse' to get started."
                      : "No nurses match your search criteria."}
                  </p>
                </div>
              )}
            </>
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

      {/* Edit Nurse Dialog */}
      <EditNurseDialog
        isOpen={isEditNurseDialogOpen}
        onClose={() => setIsEditNurseDialogOpen(false)}
        nurse={selectedNurse}
        onSuccess={handleNurseEditSuccess}
      />
    </div>
  );
}
