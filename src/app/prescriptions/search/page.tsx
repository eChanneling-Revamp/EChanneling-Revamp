"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Search,
  ArrowLeft,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  Download,
  Mail as MailIcon,
  Phone as PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

interface DoctorInfo {
  name: string;
  email: string;
  phonenumber: string;
  specialization: string;
  profileImage?: string;
}

interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  nic?: string;
  dateOfBirth?: string;
  gender?: string;
  age?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  currentMedications?: string;
  allergies?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  isNewPatient: boolean;
}

interface PrescriptionDetail {
  id: string;
  prescriptionNumber: string;
  htmlContent: string;
  doctor: DoctorInfo;
  patient: PatientInfo;
  appointmentNumber: string;
  appointmentDate: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export default function PrescriptionSearchPage() {
  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionNumber.trim()) {
      setError("Please enter a prescription number");
      return;
    }

    setIsLoading(true);
    setError("");
    setPrescription(null);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/prescriptions/search?prescriptionNumber=${encodeURIComponent(
          prescriptionNumber,
        )}`,
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Prescription not found");
        setPrescription(null);
        return;
      }

      const data = await response.json();
      setPrescription(data.prescription);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f0f9ff" }}>
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <Link href="/">
          <Button className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
              Access Your Prescription
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your prescription number to view complete details, doctor
              information, and download your prescription
            </p>
          </div>

          {/* Search Card */}
          <Card className="mb-8 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl py-8">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Search className="h-6 w-6" />
                </div>
                Search Prescription
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Prescription Number *
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your prescription number (e.g., RX-2026-001)"
                      value={prescriptionNumber}
                      onChange={(e) => setPrescriptionNumber(e.target.value)}
                      disabled={isLoading}
                      className="flex-1 h-12 text-base border-gray-300 focus:border-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {searched && error && (
            <div className="mb-8 p-4 rounded-lg border-l-4 border-red-500 bg-red-50 flex items-start gap-3 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Prescription Details */}
          {prescription && (
            <div className="space-y-6">
              {/* Header with Status */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-green-100 text-sm font-semibold mb-2">
                        Prescription Number
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        {prescription.prescriptionNumber}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-bold">
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Doctor Information Card */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                  <CardTitle className="text-purple-700 flex items-center gap-2">
                    <div className="bg-purple-600 text-white p-2 rounded-lg">
                      <User className="h-5 w-5" />
                    </div>
                    Prescribed Doctor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Name & Specialization */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-4">
                        {prescription.doctor.profileImage && (
                          <img
                            src={prescription.doctor.profileImage}
                            alt={prescription.doctor.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                          />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            Dr. {prescription.doctor.name}
                          </h3>
                          <p className="text-purple-600 font-semibold text-lg">
                            {prescription.doctor.specialization}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MailIcon className="h-5 w-5 text-blue-600" />
                        <p className="text-sm text-gray-600 font-semibold">
                          Email
                        </p>
                      </div>
                      <p className="text-gray-900 font-semibold break-all">
                        {prescription.doctor.email}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <PhoneIcon className="h-5 w-5 text-green-600" />
                        <p className="text-sm text-gray-600 font-semibold">
                          Phone
                        </p>
                      </div>
                      <p className="text-gray-900 font-semibold">
                        {prescription.doctor.phonenumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Information Card */}
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200">
                  <CardTitle className="text-cyan-700 flex items-center gap-2">
                    <div className="bg-cyan-600 text-white p-2 rounded-lg">
                      <User className="h-5 w-5" />
                    </div>
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">
                          Full Name
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {prescription.patient.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">
                          Age
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {prescription.patient.age || "N/A"} years
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">
                          Gender
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {prescription.patient.gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">
                          Patient Type
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {prescription.patient.isNewPatient
                            ? "New Patient"
                            : "Existing Patient"}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <MailIcon className="h-5 w-5 text-blue-600" />
                            <p className="text-sm text-gray-600 font-semibold">
                              Email
                            </p>
                          </div>
                          <p className="text-gray-900 font-semibold break-all text-sm">
                            {prescription.patient.email}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <PhoneIcon className="h-5 w-5 text-green-600" />
                            <p className="text-sm text-gray-600 font-semibold">
                              Phone
                            </p>
                          </div>
                          <p className="text-gray-900 font-semibold text-sm">
                            {prescription.patient.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Identification */}
                    {(prescription.patient.nic ||
                      prescription.patient.dateOfBirth) && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Identification
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {prescription.patient.nic && (
                            <div>
                              <p className="text-sm text-gray-500 font-semibold mb-1">
                                NIC Number
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {prescription.patient.nic}
                              </p>
                            </div>
                          )}
                          {prescription.patient.dateOfBirth && (
                            <div>
                              <p className="text-sm text-gray-500 font-semibold mb-1">
                                Date of Birth
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {new Date(
                                  prescription.patient.dateOfBirth,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {prescription.patient.emergencyContactName && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Emergency Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1">
                              Contact Name
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {prescription.patient.emergencyContactName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-1">
                              Contact Phone
                            </p>
                            <p className="text-gray-900 font-semibold">
                              {prescription.patient.emergencyContactPhone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical Information */}
                    {(prescription.patient.medicalHistory ||
                      prescription.patient.currentMedications ||
                      prescription.patient.allergies) && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Medical Information
                        </h4>
                        <div className="space-y-3">
                          {prescription.patient.medicalHistory && (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                Medical History
                              </p>
                              <p className="text-gray-900 text-sm">
                                {prescription.patient.medicalHistory}
                              </p>
                            </div>
                          )}
                          {prescription.patient.currentMedications && (
                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                Current Medications
                              </p>
                              <p className="text-gray-900 text-sm">
                                {prescription.patient.currentMedications}
                              </p>
                            </div>
                          )}
                          {prescription.patient.allergies && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <p className="text-sm text-gray-600 font-semibold mb-1">
                                Allergies
                              </p>
                              <p className="text-gray-900 text-sm">
                                {prescription.patient.allergies}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Insurance Information */}
                    {(prescription.patient.insuranceProvider ||
                      prescription.patient.insurancePolicyNumber) && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Insurance Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {prescription.patient.insuranceProvider && (
                            <div>
                              <p className="text-sm text-gray-500 font-semibold mb-1">
                                Insurance Provider
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {prescription.patient.insuranceProvider}
                              </p>
                            </div>
                          )}
                          {prescription.patient.insurancePolicyNumber && (
                            <div>
                              <p className="text-sm text-gray-500 font-semibold mb-1">
                                Policy Number
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {prescription.patient.insurancePolicyNumber}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Information */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                  <CardTitle className="text-orange-700 flex items-center gap-2">
                    <div className="bg-orange-600 text-white p-2 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    Appointment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Appointment Number
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {prescription.appointmentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Appointment Date
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(
                          prescription.appointmentDate,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Issued Date
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(prescription.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Last Updated
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(prescription.updatedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Content */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <CardTitle className="text-indigo-700 flex items-center gap-2">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    Prescription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div
                    className="prose prose-sm max-w-none bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg border-2 border-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: prescription.htmlContent,
                    }}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 pb-8">
                <Button
                  onClick={() => window.print()}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg flex items-center justify-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Download Prescription
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-base rounded-lg flex items-center justify-center gap-2"
                >
                  🖨️ Print
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {searched && !prescription && !error && (
            <Card className="shadow-lg border-0">
              <CardContent className="pt-16 pb-16 text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg font-semibold">
                  Enter a prescription number to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
