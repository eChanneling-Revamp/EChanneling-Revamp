"use client";
import React from "react";
import { FiBell } from "react-icons/fi";

export default function Topbar() {
    return (
        <header className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-400 shadow-sm px-6 py-3 flex items-center justify-between">
            <div className="text-2xl font-semibold text-white">SLT MOBITEL E-channeling Platform</div>
            <div className="flex items-center gap-4 text-white ">

                <button className="p-2 rounded-full hover:bg-gray-100">
                    <FiBell size={23} />
                </button>

                <select className=" rounded px-3 py-1 bg-blue-800">
                    <option>Platform Admin</option>
                    <option>Hospital Admin</option>
                    <option>Doctor</option>
                    <option>Patient</option>
                </select>


                <div className="flex items-center gap-2">
                    <div className="rounded-full w-8 h-8 bg-white text-blue-600 flex items-center justify-center font-bold">U</div>
                    <div className="text-sm">User</div>
                </div>
            </div>
        </header>
    );
}
