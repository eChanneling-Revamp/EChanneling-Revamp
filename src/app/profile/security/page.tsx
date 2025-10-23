"use client";

import { useState } from "react";
import ProfileTabs from "@/app/profile/ProfileTabs";

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleLogoutAllDevices = () => {
        if (confirm("Are you sure you want to log out all other devices?")) {
            alert("Logged out from all other devices!");
        }
    };

    return (

        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-black text-xl font-bold mb-6">My Profile</h1>

            {/* ✅ Tabs imported from component */}
            <ProfileTabs />

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-black text-lg font-semibold mb-6">Security Settings</h2>

                {/* Change Password Section */}
                <div className="mb-8">
                    <h3 className="text-black text-base font-semibold mb-4">Change Password</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="········"
                            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="········"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="········"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition text-sm"
                    >
                        Update Password
                    </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-black text-base font-semibold mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-1">
                        Enhance your account security by enabling two-factor authentication.
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        You'll receive a verification code on your phone each time you sign in.
                    </p>

                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={twoFactorEnabled}
                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-11 h-6 rounded-full transition ${
                                twoFactorEnabled ? 'bg-blue-800' : 'bg-gray-300'
                            }`}></div>
                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                twoFactorEnabled ? 'translate-x-5' : ''
                            }`}></div>
                        </div>
                    </label>
                </div>

                {/* Login Sessions */}
                <div>
                    <h3 className="text-black text-base font-semibold mb-4">Login Sessions</h3>

                    {/* Current Session */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Current Session</p>
                                <p className="text-xs text-gray-600">Colombo, Sri Lanka • Chrome on Windows</p>
                            </div>
                            <span className="text-xs text-green-700 font-medium">Active Now</span>
                        </div>
                    </div>

                    {/* Previous Session */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Previous Session</p>
                                <p className="text-xs text-gray-600">Colombo, Sri Lanka • Safari on iPhone</p>
                            </div>
                            <span className="text-xs text-gray-600">2 days ago</span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogoutAllDevices}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition text-sm border border-red-200"
                    >
                        Log Out All Other Devices
                    </button>
                </div>
            </div>
        </div>
    );
}