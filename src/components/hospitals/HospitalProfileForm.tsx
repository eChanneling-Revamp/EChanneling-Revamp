"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Check,
  Edit2,
  Save,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "@/components/ui/toast-container";

interface HospitalData {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  contactNumber: string;
  email: string;
  website: string | null;
  facilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HospitalProfileFormProps {
  userEmail: string;
}

export function HospitalProfileForm({ userEmail }: HospitalProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    contactNumber: "",
    email: "",
    website: "",
    facilities: [] as string[],
  });

  const [newFacility, setNewFacility] = useState("");

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Moneragala",
    "Ratnapura",
    "Kegalle",
  ];

  useEffect(() => {
    fetchHospitalData();
  }, [userEmail]);

  const fetchHospitalData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/hospital/check?email=${userEmail}`
      );

      if (response.data.exists && response.data.data) {
        const hospital = response.data.data;
        setHospitalData(hospital);
        setFormData({
          name: hospital.name,
          address: hospital.address,
          city: hospital.city,
          district: hospital.district,
          contactNumber: hospital.contactNumber,
          email: hospital.email,
          website: hospital.website || "",
          facilities: hospital.facilities || [],
        });
      }
    } catch (error: any) {
      console.error("Error fetching hospital data:", error);
      toast.error("Failed to load hospital data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFacility = () => {
    if (
      newFacility.trim() &&
      !formData.facilities.includes(newFacility.trim())
    ) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const handleRemoveFacility = (facility: string) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((f) => f !== facility),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!hospitalData?.id) {
        toast.error("Hospital ID not found");
        return;
      }

      const response = await axios.put(
        `/api/hospital/${hospitalData.id}`,
        formData
      );

      if (response.data) {
        toast.success("Hospital profile updated successfully!");
        setHospitalData(response.data.data);
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Error updating hospital:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to update hospital profile"
        );
      } else {
        toast.error("An error occurred while updating hospital profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hospitalData) {
      setFormData({
        name: hospitalData.name,
        address: hospitalData.address,
        city: hospitalData.city,
        district: hospitalData.district,
        contactNumber: hospitalData.contactNumber,
        email: hospitalData.email,
        website: hospitalData.website || "",
        facilities: hospitalData.facilities || [],
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading hospital profile...</p>
        </div>
      </div>
    );
  }

  if (!hospitalData) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No hospital data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hospital Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your hospital information
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="space-y-6">
            {/* Hospital Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter hospital name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-semibold text-gray-700"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* City and District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="district"
                  className="block text-sm font-semibold text-gray-700"
                >
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select district</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-semibold text-gray-700"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="w-full h-12 pl-11 pr-4 text-base text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="block text-sm font-semibold text-gray-700"
              >
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Facilities & Services
              </label>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add facility (e.g., ICU, Emergency)"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFacility();
                      }
                    }}
                    className="flex-1 h-12 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
              {formData.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>{facility}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(facility)}
                          className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No facilities added yet</p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Metadata */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-gray-900">
                {hospitalData.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Created At</p>
              <p className="font-medium text-gray-900">
                {new Date(hospitalData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">
                {new Date(hospitalData.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
