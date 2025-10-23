"use client";

import { useState } from "react";
import ProfileTabs from "@/app/profile/ProfileTabs";

export default function PreferencesPage() {
    const [emailNotifications, setEmailNotifications] = useState({
        appointmentReminders: true,
        settlementUpdates: true,
        systemUpdates: false,
    });

    const [smsNotifications, setSmsNotifications] = useState({
        appointmentReminders: true,
        settlementUpdates: false,
    });

    const [language, setLanguage] = useState("English");
    const [timeZone, setTimeZone] = useState("Sri Lanka (GMT+5:30)");

    const handleSavePreferences = () => {
        alert("Preferences saved successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-black text-xl font-bold mb-6">My Profile</h1>

            {/* ✅ Tabs imported from component */}
            <ProfileTabs />

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-black text-lg font-semibold mb-6">
                    Notification Preferences
                </h2>

                {/* Email Notifications */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-black text-base font-semibold mb-4">
                        Email Notifications
                    </h3>

                    <div className="space-y-4">
                        {/* Appointment Reminders */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Appointment Reminders
                                </p>
                                <p className="text-xs text-gray-600">
                                    Receive email reminders before your scheduled appointments
                                </p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications.appointmentReminders}
                                        onChange={(e) =>
                                            setEmailNotifications({
                                                ...emailNotifications,
                                                appointmentReminders: e.target.checked,
                                            })
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition ${
                                            emailNotifications.appointmentReminders
                                                ? "bg-blue-800"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                            emailNotifications.appointmentReminders
                                                ? "translate-x-5"
                                                : ""
                                        }`}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* Settlement Updates */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Settlement Updates
                                </p>
                                <p className="text-xs text-gray-600">
                                    Receive email notifications about settlement status changes
                                </p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications.settlementUpdates}
                                        onChange={(e) =>
                                            setEmailNotifications({
                                                ...emailNotifications,
                                                settlementUpdates: e.target.checked,
                                            })
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition ${
                                            emailNotifications.settlementUpdates
                                                ? "bg-blue-800"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                            emailNotifications.settlementUpdates ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* System Updates */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    System Updates
                                </p>
                                <p className="text-xs text-gray-600">
                                    Receive email notifications about system updates and
                                    maintenance
                                </p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications.systemUpdates}
                                        onChange={(e) =>
                                            setEmailNotifications({
                                                ...emailNotifications,
                                                systemUpdates: e.target.checked,
                                            })
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition ${
                                            emailNotifications.systemUpdates
                                                ? "bg-blue-800"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                            emailNotifications.systemUpdates ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* SMS Notifications */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-black text-base font-semibold mb-4">
                        SMS Notifications
                    </h3>

                    <div className="space-y-4">
                        {/* Appointment Reminders */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Appointment Reminders
                                </p>
                                <p className="text-xs text-gray-600">
                                    Receive SMS reminders before your scheduled appointments
                                </p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={smsNotifications.appointmentReminders}
                                        onChange={(e) =>
                                            setSmsNotifications({
                                                ...smsNotifications,
                                                appointmentReminders: e.target.checked,
                                            })
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition ${
                                            smsNotifications.appointmentReminders
                                                ? "bg-blue-800"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                            smsNotifications.appointmentReminders ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* Settlement Updates */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Settlement Updates
                                </p>
                                <p className="text-xs text-gray-600">
                                    Receive SMS notifications about settlement status changes
                                </p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={smsNotifications.settlementUpdates}
                                        onChange={(e) =>
                                            setSmsNotifications({
                                                ...smsNotifications,
                                                settlementUpdates: e.target.checked,
                                            })
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-11 h-6 rounded-full transition ${
                                            smsNotifications.settlementUpdates
                                                ? "bg-blue-800"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform ${
                                            smsNotifications.settlementUpdates ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Language & Region */}
                <div>
                    <h3 className="text-black text-base font-semibold mb-4">
                        Language & Region
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option>English</option>
                                <option>Sinhala</option>
                                <option>Tamil</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Zone
                            </label>
                            <select
                                value={timeZone}
                                onChange={(e) => setTimeZone(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option>Sri Lanka (GMT+5:30)</option>
                                <option>India (GMT+5:30)</option>
                                <option>UAE (GMT+4:00)</option>
                                <option>Singapore (GMT+8:00)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-start">
                <button
                    onClick={handleSavePreferences}
                    className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition"
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
