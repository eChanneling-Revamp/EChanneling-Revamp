"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Calendar, Languages, Award, DollarSign } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: string;
  rating: string | null;
  profileImage: string | null;
  description: string | null;
  languages: string[];
  availableDays: string[];
  isActive: boolean;
}

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
  doctors: Doctor[];
}

export default function HospitalDoctorsPage() {
  const params = useParams();
  const router = useRouter();
  const hospitalId = params.id as string;
  
  const [hospital, setHospital] = useState<HospitalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hospitalId) {
      fetchHospitalData();
    }
  }, [hospitalId]);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hospital/${hospitalId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch hospital data");
      }

      const result = await response.json();
      setHospital(result.data);
    } catch (err) {
      setError("Failed to load hospital information. Please try again.");
      console.error("Error fetching hospital:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    router.push(`/user/book?hospital=${hospitalId}&doctor=${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013e7f] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading hospital information...</p>
        </div>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-[#013e7f] hover:text-[#02326a]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hospitals
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error || "Hospital not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-[#013e7f] hover:text-[#02326a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Hospitals
      </button>

      {/* Hospital Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{hospital.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-900">{hospital.address}</p>
              <p className="text-gray-600">{hospital.city}, {hospital.district}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{hospital.contactNumber}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{hospital.email}</p>
          </div>
          
          {hospital.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <a 
                href={hospital.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#013e7f] hover:underline"
              >
                {hospital.website}
              </a>
            </div>
          )}
        </div>

        {hospital.facilities && hospital.facilities.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {hospital.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Doctors Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Available Doctors ({hospital.doctors.length})
          </h2>
        </div>

        {hospital.doctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No doctors available at this hospital currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hospital.doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-[#013e7f] font-medium">{doctor.specialization}</p>
                  </div>
                  {doctor.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                    </div>
                  )}
                </div>

                {doctor.description && (
                  <p className="text-sm text-gray-600 mb-4">{doctor.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{doctor.qualification}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{doctor.experience} years experience</span>
                  </div>

                  {doctor.languages && doctor.languages.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Languages className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{doctor.languages.join(", ")}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      Rs. {parseFloat(doctor.consultationFee).toLocaleString()}
                    </span>
                  </div>
                </div>

                {doctor.availableDays && doctor.availableDays.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available Days</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.map((day, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="w-full px-4 py-2 bg-[#013e7f] text-white text-sm font-medium rounded-md hover:bg-[#02326a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013e7f]"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
