"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface Hospital {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  services?: string[];
  facilities?: string[];
  status?: string;
  isActive?: boolean;
  profileImage?: string;
}

export default function DoctorHospitalsPage() {
  const router = useRouter();
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["doctor"],
  });
  const { status, isLoading: statusLoading, needsSetup } = useDoctorStatus();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    // Redirect to setup if doctor needs to complete profile
    if (!statusLoading && needsSetup) {
      router.push("/doctor-setup");
    }
  }, [needsSetup, statusLoading, router]);

  useEffect(() => {
    // Get doctor info from localStorage
    const userDataStr = localStorage.getItem("user");

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const email = userData.email;

        // Fetch doctor ID by email
        fetch(`/api/hospital/doctor?email=${email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.data && data.data.id) {
              setDoctorId(data.data.id);
              // Fetch hospitals for this doctor using hospitalId array
              fetchHospitals(data.data.hospitalId || []);
            } else {
              console.error("Doctor not found");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Error fetching doctor info:", err);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHospitals = async (hospitalId: string[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/hospital");
      const data = await res.json();

      if (data.data && Array.isArray(data.data)) {
        // Filter to show only the doctor's assigned hospitals
        if (hospitalId.length > 0) {
          const filtered = data.data.filter((h: Hospital) =>
            hospitalId.includes(h.id)
          );
          setHospitals(filtered);
        } else {
          // If no hospitalIds assigned, show empty list
          setHospitals([]);
        }
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Show pending approval screen if doctor is pending
  if (status === "PENDING") {
    return <PendingApprovalScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            My Hospitals
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading hospitals...</p>
              </div>
            </div>
          ) : hospitals.length === 0 ? (
            <Card className="bg-white shadow">
              <CardContent className="p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Hospitals Found
                </h3>
                <p className="text-gray-600">
                  You are not currently assigned to any hospital.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-0"
                >
                  {/* Header with gradient background */}
                  <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute -bottom-16 left-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                          {hospital.profileImage ? (
                            <img
                              src={hospital.profileImage}
                              alt={hospital.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                              <svg
                                className="w-16 h-16 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        {hospital.status && (
                          <div className="absolute -top-2 -right-2">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                                hospital.status === "APPROVED"
                                  ? "bg-green-500 text-white"
                                  : hospital.status === "PENDING"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {hospital.status === "APPROVED" && (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {hospital.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="pt-20 pb-6 px-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">
                        {hospital.name}
                      </h3>
                      {hospital.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                          {hospital.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      {hospital.address && (
                        <div className="flex items-start gap-3 group">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <svg
                              className="w-4 h-4 text-blue-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                              Address
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {hospital.address}
                            </p>
                          </div>
                        </div>
                      )}

                      {hospital.phone && (
                        <div className="flex items-start gap-3 group">
                          <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                            <svg
                              className="w-4 h-4 text-green-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                              Phone
                            </p>
                            <p className="text-sm text-gray-800 font-medium">
                              {hospital.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {hospital.email && (
                        <div className="flex items-start gap-3 group">
                          <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <svg
                              className="w-4 h-4 text-purple-600 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                              Email
                            </p>
                            <p className="text-sm text-gray-800 font-medium break-all">
                              {hospital.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {hospital.facilities && hospital.facilities.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                          Facilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {hospital.facilities
                            .slice(0, 4)
                            .map((facility, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100"
                              >
                                <svg
                                  className="w-3 h-3 mr-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {facility}
                              </span>
                            ))}
                          {hospital.facilities.length > 4 && (
                            <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              +{hospital.facilities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
