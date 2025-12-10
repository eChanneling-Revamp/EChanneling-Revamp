"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: number;
  country: string;
  type: "undergraduate" | "postgraduate" | "fellowship" | "certification";
}

// Mock data - will be replaced with real API data later
const mockQualifications: Qualification[] = [
  {
    id: "1",
    degree: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
    institution: "University of Colombo, Faculty of Medicine",
    year: 2015,
    country: "Sri Lanka",
    type: "undergraduate",
  },
  {
    id: "2",
    degree: "MD (Internal Medicine)",
    institution: "Post Graduate Institute of Medicine",
    year: 2020,
    country: "Sri Lanka",
    type: "postgraduate",
  },
  {
    id: "3",
    degree: "Fellowship in Obstetrics and Gynecology",
    institution: "Royal College of Obstetricians and Gynaecologists",
    year: 2022,
    country: "United Kingdom",
    type: "fellowship",
  },
];

const getTypeColor = (type: Qualification["type"]) => {
  switch (type) {
    case "undergraduate":
      return "bg-blue-100 text-blue-700";
    case "postgraduate":
      return "bg-purple-100 text-purple-700";
    case "fellowship":
      return "bg-green-100 text-green-700";
    case "certification":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getTypeLabel = (type: Qualification["type"]) => {
  switch (type) {
    case "undergraduate":
      return "Undergraduate";
    case "postgraduate":
      return "Postgraduate";
    case "fellowship":
      return "Fellowship";
    case "certification":
      return "Certification";
    default:
      return type;
  }
};

export default function QualificationsTab() {
  const [qualifications] = useState<Qualification[]>(mockQualifications);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Educational Qualifications
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your degrees, certifications, and professional qualifications
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      {/* Qualifications List */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {qualifications.length > 0 ? (
          qualifications.map((qual) => (
            <Card key={qual.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2 flex-wrap">
                      <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <CardTitle className="text-lg sm:text-xl leading-tight">
                        {qual.degree}
                      </CardTitle>
                    </div>
                    <Badge className={getTypeColor(qual.type)}>
                      {getTypeLabel(qual.type)}
                    </Badge>
                  </div>
                  <div className="flex gap-2 sm:shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700"
                    >
                      <Edit className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none bg-white border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700"
                    >
                      <Trash2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="break-words">{qual.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>Graduated in {qual.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{qual.country}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No qualifications added yet
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Add your educational qualifications to showcase your expertise
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Qualification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex gap-3">
          <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-1">
            <p className="font-medium">Note: This is a preview with sample data</p>
            <p className="text-blue-700">
              Database integration will be added when this feature is merged to the main branch.
              You can add, edit, and delete qualifications, but changes won't be saved yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
