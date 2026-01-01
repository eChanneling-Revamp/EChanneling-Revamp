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
import { toast } from "react-toastify";
import { ToastContainer } from "@/components/ui/toast-container";

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
  const [hospitalName, setHospitalName] = useState("");
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
  const [doctorSignupData, setDoctorSignupData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    age: "",
    gender: "",
    nic: "",
    role: "doctor",
  });
  const [nurseFormData, setNurseFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    experience: "",
    profileImage: "",
    availableDays: [] as string[],
  });
  const [nurseSignupData, setNurseSignupData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    age: "",
    gender: "",
    nic: "",
    role: "nurse",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

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
        setHospitalName(response.data.data.name || "");
      }
    } catch (error) {
      console.error("Error fetching hospital ID:", error);
      toast.error("Failed to load hospital information");
    }
  };

  const fetchApprovedDoctors = async () => {
    try {
      const response = await axios.get("/api/hospital/doctor");
      if (response.data.data && Array.isArray(response.data.data)) {
        // Filter to only show approved doctors who are not assigned to this hospital
        const availableDoctors = response.data.data.filter((doctor: any) => {
          const isApproved = doctor.status === "APPROVED";
          // Check if this hospital is NOT in the doctor's hospitalId array
          const doctorHospitalIds = doctor.hospitalId || [];
          const notAssignedToThisHospital =
            !doctorHospitalIds.includes(hospitalId);
          console.log(
            `Doctor ${
              doctor.name
            }: approved=${isApproved}, hospitalId=${JSON.stringify(
              doctorHospitalIds
            )}, currentHospitalId=${hospitalId}, notAssigned=${notAssignedToThisHospital}`
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

  const handleDoctorSignupInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setDoctorSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNurseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNurseFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNurseSignupInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNurseSignupData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate random password
  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";

    // Fisher-Yates shuffle algorithm for proper randomization
    const shuffle = (array: string[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Ensure at least one of each required character type
    const passwordChars: string[] = [];

    // Add 2 of each type for better strength
    passwordChars.push(
      uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    );
    passwordChars.push(
      uppercase.charAt(Math.floor(Math.random() * uppercase.length))
    );
    passwordChars.push(
      lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    );
    passwordChars.push(
      lowercase.charAt(Math.floor(Math.random() * lowercase.length))
    );
    passwordChars.push(
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    );
    passwordChars.push(
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    );
    passwordChars.push(
      special.charAt(Math.floor(Math.random() * special.length))
    );
    passwordChars.push(
      special.charAt(Math.floor(Math.random() * special.length))
    );

    // Fill the rest with random characters from all sets to reach 14 characters
    const allChars = uppercase + lowercase + numbers + special;
    while (passwordChars.length < 14) {
      passwordChars.push(
        allChars.charAt(Math.floor(Math.random() * allChars.length))
      );
    }

    // Properly shuffle using Fisher-Yates algorithm
    const shuffledPassword = shuffle(passwordChars).join("");

    // Verify the password meets all requirements
    const hasUppercase = /[A-Z]/.test(shuffledPassword);
    const hasLowercase = /[a-z]/.test(shuffledPassword);
    const hasNumber = /[0-9]/.test(shuffledPassword);
    const hasSpecial = /[!@#$%^&*]/.test(shuffledPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      // Recursively generate a new password if validation fails
      return generatePassword();
    }

    return shuffledPassword;
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

    try {
      if (!hospitalId) {
        toast.error(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      // Generate random password
      const generatedPassword = generatePassword();
      console.log("Generated password:", generatedPassword);
      console.log("Password validation:", {
        hasUppercase: /[A-Z]/.test(generatedPassword),
        hasLowercase: /[a-z]/.test(generatedPassword),
        hasNumber: /[0-9]/.test(generatedPassword),
        hasSpecial: /[!@#$%^&*]/.test(generatedPassword),
        length: generatedPassword.length,
      });

      // Split name into first and last name
      const nameParts = doctorSignupData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      // Step 1: Create user account via external API
      console.log("Attempting to create doctor account with:", {
        first_name: firstName,
        last_name: lastName,
        email: doctorSignupData.email,
        phone_number: doctorSignupData.phonenumber,
        role: "doctor",
        age: parseInt(doctorSignupData.age),
        gender: doctorSignupData.gender.toLowerCase(),
      });

      const signupResponse = await axios.post("/api/external-auth/register", {
        first_name: firstName,
        last_name: lastName,
        email: doctorSignupData.email,
        password: generatedPassword,
        confirm_password: generatedPassword,
        phone_number: doctorSignupData.phonenumber,
        nic: doctorSignupData.nic,
        role: "doctor",
        age: parseInt(doctorSignupData.age),
        gender: doctorSignupData.gender.toLowerCase(),
      });

      console.log("Doctor account created successfully:", signupResponse.data);

      if (!signupResponse.data) {
        throw new Error("Failed to create user account");
      }
      // Step 2: Send welcome email with credentials and magic link
      await axios.post("/api/email/send-credentials", {
        to: doctorSignupData.email,
        name: doctorSignupData.name,
        email: doctorSignupData.email,
        phonenumber: doctorSignupData.phonenumber,
        password: generatedPassword,
        role: "doctor",
        hospitalId: hospitalId,
        hospitalName: hospitalName,
      });

      toast.success(
        "Doctor account created successfully! Login credentials have been sent to their email."
      );
      setTimeout(() => {
        router.push("/hospital/staff");
      }, 2000);
    } catch (err: any) {
      console.error("Doctor creation error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        let errorMessage = "Failed to add doctor";

        if (err.response?.data?.message) {
          // If message is an array, join the messages
          if (Array.isArray(err.response.data.message)) {
            errorMessage = err.response.data.message.join(", ");
          } else {
            errorMessage = err.response.data.message;
          }
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        }

        toast.error(errorMessage);
      } else {
        toast.error("A network error occurred: " + err.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddExistingDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!hospitalId) {
        toast.error(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      if (!selectedDoctorId) {
        toast.error("Please select a doctor to add.");
        setSubmitLoading(false);
        return;
      }

      // Find the selected doctor's details
      const selectedDoctor = approvedDoctors.find(
        (doc) => doc.id === selectedDoctorId
      );

      // Update the doctor's hospitalId
      const response = await axios.put(
        `/api/hospital/doctor/${selectedDoctorId}`,
        {
          hospitalId: hospitalId,
        }
      );

      if (response.data) {
        // Send email notification to the doctor
        try {
          await axios.post("/api/email/doctor-added", {
            doctorEmail: selectedDoctor.email,
            doctorName: selectedDoctor.name,
            hospitalName: hospitalName,
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the entire operation if email fails
        }

        toast.success("Doctor added to hospital successfully!");
        setTimeout(() => {
          router.push("/hospital/staff");
        }, 1500);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to add doctor"
        );
      } else {
        toast.error("A network error occurred.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNurseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!hospitalId) {
        toast.error(
          "Hospital information not found. Please complete your hospital setup first."
        );
        setSubmitLoading(false);
        return;
      }

      // Generate random password
      const generatedPassword = generatePassword();

      // Split name into first and last name
      const nameParts = nurseSignupData.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0];

      // Step 1: Create user account via external API
      console.log("Attempting to create nurse account with:", {
        first_name: firstName,
        last_name: lastName,
        email: nurseSignupData.email,
        phone_number: nurseSignupData.phonenumber,
        role: "nurse",
        age: parseInt(nurseSignupData.age),
        gender: nurseSignupData.gender,
      });

      const signupResponse = await axios.post("/api/external-auth/register", {
        first_name: firstName,
        last_name: lastName,
        email: nurseSignupData.email,
        password: generatedPassword,
        confirm_password: generatedPassword,
        phone_number: nurseSignupData.phonenumber,
        nic: nurseSignupData.nic,
        role: "nurse",
        age: parseInt(nurseSignupData.age),
        gender: nurseSignupData.gender.toLowerCase(),
      });

      console.log("Nurse account created successfully:", signupResponse.data);

      if (!signupResponse.data) {
        throw new Error("Failed to create user account");
      }

      // Step 2: Send welcome email with credentials and magic link
      await axios.post("/api/email/send-credentials", {
        to: nurseSignupData.email,
        name: nurseSignupData.name,
        email: nurseSignupData.email,
        phonenumber: nurseSignupData.phonenumber,
        password: generatedPassword,
        role: "nurse",
        hospitalId: hospitalId,
        hospitalName: hospitalName,
      });

      toast.success(
        "Nurse account created successfully! Login credentials have been sent to their email."
      );
      setTimeout(() => {
        router.push("/hospital/staff");
      }, 2000);
    } catch (err: any) {
      console.error("Nurse creation error:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response?.data);
        let errorMessage = "Failed to add nurse";

        if (err.response?.data?.message) {
          // If message is an array, join the messages
          if (Array.isArray(err.response.data.message)) {
            errorMessage = err.response.data.message.join(", ");
          } else {
            errorMessage = err.response.data.message;
          }
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response?.data?.detail) {
          errorMessage = err.response.data.detail;
        }

        toast.error(errorMessage);
      } else {
        toast.error("A network error occurred: " + err.message);
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

        {/* Doctor Form */}
        {activeTab === "doctor" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Doctor Sub-tabs */}
            <div className="border-b border-gray-200 px-6 pt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setDoctorSubTab("existing");
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
                  {/* Signup Information Section */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Information
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      A random password will be generated and sent to the
                      doctor's email address.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-name"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="doctor-signup-name"
                            name="name"
                            type="text"
                            placeholder="Dr. John Smith"
                            value={doctorSignupData.name}
                            onChange={handleDoctorSignupInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-email"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="doctor-signup-email"
                            name="email"
                            type="email"
                            placeholder="doctor@example.com"
                            value={doctorSignupData.email}
                            onChange={handleDoctorSignupInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-phone"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="doctor-signup-phone"
                            name="phonenumber"
                            type="tel"
                            placeholder="+94 77 123 4567"
                            value={doctorSignupData.phonenumber}
                            onChange={handleDoctorSignupInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Age */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-age"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Age <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="doctor-signup-age"
                            name="age"
                            type="number"
                            min="18"
                            max="100"
                            placeholder="35"
                            value={doctorSignupData.age}
                            onChange={handleDoctorSignupInputChange}
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-gender"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="doctor-signup-gender"
                          name="gender"
                          value={doctorSignupData.gender}
                          onChange={(e) =>
                            setDoctorSignupData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          className="w-full h-12 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      {/* NIC */}
                      <div className="space-y-2">
                        <label
                          htmlFor="doctor-signup-nic"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          NIC Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            id="doctor-signup-nic"
                            name="nic"
                            type="text"
                            placeholder="123456789V or 200012345678"
                            value={doctorSignupData.nic}
                            onChange={handleDoctorSignupInputChange}
                            pattern="^([0-9]{9}[VvXx]|[0-9]{12})$"
                            title="NIC must be either 9 digits followed by V/X or 12 digits"
                            className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Old format: 9 digits + V/X (e.g., 123456789V) or New
                          format: 12 digits
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> After submission, login
                        credentials will be automatically sent to{" "}
                        <strong>
                          {doctorSignupData.email || "the doctor's email"}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading
                        ? "Creating Account..."
                        : "Create Doctor Account"}
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
              {/* Signup Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  A random password will be generated and sent to the nurse's
                  email address.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-signup-name"
                        name="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={nurseSignupData.name}
                        onChange={handleNurseSignupInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-email"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-signup-email"
                        name="email"
                        type="email"
                        placeholder="nurse@example.com"
                        value={nurseSignupData.email}
                        onChange={handleNurseSignupInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-phone"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-signup-phone"
                        name="phonenumber"
                        type="tel"
                        placeholder="+94 77 123 4567"
                        value={nurseSignupData.phonenumber}
                        onChange={handleNurseSignupInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-age"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-signup-age"
                        name="age"
                        type="number"
                        min="18"
                        max="100"
                        placeholder="30"
                        value={nurseSignupData.age}
                        onChange={handleNurseSignupInputChange}
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-gender"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="nurse-signup-gender"
                      name="gender"
                      value={nurseSignupData.gender}
                      onChange={(e) =>
                        setNurseSignupData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="w-full h-12 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* NIC */}
                  <div className="space-y-2">
                    <label
                      htmlFor="nurse-signup-nic"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      NIC Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="nurse-signup-nic"
                        name="nic"
                        type="text"
                        placeholder="123456789V or 200012345678"
                        value={nurseSignupData.nic}
                        onChange={handleNurseSignupInputChange}
                        pattern="^([0-9]{9}[VvXx]|[0-9]{12})$"
                        title="NIC must be either 9 digits followed by V/X or 12 digits"
                        className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Old format: 9 digits + V/X (e.g., 123456789V) or New
                      format: 12 digits
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After submission, login credentials
                    will be automatically sent to{" "}
                    <strong>
                      {nurseSignupData.email || "the nurse's email"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading
                    ? "Creating Account..."
                    : "Create Nurse Account"}
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
      <ToastContainer />
    </div>
  );
}
