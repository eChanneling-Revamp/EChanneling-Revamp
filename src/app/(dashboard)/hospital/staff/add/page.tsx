"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useHospitalStatus } from "@/hooks/useHospitalStatus";
import PendingApprovalScreen from "@/components/hospital/PendingApprovalScreen";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  Globe,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { specializations } from "@/data/specializations";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const commonLanguages = ["English", "Sinhala", "Tamil"];

export default function AddStaffPage() {
  const router = useRouter();
  const { isAuthorized, isLoading: authLoading } = useRoleProtection({
    allowedRoles: ["hospital"],
  });
  const { status: hospitalStatus, isLoading: statusLoading } =
    useHospitalStatus();
  const [hospitalId, setHospitalId] = useState("");
  const [activeTab, setActiveTab] = useState<"doctor" | "nurse">("doctor");
  const [doctorSubTab, setDoctorSubTab] = useState<"existing" | "manual">(
    "existing"
  );
  const [approvedDoctors, setApprovedDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFormData, setDoctorFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    description: "",
    profileImage: "",
    languages: [] as string[],
    availableDays: [] as string[],
  });
  const [nurseFormData, setNurseFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    experience: "",
    profileImage: "",
    availableDays: [] as string[],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get hospital data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        // Fetch hospital ID
        fetchHospitalId(userData.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch approved doctors when hospitalId is available
    if (hospitalId) {
      fetchApprovedDoctors();
    }
  }, [hospitalId]);

  const fetchHospitalId = async (email: string) => {
    try {
      const response = await axios.get(`/api/hospital/check?email=${email}`);
      if (response.data.exists && response.data.data) {
        setHospitalId(response.data.data.id);
      }
    } catch (error) {
      console.error("Error fetching hospital ID:", error);
      setError("Failed to load hospital information");
    }
  };

  const fetchApprovedDoctors = async () => {
    try {
      const response = await axios.get("/api/hospital/doctor");
      if (response.data.data && Array.isArray(response.data.data)) {
        // Filter to only show approved doctors who are not assigned to this hospital
        const availableDoctors = response.data.data.filter((doctor: any) => {
          const isApproved = doctor.status === "APPROVED";
          // Check both hospitalId field and hospitals relation
          const doctorHospitalId = doctor.hospitalId || doctor.hospitals?.id;
          const notAssignedToThisHospital =
            !doctorHospitalId || doctorHospitalId !== hospitalId;
          console.log(
            `Doctor ${doctor.name}: approved=${isApproved}, hospitalId=${doctor.hospitalId}, hospitals.id=${doctor.hospitals?.id}, currentHospitalId=${hospitalId}, notAssigned=${notAssignedToThisHospital}`
          );
          return isApproved && notAssignedToThisHospital;
        });
        console.log(
          `Total doctors: ${response.data.data.length}, Available: ${availableDoctors.length}`
        );
        setApprovedDoctors(availableDoctors);
      }
    } catch (error) {
      console.error("Error fetching approved doctors:", error);
    }
  };

  const handleDoctorInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDoctorFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNurseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNurseFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorCheckboxChange = (
    name: "languages" | "availableDays",
    value: string
  ) => {
    setDoctorFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleNurseCheckboxChange = (name: "availableDays", value: string) => {
    setNurseFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!hospitalId) {
        setError(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      const doctorData = {
        name: doctorFormData.name,
        email: doctorFormData.email,
        phonenumber: doctorFormData.phonenumber,
        specialization: doctorFormData.specialization,
        qualification: doctorFormData.qualification,
        experience: parseInt(doctorFormData.experience),
        consultationFee: parseFloat(doctorFormData.consultationFee),
        description: doctorFormData.description || null,
        profileImage: doctorFormData.profileImage || null,
        languages: doctorFormData.languages,
        availableDays: doctorFormData.availableDays,
        hospitalId: hospitalId,
      };

      const response = await axios.post("/api/hospital/doctor", doctorData);

      if (response.data) {
        setSuccess("Doctor added successfully!");
        setTimeout(() => {
          router.push("/hospital/staff");
        }, 1500);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to add doctor"
        );
      } else {
        setError("A network error occurred.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddExistingDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!hospitalId) {
        setError(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      if (!selectedDoctorId) {
        setError("Please select a doctor to add.");
        setSubmitLoading(false);
        return;
      }

      // Update the doctor's hospitalId
      const response = await axios.put(
        `/api/hospital/doctor/${selectedDoctorId}`,
        {
          hospitalId: hospitalId,
        }
      );

      if (response.data) {
        setSuccess("Doctor added to hospital successfully!");
        setTimeout(() => {
          router.push("/hospital/staff");
        }, 1500);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to add doctor"
        );
      } else {
        setError("A network error occurred.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNurseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!hospitalId) {
        setError(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      const nurseData = {
        name: nurseFormData.name,
        email: nurseFormData.email,
        phonenumber: nurseFormData.phonenumber,
        experience: parseInt(nurseFormData.experience),
        profileImage: nurseFormData.profileImage || null,
        availableDays: nurseFormData.availableDays,
        hospitalId: hospitalId,
      };

      const response = await axios.post("/api/hospital/nurse", nurseData);

      if (response.data) {
        setSuccess("Nurse added successfully!");
        setTimeout(() => {
          router.push("/hospital/staff");
        }, 1500);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to add nurse"
        );
      } else {
        setError("A network error occurred.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (authLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Staff Member
              </h1>
              <p className="text-gray-600 mt-1">
                Add a doctor or nurse to your hospital staff
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-1 inline-flex">
          <button
            onClick={() => {
              setActiveTab("doctor");
              setError("");
              setSuccess("");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "doctor"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Doctor
          </button>
          <button
            onClick={() => {
              setActiveTab("nurse");
              setError("");
              setSuccess("");
            }}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "nurse"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nurse
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Doctor Form */}
        {activeTab === "doctor" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Doctor Sub-tabs */}
            <div className="border-b border-gray-200 px-6 pt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDoctorSubTab("existing");
                    setError("");
                    setSuccess("");
                  }}
                  className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all ${
                    doctorSubTab === "existing"
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Add Existing Doctor
                </button>
                <button
                  onClick={() => {
                    setDoctorSubTab("manual");
                    setError("");
                    setSuccess("");
                  }}
                  className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all ${
                    doctorSubTab === "manual"
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Add New Doctor Manually
                </button>
              </div>
            </div>

            {/* Existing Doctor Selection */}
            {doctorSubTab === "existing" && (
              <form onSubmit={handleAddExistingDoctor} className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Select an Approved Doctor
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose from approved doctors who are not currently
                      assigned to any hospital.
                    </p>

                    {/* Search */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search doctors by name, email, or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    {/* Doctor List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {approvedDoctors
                        .filter((doctor) =>
                          searchQuery
                            ? doctor.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              doctor.email
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              doctor.specialization
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true
                        )
                        .map((doctor) => (
                          <label
                            key={doctor.id}
                            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedDoctorId === doctor.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="selectedDoctor"
                              value={doctor.id}
                              checked={selectedDoctorId === doctor.id}
                              onChange={(e) =>
                                setSelectedDoctorId(e.target.value)
                              }
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {doctor.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {doctor.email}
                                  </p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {doctor.status}
                                </span>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">
                                    Specialization:
                                  </span>{" "}
                                  <span className="text-gray-900 font-medium">
                                    {doctor.specialization}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Experience:
                                  </span>{" "}
                                  <span className="text-gray-900 font-medium">
                                    {doctor.experience} years
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    Qualification:
                                  </span>{" "}
                                  <span className="text-gray-900 font-medium">
                                    {doctor.qualification}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Phone:</span>{" "}
                                  <span className="text-gray-900 font-medium">
                                    {doctor.phonenumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}

                      {approvedDoctors.filter((doctor) =>
                        searchQuery
                          ? doctor.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            doctor.email
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            doctor.specialization
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          : true
                      ).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No approved doctors available.</p>
                          <p className="text-sm mt-1">
                            All approved doctors are already assigned to
                            hospitals.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      type="submit"
                      disabled={submitLoading || !selectedDoctorId}
                      className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading
                        ? "Adding Doctor..."
                        : "Add Selected Doctor"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={submitLoading}
                      className="px-6 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Manual Doctor Form */}
            {doctorSubTab === "manual" && (
              <form onSubmit={handleDoctorSubmit} className="p-8">
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Dr. John Smith"
                            value={doctorFormData.name}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="doctor@example.com"
                            value={doctorFormData.email}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label
                          htmlFor="phonenumber"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="phonenumber"
                            name="phonenumber"
                            type="text"
                            placeholder="+94 77 123 4567"
                            value={doctorFormData.phonenumber}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Professional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Specialization */}
                      <div className="space-y-2">
                        <label
                          htmlFor="specialization"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="specialization"
                          name="specialization"
                          value={doctorFormData.specialization}
                          onChange={handleDoctorInputChange}
                          className="w-full h-12 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select specialization</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Qualification */}
                      <div className="space-y-2">
                        <label
                          htmlFor="qualification"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Qualification <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="qualification"
                            name="qualification"
                            type="text"
                            placeholder="MBBS, MD"
                            value={doctorFormData.qualification}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="space-y-2">
                        <label
                          htmlFor="experience"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Years of Experience{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="experience"
                            name="experience"
                            type="number"
                            min="0"
                            placeholder="5"
                            value={doctorFormData.experience}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="space-y-2">
                        <label
                          htmlFor="consultationFee"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Consultation Fee (LKR){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                            Rs.
                          </span>
                          <input
                            id="consultationFee"
                            name="consultationFee"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="2500.00"
                            value={doctorFormData.consultationFee}
                            onChange={handleDoctorInputChange}
                            className="w-full h-12 pl-14 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Additional Information
                    </h2>

                    {/* Description */}
                    <div className="space-y-2 mb-6">
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Description (Optional)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          placeholder="Brief description about the doctor..."
                          value={doctorFormData.description}
                          onChange={handleDoctorInputChange}
                          className="w-full pl-11 pr-4 pt-3 pb-3 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Profile Image URL */}
                    <div className="space-y-2 mb-6">
                      <label
                        htmlFor="profileImage"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Profile Image URL (Optional)
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="profileImage"
                          name="profileImage"
                          type="url"
                          placeholder="https://example.com/photo.jpg"
                          value={doctorFormData.profileImage}
                          onChange={handleDoctorInputChange}
                          className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2 mb-6">
                      <label className="block text-sm font-semibold text-gray-700">
                        Languages Spoken
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {commonLanguages.map((language) => (
                          <label
                            key={language}
                            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={doctorFormData.languages.includes(
                                language
                              )}
                              onChange={() =>
                                handleDoctorCheckboxChange(
                                  "languages",
                                  language
                                )
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              {language}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Available Days */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Available Days
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {daysOfWeek.map((day) => (
                          <label
                            key={day}
                            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={doctorFormData.availableDays.includes(
                                day
                              )}
                              onChange={() =>
                                handleDoctorCheckboxChange("availableDays", day)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                            />
                            <span className="text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? "Adding Doctor..." : "Add Doctor"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={submitLoading}
                      className="px-6 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Nurse Form */}
        {activeTab === "nurse" && (
          <form
            onSubmit={handleNurseSubmit}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-name"
                        name="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={nurseFormData.name}
                        onChange={handleNurseInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-email"
                        name="email"
                        type="email"
                        placeholder="nurse@example.com"
                        value={nurseFormData.email}
                        onChange={handleNurseInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-phonenumber"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-phonenumber"
                        name="phonenumber"
                        type="text"
                        placeholder="+94 77 123 4567"
                        value={nurseFormData.phonenumber}
                        onChange={handleNurseInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-experience"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-experience"
                        name="experience"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={nurseFormData.experience}
                        onChange={handleNurseInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h2>

                {/* Profile Image URL */}
                <div className="space-y-2 mb-6">
                  <label
                    htmlFor="nurse-profileImage"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Profile Image URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="nurse-profileImage"
                      name="profileImage"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={nurseFormData.profileImage}
                      onChange={handleNurseInputChange}
                      className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Available Days */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Days
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <label
                        key={day}
                        className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={nurseFormData.availableDays.includes(day)}
                          onChange={() =>
                            handleNurseCheckboxChange("availableDays", day)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "Adding Nurse..." : "Add Nurse"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={submitLoading}
                  className="px-6 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
