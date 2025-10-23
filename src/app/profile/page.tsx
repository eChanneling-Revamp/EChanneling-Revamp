"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import ProfileTabs from "./ProfileTabs";

export default function ProfilePage() {
    const [user, setUser] = useState({
        firstName: "Saman",
        lastName: "Perera",
        email: "saman.perera@gmail.com",
        phone: "+94 71 234 5678",
        address: "123 Main Street, Colombo 05",
    });

    const [photo, setPhoto] = useState<string | null>(null);
    const initial = "P";

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => setPhoto(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = () => {
        alert("Changes saved!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-black text-xl font-bold mb-6">My Profile</h1>


            {/* ✅ Tabs imported from component */}
            <ProfileTabs />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Photo Card */}
                <div className="text-black bg-white rounded-lg shadow-md p-2 w-full lg:w-1/3 h-1/3">
                    <h2 className="  border-b p-2 border-gray-200 text-base font-semibold mb-4">Profile Photo</h2>
                    <div className="flex flex-col items-center">
                        {photo ? (
                            <img
                                src={photo}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover bg-blue-800"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-blue-800 text-white flex items-center justify-center text-4xl font-semibold">
                                {initial}
                            </div>
                        )}
                        <label
                            htmlFor="photo-upload"
                            className="mt-4 bg-blue-800 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-900 transition"
                        >
                            Change Photo
                        </label>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Personal Information Form */}
                <div className=" bg-white rounded-lg shadow-md p-2 flex-1">
                    <h2 className="border-b p-2 border-gray-200 text-black text-base font-semibold mb-4">Personal Information</h2>

                    <div className="text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                value={user.firstName}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                className=" text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                value={user.lastName}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                className="text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <div className="flex items-center gap-2">
                                <Mail className="text-gray-500" size={18} />
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="text-gray-800 flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <div className="flex items-center gap-2">
                                <Phone className="text-gray-500" size={18} />
                                <input
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    className="text-gray-800 flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div >
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-gray-500" size={18} />
                                <input
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    className="text-gray-800 flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
