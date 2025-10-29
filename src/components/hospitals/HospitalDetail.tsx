"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  monday: OperatingHour;
  tuesday: OperatingHour;
  wednesday: OperatingHour;
  thursday: OperatingHour;
  friday: OperatingHour;
  saturday: OperatingHour;
  sunday: OperatingHour;
  [key: string]: OperatingHour;
}

interface Hospital {
  _id: string;
  name: string;
  registrationNumber: string;
  address: Address;
  taxId: string;
  contactNumber: string;
  email: string;
  hospitalType: string;
  operatingHours: OperatingHours;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HospitalDetailProps {
  hospitalId: string;
}

const HospitalDetail: React.FC<HospitalDetailProps> = ({ hospitalId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Hospital | null>(null);

  useEffect(() => {
    if (hospitalId) {
      fetchHospital();
    }
  }, [hospitalId]);

  const fetchHospital = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}`);
      const data = await response.json();

      if (response.ok) {
        setHospital(data.data);
        setEditData(data.data);
      } else {
        setError(data.error || "Failed to fetch hospital details");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (!editData) return;
      
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok) {
        setHospital(data.data);
        setIsEditing(false);
      } else {
        setError(data.error || "Failed to update hospital");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData(hospital);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setEditData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        };
      });
    } else {
      setEditData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleOperatingHoursChange = (day: string, field: string, value: boolean | string) => {
    if (!editData) return;
    
    setEditData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: {
            ...prev.operatingHours[day],
            [field]: value,
          },
        },
      };
    });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">{error}</div>;
  }

  if (!hospital) {
    return <div className="p-6 text-center text-gray-500">Hospital not found</div>;
  }

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const canEdit = ["admin", "hospital"].includes(session?.user?.role as string);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Hospitals
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{hospital.name}</h1>
          <p className="text-gray-600">Registration: {hospital.registrationNumber}</p>
        </div>
        {canEdit && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
              {isEditing && editData ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="mt-1 text-gray-900 font-medium">{hospital.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <p className="mt-1 text-gray-900">{hospital.registrationNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax ID</label>
              {isEditing && editData ? (
                <input
                  type="text"
                  name="taxId"
                  value={editData.taxId}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="mt-1 text-gray-900">{hospital.taxId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Type</label>
              {isEditing && editData ? (
                <select
                  name="hospitalType"
                  value={editData.hospitalType}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="Private General Hospital">Private General Hospital</option>
                  <option value="Private Specialty Hospital">Private Specialty Hospital</option>
                  <option value="Government Hospital">Government Hospital</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-900">{hospital.hospitalType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  hospital.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {hospital.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditing && editData ? (
                <input
                  type="tel"
                  name="contactNumber"
                  value={editData.contactNumber}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="mt-1 text-gray-900">{hospital.contactNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing && editData ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="mt-1 text-gray-900">{hospital.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {isEditing && editData ? (
                <div className="mt-1 space-y-3">
                  <input
                    type="text"
                    name="address.street"
                    value={editData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.city"
                      value={editData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="text"
                      name="address.state"
                      value={editData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="address.zipCode"
                      value={editData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="text"
                      name="address.country"
                      value={editData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-gray-900">
                  <p>{hospital.address.street}</p>
                  <p>{hospital.address.city}, {hospital.address.state} {hospital.address.zipCode}</p>
                  <p>{hospital.address.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Operating Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {days.map((day) => (
              <div key={day} className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium capitalize text-gray-800">{day}</span>
                  {isEditing && editData ? (
                    <input
                      type="checkbox"
                      checked={editData.operatingHours[day].isOpen}
                      onChange={(e) =>
                        handleOperatingHoursChange(day, "isOpen", e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        hospital.operatingHours[day].isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {hospital.operatingHours[day].isOpen ? "Open" : "Closed"}
                    </span>
                  )}
                </div>
                {(isEditing && editData ? editData.operatingHours[day].isOpen : hospital.operatingHours[day].isOpen) && (
                  <div className="text-sm text-gray-700">
                    {isEditing && editData ? (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="w-12 text-xs text-gray-500">Open:</span>
                          <input
                            type="time"
                            value={editData.operatingHours[day].open}
                            onChange={(e) =>
                              handleOperatingHoursChange(day, "open", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="w-12 text-xs text-gray-500">Close:</span>
                          <input
                            type="time"
                            value={editData.operatingHours[day].close}
                            onChange={(e) =>
                              handleOperatingHoursChange(day, "close", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-center font-medium">
                        {hospital.operatingHours[day].open} - {hospital.operatingHours[day].close}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Created:</span> {new Date(hospital.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(hospital.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;