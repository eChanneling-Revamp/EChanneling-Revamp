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
        router.push("/admin/hospitals");
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Hospital</h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Hospital Name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="Registration Number"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="taxId"
              value={formData.taxId}
              onChange={handleInputChange}
              placeholder="Tax ID"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <select
              name="hospitalType"
              value={formData.hospitalType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Private General Hospital">Private General Hospital</option>
              <option value="Private Specialty Hospital">Private Specialty Hospital</option>
              <option value="Government Hospital">Government Hospital</option>
            </select>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Contact & Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Contact Number"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="address.street"
              value={formData.address.street}
              onChange={handleInputChange}
              placeholder="Street"
              required
              className="w-full px-4 py-2 border rounded-lg md:col-span-2"
            />
            <input
              name="address.city"
              value={formData.address.city}
              onChange={handleInputChange}
              placeholder="City"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="address.state"
              value={formData.address.state}
              onChange={handleInputChange}
              placeholder="State"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleInputChange}
              placeholder="ZIP Code"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              name="address.country"
              value={formData.address.country}
              onChange={handleInputChange}
              placeholder="Country"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Operating Hours</h2>
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day} className="flex flex-wrap items-center gap-4 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-24">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.operatingHours[day].isOpen}
                    onChange={(e) =>
                      handleOperatingHoursChange(day, "isOpen", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Open</span>
                </div>
                {formData.operatingHours[day].isOpen && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={formData.operatingHours[day].open}
                      onChange={(e) =>
                        handleOperatingHoursChange(day, "open", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <input
                      type="time"
                      value={formData.operatingHours[day].close}
                      onChange={(e) =>
                        handleOperatingHoursChange(day, "close", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Hospital"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHospital;