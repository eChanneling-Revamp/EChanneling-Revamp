"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Check,
  Loader2,
  Camera,
  Save,
  X,
  Edit2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { ToastContainer } from "@/components/ui/toast-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/components/hospitals/SecurityTab";
import PreferencesTab from "@/components/hospitals/PreferencesTab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}

interface HospitalUserProfileProps {
  userEmail: string;
}

function ProfileDetails({ hospital, onSave }: { hospital: HospitalData | null, onSave: (data: any) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    contactNumber: "",
    website: "",
  });

  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        contactNumber: hospital.contactNumber,
        website: hospital.website || "",
      });
    }
  }, [hospital]);

  if (!hospital) {
    return (
      <div className="p-6 text-center text-gray-600">
        Could not load hospital profile.
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "H";
    const words = name.split(" ");
    if (words.length > 1) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (hospital) {
      setFormData({
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        contactNumber: hospital.contactNumber,
        website: hospital.website || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSaveChanges}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-md">
                <AvatarImage
                  src="/placeholder-hospital.jpg"
                  alt={hospital.name}
                />
                <AvatarFallback className="text-3xl bg-blue-800 text-white">
                  {getInitials(hospital.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-800">
                {hospital.name}
              </h2>
              <p className="text-gray-500">{hospital.email}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => alert("Change Photo functionality to be implemented.")}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Hospital Information</CardTitle>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Hospital Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone Number</Label>
                  <Input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} disabled={!isEditing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export function HospitalUserProfile({ userEmail }: HospitalUserProfileProps) {
  const [hospital, setHospital] = useState<HospitalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHospitalData = async () => {
    if (!userEmail) return;
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/hospital/check?email=${userEmail}`
      );
      if (response.data.exists && response.data.data) {
        setHospital(response.data.data);
      } else {
        toast.error("Hospital profile not found.");
      }
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      toast.error("Failed to load hospital profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, [userEmail]);

  const handleSave = async (data: any) => {
    try {
      // This is a simulated save. Replace with a real API call.
      console.log("Saving data:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
      // Refetch data to show updated info
      fetchHospitalData();
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4 sm:mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileDetails hospital={hospital} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
      <ToastContainer />
    </>
  );
}