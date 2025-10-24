"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Hospital {
  _id: string;
  name: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId: string;
  contactNumber: string;
  email: string;
  hospitalType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListHospitalsProps {
  refreshTrigger?: number;
}

const ListHospitals: React.FC<ListHospitalsProps> = ({ refreshTrigger = 0 }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetchHospitals();
  }, [refreshTrigger]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hospital");
      const data = await response.json();
      if (response.ok) {
        setHospitals(data.data);
      } else {
        setError(data.error || "Failed to fetch hospitals");
      }
    } catch (err) {
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this hospital?`)) return;

    try {
      const response = await fetch(`/api/hospital/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchHospitals();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      setError('A network error occurred.');
    }
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hospital => {
      const searchMatch = searchTerm.toLowerCase() === '' ||
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || hospital.isActive === (statusFilter === 'true');
      const typeMatch = typeFilter === 'all' || hospital.hospitalType === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [hospitals, searchTerm, statusFilter, typeFilter]);

  if (loading) {
    return <div className="p-6 text-center">Loading hospitals...</div>;
  }

  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Private General Hospital">Private General</option>
            <option value="Private Specialty Hospital">Private Specialty</option>
            <option value="Government Hospital">Government</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHospitals.map((hospital) => (
                <tr key={hospital._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{hospital.name}</div>
                    <div className="text-xs text-gray-500">Reg: {hospital.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.address.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.hospitalType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${hospital.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {hospital.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => router.push(`/hospitals/${hospital._id}`)} className="text-blue-600 hover:text-blue-900">View</button>
                      {["admin"].includes(session?.user?.role as string) && (
                        <button onClick={() => handleStatusToggle(hospital._id, hospital.isActive)} className={`${hospital.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}>
                          {hospital.isActive ? "Disable" : "Enable"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHospitals.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No hospitals found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListHospitals;