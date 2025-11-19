"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hospital, Search } from "lucide-react";

interface HospitalData {
  id: string;
  name: string;
  city: string;
  district: string;
  contactNumber: string;
  address: string;
  isActive: boolean;
  _count: {
    doctors: number;
  };
}

const cardColors = [
  "bg-[#013e7f]", // Dark blue
  "bg-[#00bcd4]", // Cyan
  "bg-[#4caf50]", // Green
];

export default function BrowseHospitalsPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hospital?active=true");
      
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }

      const result = await response.json();
      setHospitals(result.data || []);
    } catch (err) {
      setError("Failed to load hospitals. Please try again.");
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique locations for filter
  const locations = ["All Locations", ...Array.from(new Set(hospitals.map(h => h.city)))];

  // Filter hospitals based on search and location
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "All Locations" || hospital.city === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const handleViewDoctors = (hospitalId: string) => {
    router.push(`/user/hospitals/${hospitalId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013e7f] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Browse Hospitals</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#013e7f] focus:border-transparent"
          />
        </div>

        {/* Location Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#013e7f] focus:border-transparent"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {filteredHospitals.length === 0 ? (
        <div className="text-center py-12">
          <Hospital className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No hospitals found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color Header with Icon */}
              <div className={`${cardColors[index % cardColors.length]} h-40 flex items-center justify-center`}>
                <Hospital className="w-20 h-20 text-white" strokeWidth={1.5} />
              </div>

              {/* Hospital Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                  <p className="text-sm text-gray-600">{hospital.city}</p>
                  <p className="text-sm text-gray-600">{hospital.contactNumber}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-green-600">
                    {hospital._count.doctors} Doctors Available
                  </span>
                  <button
                    onClick={() => handleViewDoctors(hospital.id)}
                    className="px-4 py-2 bg-[#013e7f] text-white text-sm font-medium rounded-md hover:bg-[#02326a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013e7f]"
                  >
                    View Doctors
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
