"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Hospital {
  _id: string;
  name: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  address: {
    city: string;
    state: string;
  };
  hospitalType: string;
  isActive: boolean;
}

interface ListHospitalsProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

// Mock data for now
const mockHospitals: Hospital[] = [
  {
    _id: "1",
    name: "Asiri Medical City",
    registrationNumber: "REG001",
    contactNumber: "+94 11 466 5500",
    email: "info@asirihealth.com",
    address: { city: "Colombo", state: "Western" },
    hospitalType: "Private General Hospital",
    isActive: true,
  },
  {
    _id: "2",
    name: "Lanka Hospital",
    registrationNumber: "REG002",
    contactNumber: "+94 11 543 0000",
    email: "info@lankahospitals.com",
    address: { city: "Colombo", state: "Western" },
    hospitalType: "Private General Hospital",
    isActive: true,
  },
  {
    _id: "3",
    name: "Nawaloka Hospital",
    registrationNumber: "REG003",
    contactNumber: "+94 11 254 4444",
    email: "info@nawaloka.com",
    address: { city: "Colombo", state: "Western" },
    hospitalType: "Private Specialty Hospital",
    isActive: false,
  },
];

export default function ListHospitals({ searchQuery, statusFilter, typeFilter }: ListHospitalsProps) {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = searchQuery === "" || 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Active" ? hospital.isActive : !hospital.isActive);
    
    const matchesType = typeFilter === "All" || hospital.hospitalType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    
    try {
      // Remove from mock data
      setHospitals(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      setError("Failed to delete hospital");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hospital Info
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff Count
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredHospitals.map((hospital) => (
            <tr key={hospital._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-[#013e7f] text-white rounded-lg flex items-center justify-center">
                    {hospital.name[0]}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                    <div className="text-sm text-gray-500">Reg: {hospital.registrationNumber}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{hospital.contactNumber}</div>
                <div className="text-sm text-gray-500">{hospital.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">15 Doctors</div>
                <div className="text-sm text-gray-500">3 Admin Staff</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  hospital.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {hospital.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => router.push(`/admin/hospitals/${hospital._id}`)}
                    className="text-gray-600 hover:text-[#013e7f]"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/hospitals/${hospital._id}/edit`)}
                    className="text-gray-600 hover:text-[#013e7f]"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(hospital._id)}
                    className="text-gray-600 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredHospitals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hospitals found
        </div>
      )}
    </div>
  );
}