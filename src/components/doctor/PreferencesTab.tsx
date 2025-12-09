"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, MessageSquare, Globe, Info } from "lucide-react";

// TODO: Future Implementation (after Prisma migration)
// 1. Add these fields to Doctor model in schema.prisma:
//    emailAppointmentReminders Boolean @default(true)
//    emailSettlementUpdates    Boolean @default(true)
//    emailSystemUpdates        Boolean @default(false)
//    smsAppointmentReminders   Boolean @default(true)
//    smsSettlementUpdates      Boolean @default(false)
//    language                  String  @default("English")
//    timezone                  String  @default("Asia/Colombo")
//
// 2. Create API endpoint: /api/doctor/preferences
//    - GET: Load preferences from database
//    - PATCH: Save preferences to database
//
// 3. In this component:
//    - Replace initial useState with useEffect to fetch from API
//    - Update handleSave to call API endpoint
//    - Enable Save button (remove disabled prop)
//    - Remove info message about mock data

interface Preferences {
  emailAppointmentReminders: boolean;
  emailSettlementUpdates: boolean;
  emailSystemUpdates: boolean;
  smsAppointmentReminders: boolean;
  smsSettlementUpdates: boolean;
  language: string;
  timezone: string;
}

export default function PreferencesTab() {
  // Mock data - will be replaced with API call in future
  const [preferences, setPreferences] = useState<Preferences>({
    emailAppointmentReminders: true,
    emailSettlementUpdates: true,
    emailSystemUpdates: false,
    smsAppointmentReminders: true,
    smsSettlementUpdates: false,
    language: "English",
    timezone: "Asia/Colombo",
  });

  const handleToggle = (field: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelectChange = (field: keyof Preferences, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Replace with API call when backend is ready
    // await axios.patch('/api/doctor/preferences', preferences);
    console.log("Preferences to save:", preferences);
  };

  return (
    <div className="space-y-6">
      {/* Info Message */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold">
            Note: This is a preview with sample data
          </p>
          <p className="mt-1">
            You can toggle preferences and change settings to preview the interface, but changes won't be saved yet. Database integration will be added when this feature is merged to the main branch.
          </p>
        </div>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Appointment Reminders */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0">
            <div className="flex-1">
              <Label className="text-base font-semibold">
                Appointment Reminders
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive email reminders before your scheduled appointments
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailAppointmentReminders}
                onChange={() => handleToggle("emailAppointmentReminders")}
                className="sr-only peer"
              />
              <div onClick={() => handleToggle("emailAppointmentReminders")} className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 cursor-pointer"></div>
            </div>
          </div>

          {/* Settlement Updates */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0">
            <div className="flex-1">
              <Label className="text-base font-semibold">
                Settlement Updates
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive email notifications about settlement status changes
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailSettlementUpdates}
                onChange={() => handleToggle("emailSettlementUpdates")}
                className="sr-only peer"
              />
              <div onClick={() => handleToggle("emailSettlementUpdates")} className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 cursor-pointer"></div>
            </div>
          </div>

          {/* System Updates */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
            <div className="flex-1">
              <Label className="text-base font-semibold">System Updates</Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive email notifications about system updates and maintenance
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailSystemUpdates}
                onChange={() => handleToggle("emailSystemUpdates")}
                className="sr-only peer"
              />
              <div onClick={() => handleToggle("emailSystemUpdates")} className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 cursor-pointer"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <CardTitle>SMS Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Appointment Reminders */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b last:border-0">
            <div className="flex-1">
              <Label className="text-base font-semibold">
                Appointment Reminders
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive SMS reminders before your scheduled appointments
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={preferences.smsAppointmentReminders}
                onChange={() => handleToggle("smsAppointmentReminders")}
                className="sr-only peer"
              />
              <div onClick={() => handleToggle("smsAppointmentReminders")} className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 cursor-pointer"></div>
            </div>
          </div>

          {/* Settlement Updates */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
            <div className="flex-1">
              <Label className="text-base font-semibold">
                Settlement Updates
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                Receive SMS notifications about settlement status changes
              </p>
            </div>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={preferences.smsSettlementUpdates}
                onChange={() => handleToggle("smsSettlementUpdates")}
                className="sr-only peer"
              />
              <div onClick={() => handleToggle("smsSettlementUpdates")} className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 cursor-pointer"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <CardTitle>Language & Region</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => handleSelectChange("language", value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Sinhala">Sinhala</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select
                value={preferences.timezone}
                onValueChange={(value) => handleSelectChange("timezone", value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Colombo">
                    Sri Lanka (GMT+5:30)
                  </SelectItem>
                  <SelectItem value="Asia/Kolkata">
                    India (GMT+5:30)
                  </SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (GMT+4:00)</SelectItem>
                  <SelectItem value="Europe/London">
                    London (GMT+0:00)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    New York (GMT-5:00)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-start">
        <Button
          onClick={handleSave}
          disabled
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
