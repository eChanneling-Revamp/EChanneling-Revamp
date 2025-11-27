"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Phone, Mail, Globe, Check } from "lucide-react";
import axios from "axios";

interface HospitalSetupFormProps {
  userEmail: string;
}

export function HospitalSetupForm({ userEmail }: HospitalSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    district: "",
    contactNumber: "",
    email: userEmail,
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
    setError("");
    setIsLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.address ||
        !formData.city ||
        !formData.district ||
        !formData.contactNumber
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      // Create hospital in database
      const response = await axios.post("/api/hospital", formData);

      if (response.data) {
        console.log("Hospital created successfully:", response.data);

        // Redirect to hospital dashboard
        router.push("/hospital/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating hospital:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to create hospital profile"
        );
      } else {
        setError("An error occurred while creating hospital profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Hospital Setup</h1>
              <p className="text-blue-100 mt-1">
                Complete your hospital profile to get started
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

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
                className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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
                className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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
                className="w-full h-12 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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
                className="w-full h-12 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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
                className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
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
            <p className="text-xs text-gray-500">
              This is your account email and cannot be changed
            </p>
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
                className="w-full h-12 pl-11 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Facilities & Services
            </label>
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
            {formData.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{facility}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFacility(facility)}
                      className="ml-1 text-blue-500 hover:text-blue-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
