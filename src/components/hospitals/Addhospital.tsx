"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OperatingHour {
  open: string;
  close: string;
  isOpen: boolean;
}

interface OperatingHours {
  [key: string]: OperatingHour;
}

interface HospitalFormData {
  name: string;
  registrationNumber: string;
  address: Address;
  taxId: string;
  contactNumber: string;
  email: string;
  hospitalType: string;
  operatingHours: OperatingHours;
}

const AddHospital: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<HospitalFormData>({
    name: "",
    registrationNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sri Lanka",
    },
    taxId: "",
    contactNumber: "",
    email: "",
    hospitalType: "Private General Hospital",
    operatingHours: {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      tuesday: { open: "08:00", close: "17:00", isOpen: true },
      wednesday: { open: "08:00", close: "17:00", isOpen: true },
      thursday: { open: "08:00", close: "17:00", isOpen: true },
      friday: { open: "08:00", close: "17:00", isOpen: true },
      saturday: { open: "08:00", close: "12:00", isOpen: true },
      sunday: { open: "09:00", close: "12:00", isOpen: false },
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: { ...prev.operatingHours[day], [field]: value },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hospital", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/hospitals");
        router.refresh();
      } else {
        setError(data.error || "Failed to create hospital");
      }
    } catch (err) {
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add New Hospital</h1>
          <p className="mt-1 text-sm text-gray-600">Fill in the details to register a new hospital.</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter hospital name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                placeholder="Enter registration number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax ID <span className="text-red-500">*</span>
              </label>
              <input
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                placeholder="Enter tax ID"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Type <span className="text-red-500">*</span>
              </label>
              <select
                name="hospitalType"
                value={formData.hospitalType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900"
              >
                <option value="Private General Hospital">Private General Hospital</option>
                <option value="Private Specialty Hospital">Private Specialty Hospital</option>
                <option value="Government Hospital">Government Hospital</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Contact & Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter contact number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                placeholder="Enter state/province"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Operating Hours</h2>
          <div className="space-y-3">
            {days.map((day) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 min-w-[140px]">
                  <input
                    type="checkbox"
                    checked={formData.operatingHours[day].isOpen}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, "isOpen", e.target.checked)
                    }
                    className="h-4 w-4 text-[#013e7f] focus:ring-[#013e7f] border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize min-w-[80px]">{day}</span>
                </div>
                {formData.operatingHours[day].isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={formData.operatingHours[day].open}
                      onChange={(e) =>
                        handleOperatingHoursChange(day, "open", e.target.value)
                      }
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.operatingHours[day].close}
                      onChange={(e) =>
                        handleOperatingHoursChange(day, "close", e.target.value)
                      }
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#013e7f] focus:border-[#013e7f] text-gray-900"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013e7f]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#013e7f] hover:bg-[#02326a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013e7f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Hospital"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHospital;