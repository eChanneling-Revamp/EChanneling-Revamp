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

interface Preferences {
  emailAppointmentReminders: boolean;
  emailSettlementUpdates: boolean;
  emailSystemUpdates: boolean;
  language: string;
  timezone: string;
}

export default function PreferencesTab() {
  const [preferences, setPreferences] = useState<Preferences>({
    emailAppointmentReminders: true,
    emailSettlementUpdates: true,
    emailSystemUpdates: false,
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
    // This is a placeholder for the actual save logic.
    alert("Preferences saved (simulation)!");
    console.log("Saving preferences:", preferences);
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Appointment Reminders</p>
              <p className="text-sm text-gray-500">
                Get notified about upcoming appointments.
              </p>
            </div>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.emailAppointmentReminders}
              onChange={() => handleToggle("emailAppointmentReminders")}
            />
            <div
              onClick={() => handleToggle("emailAppointmentReminders")}
              className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700 cursor-pointer"
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Settlement Updates</p>
              <p className="text-sm text-gray-500">
                Receive notifications about payment settlements.
              </p>
            </div>
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.emailSettlementUpdates}
              onChange={() => handleToggle("emailSettlementUpdates")}
            />
            <div
              onClick={() => handleToggle("emailSettlementUpdates")}
              className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-700 cursor-pointer"
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <CardTitle>Regional Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handleSelectChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Sinhala">Sinhala</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={preferences.timezone}
              onValueChange={(value) => handleSelectChange("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Colombo">
                  Asia/Colombo (GMT+5:30)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-700 hover:bg-blue-800">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}