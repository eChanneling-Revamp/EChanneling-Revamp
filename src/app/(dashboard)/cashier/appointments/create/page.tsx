"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoleProtection } from "@/hooks/useRoleProtection";
import axios from "axios";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
}

interface Session {
  id: string;
  scheduledAt: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string;
  status: string;
  doctorName: string;
  appointments?: any[];
}

export default function CreateAppointmentPage() {
  const router = useRouter();
  const { isAuthorized, isLoading: authLoading } = useRoleProtection({
    allowedRoles: ["cashier"],
  });

  const [cashierData, setCashierData] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "",
    doctorId: "",
    sessionId: "",
    notes: "",
  });

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        console.log("Cashier user data:", userData);
        setCashierData(userData);
        if (userData.hospitalId) {
          console.log("Fetching doctors for hospital:", userData.hospitalId);
          fetchDoctors(userData.hospitalId);
        } else {
          console.error("No hospitalId found in user data");
          toast.error("Hospital information not found");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.error("No user data found in localStorage");
    }
  }, []);

  const fetchDoctors = async (hospitalId: string) => {
    try {
      setLoadingDoctors(true);
      console.log("Fetching doctors from API for hospitalId:", hospitalId);
      const response = await axios.get(
        `/api/hospital/doctor?hospitalId=${hospitalId}`,
      );
      console.log("API Response:", response.data);

      if (response.data && response.data.data) {
        console.log("Doctors found:", response.data.data.length);
        setDoctors(response.data.data);

        if (response.data.data.length === 0) {
          toast.error("No doctors found for this hospital");
        }
      } else {
        console.error(
          "No doctors found or unexpected response:",
          response.data,
        );
        setDoctors([]);
        toast.error("No doctors available");
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to load doctors");
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchSessions = async (doctorId: string) => {
    try {
      setLoadingSessions(true);
      const response = await axios.get(
        `/api/sessions?doctorId=${doctorId}&hospitalId=${cashierData.hospitalId}`,
      );

      if (response.data) {
        // Filter for upcoming sessions with available slots and SCHEDULED status
        const now = new Date();
        const upcomingSessions = response.data.filter((session: any) => {
          const sessionDate = new Date(session.startTime);
          const appointmentCount = session.appointments?.length || 0;
          const availableSlots = session.capacity - appointmentCount;

          return (
            sessionDate >= now &&
            availableSlots > 0 &&
            session.status === "SCHEDULED"
          );
        });

        setSessions(upcomingSessions);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    setFormData({ ...formData, doctorId, sessionId: "" });
    setSessions([]);
    if (doctorId) {
      fetchSessions(doctorId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.patientName ||
      !formData.patientEmail ||
      !formData.patientPhone ||
      !formData.patientAge ||
      !formData.patientGender ||
      !formData.doctorId ||
      !formData.sessionId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      // Get session details to extract consultation fee
      const selectedSession = sessions.find((s) => s.id === formData.sessionId);

      // Create appointment
      const appointmentData = {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        patientGender: formData.patientGender.toUpperCase(), // Convert to uppercase for enum
        sessionId: formData.sessionId,
        notes: formData.notes || "",
        bookingType: "walk-in",
        paymentStatus: "PENDING",
        status: "CONFIRMED",
        isNewPatient: true,
        consultationFee: "0.00", // Decimal as string
        totalAmount: "0.00", // Decimal as string
      };

      console.log("Sending appointment data:", appointmentData);
      const response = await axios.post("/api/appointments", appointmentData);

      if (response.data.success) {
        toast.success("Appointment created successfully!");

        // Reset form
        setFormData({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          patientAge: "",
          patientGender: "",
          doctorId: "",
          sessionId: "",
          notes: "",
        });
        setSessions([]);

        // Optional: Redirect to appointments list
        setTimeout(() => {
          router.push("/cashier/appointments");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to create appointment";
      const errorDetails = error.response?.data?.details;

      if (errorDetails) {
        console.error("Error details:", errorDetails);
        toast.error(`${errorMessage}: ${JSON.stringify(errorDetails)}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Walk-In Appointment
          </h1>
          <p className="text-gray-600 mt-2">
            Register a new appointment for patients coming directly to the
            hospital
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, patientEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="patient@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, patientPhone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="+94 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) =>
                    setFormData({ ...formData, patientAge: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter age"
                  min="1"
                  max="150"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.patientGender === "Male"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientGender: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                      required
                    />
                    <span className="ml-2 text-gray-900">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.patientGender === "Female"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientGender: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-900">Female</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.patientGender === "Other"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientGender: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-900">Other</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Appointment Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                {loadingDoctors ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <select
                    value={formData.doctorId}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Session <span className="text-red-500">*</span>
                </label>
                {loadingSessions ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : formData.doctorId && sessions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No available sessions for this doctor
                  </div>
                ) : (
                  <select
                    value={formData.sessionId}
                    onChange={(e) =>
                      setFormData({ ...formData, sessionId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                    disabled={!formData.doctorId}
                  >
                    <option value="">Choose a session</option>
                    {sessions.map((session) => {
                      const sessionDate = new Date(session.startTime);
                      const startTime = sessionDate.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );
                      const endTime = new Date(
                        session.endTime,
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const appointmentCount =
                        session.appointments?.length || 0;
                      const availableSlots =
                        session.capacity - appointmentCount;

                      return (
                        <option key={session.id} value={session.id}>
                          {sessionDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          | {startTime} - {endTime} | {session.location} |
                          Available: {availableSlots}/{session.capacity}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                  placeholder="Any additional notes or remarks..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
