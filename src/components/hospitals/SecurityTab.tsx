"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Smartphone,
  Monitor,
  Info,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const mockSessions = [
  {
    id: "current",
    location: "Colombo, Sri Lanka",
    device: "Chrome on Windows",
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: "previous-1",
    location: "Kandy, Sri Lanka",
    device: "Safari on iPhone",
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
];

export default function SecurityTab() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    // This functionality is disabled as per the UI message.
    alert("Password update functionality is currently disabled for demonstration.");
  };

  const handleLogoutAll = () => {
    alert("Logged out of all other devices (simulation).");
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Active Now";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <CardTitle>Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="max-w-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gray-600" />
            <CardTitle>Login Sessions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border ${
                  session.isCurrent
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{session.device}</p>
                    <p className="text-sm text-gray-600">{session.location}</p>
                  </div>
                  <div className="text-right">
                    {session.isCurrent ? (
                      <Badge className="bg-green-100 text-green-700">Active Now</Badge>
                    ) : (
                      <p className="text-sm text-gray-500">{formatLastActive(session.lastActive)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleLogoutAll}
            >
              Log Out All Other Devices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}