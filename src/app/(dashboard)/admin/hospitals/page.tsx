"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import ListHospitals from "@/components/hospitals/ListHospitals";

export default function HospitalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Hospitals</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and monitor all registered hospitals</p>
        </div>
        <button
          onClick={() => router.push("/admin/hospitals/add")}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#013e7f] hover:bg-[#02326a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013e7f]"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Hospital
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-1 focus:ring-[#013e7f] focus:border-[#013e7f]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#013e7f] focus:border-[#013e7f]"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#013e7f] focus:border-[#013e7f]"
        >
          <option value="All">All Types</option>
          <option value="Private General Hospital">Private General</option>
          <option value="Private Specialty Hospital">Private Specialty</option>
          <option value="Government Hospital">Government</option>
        </select>
      </div>

      <ListHospitals
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
      />
    </div>
  );
}