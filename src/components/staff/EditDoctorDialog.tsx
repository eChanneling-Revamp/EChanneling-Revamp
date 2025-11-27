"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  Globe,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  description?: string;
  profileImage?: string;
  languages: string[];
  availableDays: string[];
  isActive: boolean;
}

interface EditDoctorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onSuccess: () => void;
}

const specializations = [
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Gynecology",
  "Hematology",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Otolaryngology (ENT)",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
  "Anesthesiology",
];

const languageOptions = ["English", "Sinhala", "Tamil"];
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditDoctorDialog({
  isOpen,
  onClose,
  doctor,
  onSuccess,
}: EditDoctorDialogProps) {
  const [formData, setFormData] = useState({
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
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phonenumber: doctor.phonenumber,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience.toString(),
        consultationFee: doctor.consultationFee.toString(),
        description: doctor.description || "",
        profileImage: doctor.profileImage || "",
        languages: doctor.languages,
        availableDays: doctor.availableDays,
        isActive: doctor.isActive,
      });
    }
  }, [doctor]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: "languages" | "availableDays",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phonenumber: formData.phonenumber,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
        description: formData.description || null,
        profileImage: formData.profileImage || null,
        languages: formData.languages,
        availableDays: formData.availableDays,
        isActive: formData.isActive,
      };

      const response = await axios.put(
        `/api/hospital/doctor/${doctor?.id}`,
        updateData
      );

      if (response.data) {
        setSuccess("Doctor updated successfully!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to update doctor"
        );
      } else {
        setError("A network error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Doctor</h2>
            <p className="text-blue-100 text-sm mt-1">
              Update doctor information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
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
                      type="tel"
                      value={formData.phonenumber}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialization */}
                <div className="space-y-2">
                  <label
                    htmlFor="specialization"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                      value={formData.qualification}
                      onChange={handleInputChange}
                      placeholder="e.g., MBBS, MD"
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Consultation Fee */}
                <div className="space-y-2">
                  <label
                    htmlFor="consultationFee"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Consultation Fee (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Additional Information
              </h3>
              <div className="space-y-4">
                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description about the doctor..."
                    className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                </div>

                {/* Profile Image URL */}
                <div className="space-y-2">
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="url"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full h-11 pl-11 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Languages
                  </label>
                  <div className="flex gap-4">
                    {languageOptions.map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={() =>
                            handleCheckboxChange("languages", lang)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
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
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.availableDays.includes(day)}
                          onChange={() =>
                            handleCheckboxChange("availableDays", day)
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Active Status
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Doctor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
