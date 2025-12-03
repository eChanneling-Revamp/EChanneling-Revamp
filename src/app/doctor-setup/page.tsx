"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specializations } from "@/data/specializations";
import { languages } from "@/data/languages";

interface Hospital {
  id: string;
  name: string;
}

export default function DoctorSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [isHospitalPreFilled, setIsHospitalPreFilled] = useState(false);
  const [createdByHospital, setCreatedByHospital] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    description: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);

        // Get phone number with proper fallback logic
        const phoneNumber =
          userData.phone_number ||
          userData.phoneNumber ||
          userData.phonenumber ||
          "";

        setForm((prev) => ({
          ...prev,
          email: userData.email || "",
          name:
            userData.name ||
            `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          phonenumber: phoneNumber,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Get form pre-fill data from magic link
    const userFormDataStr = localStorage.getItem("userFormData");
    if (userFormDataStr) {
      try {
        const userFormData = JSON.parse(userFormDataStr);

        // Get phone number with proper fallback logic
        const phoneNumber =
          userFormData.phone_number ||
          userFormData.phoneNumber ||
          userFormData.phonenumber ||
          "";

        setForm((prev) => ({
          ...prev,
          name: userFormData.name || prev.name,
          phonenumber: phoneNumber || prev.phonenumber,
        }));
        // Check if this doctor was created by a hospital
        if (userFormData.createdByHospital) {
          setCreatedByHospital(true);
        }
      } catch (error) {
        console.error("Error parsing user form data:", error);
      }
    }

    // Check for hospital info from magic link
    const hospitalInfoStr = localStorage.getItem("hospitalInfo");
    if (hospitalInfoStr) {
      try {
        const hospitalInfo = JSON.parse(hospitalInfoStr);
        if (hospitalInfo.hospitalId) {
          setSelectedHospitalId(hospitalInfo.hospitalId);
          setIsHospitalPreFilled(true);
        }
      } catch (error) {
        console.error("Error parsing hospital info:", error);
      }
    }

    // Fetch hospitals
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch("/api/hospital");
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        setHospitals(data.data.filter((h: any) => h.status === "APPROVED"));
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/hospital/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hospitalId: selectedHospitalId || undefined,
          languages: selectedLanguages.join(", "),
          availableDays: selectedDays.join(", "),
          experience: parseInt(form.experience) || 0,
          consultationFee: parseFloat(form.consultationFee) || 0,
          rating: 0,
          isActive: true,
          createdByHospital: createdByHospital, // Pass flag to API
          // Don't send status - let API determine based on createdByHospital flag
        }),
      });

      if (res.ok) {
        // Clear temporary data from localStorage after successful submission
        localStorage.removeItem("hospitalInfo");
        localStorage.removeItem("userFormData");

        // Check if doctor was approved or pending
        const responseData = await res.json();
        const doctorStatus = responseData.data?.status;

        if (doctorStatus === "APPROVED") {
          alert("Profile setup completed! You can now access your dashboard.");
        } else {
          alert(
            "Profile setup completed! Your account is pending admin approval."
          );
        }

        router.push("/doctor/dashboard");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || "Failed to setup profile"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to setup profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Complete Your Doctor Profile
            </h1>
            <p className="text-blue-100">
              Please provide your professional details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-semibold"
                  >
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    className="h-11 bg-gray-50 text-gray-900"
                    disabled
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phonenumber"
                    className="text-gray-700 font-semibold"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phonenumber"
                    value={form.phonenumber}
                    onChange={(e) =>
                      setForm({ ...form, phonenumber: e.target.value })
                    }
                    className="h-11 text-gray-900"
                    placeholder="+94XXXXXXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="specialization"
                    className="text-gray-700 font-semibold"
                  >
                    Specialization <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.specialization}
                    onValueChange={(value) =>
                      setForm({ ...form, specialization: value })
                    }
                    required
                  >
                    <SelectTrigger className="h-11 text-gray-900">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hospital Selection */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="hospital"
                    className="text-gray-700 font-semibold"
                  >
                    Hospital Affiliation
                  </Label>
                  {isHospitalPreFilled ? (
                    <div className="h-11 px-4 rounded-lg border border-green-300 bg-green-50 flex items-center">
                      <span className="text-green-800 font-medium">
                        {hospitals.find((h) => h.id === selectedHospitalId)
                          ?.name || "Hospital pre-selected"}
                      </span>
                      <span className="ml-2 text-xs text-green-600">
                        (Assigned by hospital)
                      </span>
                    </div>
                  ) : (
                    <Select
                      value={selectedHospitalId}
                      onValueChange={(value) => setSelectedHospitalId(value)}
                    >
                      <SelectTrigger className="h-11 text-gray-900">
                        <SelectValue placeholder="Select hospital (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <p className="text-xs text-gray-500">
                    {isHospitalPreFilled
                      ? "This hospital has created your account. The affiliation is automatically set."
                      : "You can select a hospital to be affiliated with (optional). Leave blank if not affiliated with any hospital."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="qualification"
                    className="text-gray-700 font-semibold"
                  >
                    Qualification <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qualification"
                    value={form.qualification}
                    onChange={(e) =>
                      setForm({ ...form, qualification: e.target.value })
                    }
                    className="h-11 text-gray-900"
                    placeholder="e.g., MBBS, MD"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="experience"
                    className="text-gray-700 font-semibold"
                  >
                    Years of Experience <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    className="h-11 text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="consultationFee"
                    className="text-gray-700 font-semibold"
                  >
                    Consultation Fee (Rs.){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.consultationFee}
                    onChange={(e) =>
                      setForm({ ...form, consultationFee: e.target.value })
                    }
                    className="h-11 text-gray-900"
                    placeholder="e.g., 2500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-100">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">
                    Languages Spoken
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {languages.map((language) => (
                      <label
                        key={language}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLanguages([
                                ...selectedLanguages,
                                language,
                              ]);
                            } else {
                              setSelectedLanguages(
                                selectedLanguages.filter(
                                  (lang) => lang !== language
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                          {language}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 font-semibold">
                    Available Days
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDays([...selectedDays, day]);
                            } else {
                              setSelectedDays(
                                selectedDays.filter((d) => d !== day)
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                          {day}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-gray-700 font-semibold"
                  >
                    Professional Bio
                  </Label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full min-h-[120px] px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="Brief description about your expertise and approach to patient care..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
