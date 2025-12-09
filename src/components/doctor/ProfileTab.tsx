"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  User,
  MapPin,
  Building2,
  Camera,
  Loader2,
} from "lucide-react";

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

interface ProfileTabProps {
  profile: DoctorProfile | null;
  isLoading: boolean;
  onSave: (data: Partial<DoctorProfile>) => Promise<void>;
}

export default function ProfileTab({
  profile,
  isLoading,
  onSave,
}: ProfileTabProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonenumber: "",
    specialization: "",
    registrationNumber: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const nameParts = profile.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        email: profile.email,
        phonenumber: profile.phonenumber,
        specialization: profile.specialization,
        registrationNumber: profile.qualification, // Using qualification as registration number
        address: profile.description || "",
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await onSave({
        name: fullName,
        phonenumber: formData.phonenumber,
        specialization: formData.specialization,
        description: formData.address,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (!profile?.name) return "D";
    const names = profile.name.split(" ");
    return names[0]?.[0]?.toUpperCase() || "D";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile?.profileImage || undefined} />
              <AvatarFallback className="bg-blue-900 text-white text-4xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </CardContent>
        </Card>

        {/* Hospital Affiliations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hospital Affiliations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.hospitalAffiliations.map((hospital, index) => (
              <div key={hospital.id} className="flex items-center gap-3">
                <Building2
                  className={`w-5 h-5 ${
                    index === 0
                      ? "text-gray-700"
                      : index === 1
                      ? "text-blue-500"
                      : "text-green-500"
                  }`}
                />
                <span className="text-sm text-gray-700">{hospital.name}</span>
              </div>
            ))}
            {(!profile?.hospitalAffiliations ||
              profile.hospitalAffiliations.length === 0) && (
              <p className="text-sm text-gray-500">
                No hospital affiliations yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Personal Information Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      disabled
                      className="h-11 pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phonenumber" className="text-gray-700">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phonenumber"
                      name="phonenumber"
                      type="tel"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Specialization & Registration Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-gray-700">
                    Specialization
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      readOnly
                      disabled
                      className="h-11 pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber" className="text-gray-700">
                    Registration Number
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      readOnly
                      disabled
                      className="h-11 pl-10 bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 min-h-20"
                    placeholder="123 Main Street, Colombo 05"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-start">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
