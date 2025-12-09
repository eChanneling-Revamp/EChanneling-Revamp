"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/doctor/ProfileTab";
import QualificationsTab from "@/components/doctor/QualificationsTab";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface HospitalAffiliation {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  assignedAt: string;
}

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experience: number;
  phonenumber: string;
  profileImage: string | null;
  description: string | null;
  hospitalAffiliations: HospitalAffiliation[];
}

export default function DoctorProfilePage() {
  const { status, isLoading: statusLoading } = useDoctorStatus();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/doctor/profile");
      setProfile(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (data: Partial<DoctorProfile>) => {
    try {
      const response = await axios.patch("/api/doctor/profile", data);
      setProfile(response.data);
      // Show success message (you can add a toast notification here)
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.error || "Failed to update profile");
      throw err;
    }
  };

  // Show pending approval screen if doctor is not approved
  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status !== "APPROVED") {
    return <PendingApprovalScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4 sm:mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab
              profile={profile}
              isLoading={isLoading}
              onSave={handleSaveProfile}
            />
          </TabsContent>

          {/* Qualifications Tab */}
          <TabsContent value="qualifications">
            <QualificationsTab />
          </TabsContent>

          {/* Security Tab (Placeholder) */}
          <TabsContent value="security">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500">Security section coming soon...</p>
            </div>
          </TabsContent>

          {/* Preferences Tab (Placeholder) */}
          <TabsContent value="preferences">
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <p className="text-gray-500">Preferences section coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
