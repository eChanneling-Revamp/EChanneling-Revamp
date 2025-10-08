"use client";
import React, { useState } from "react";
import { FiHome, FiUsers, FiCalendar, FiFileText, FiUser } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const items = [
        { label: "Hospital Dashboard", href: "/", icon: <FiHome /> },
        { label: "Our Hospital Profile", href: "/profile", icon: <FiFileText /> },
        { label: "Our Medical Staff", href: "/staff", icon: <FiUsers /> },
        { label: "Doctor Sessions", href: "/sessions", icon: <FiCalendar /> },
        { label: "Doctor Settlements", href: "/settlements", icon: <FiFileText /> },
        { label: "My Profile", href: "/me", icon: <FiUser /> },
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen p-4">
            {/* Header Section */}
            <div className="mb-6 flex items-center gap-3 ">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">logo</div>
                <div>
                    <div className="font-bold">SLT MOBITEL</div>
                    <div className="text-xs opacity-80">E-channeling</div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="space-y-2">
                {items.map((it) => {
                    const isActive = pathname === it.href;
                    return (
                        <Link
                            key={it.label}
                            href={it.href}
                            className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 
                                ${isActive
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-white/15 hover:text-blue-100"
                                }`}
                        >
                            <div className="text-lg">{it.icon}</div>
                            <div className="text-sm">{it.label}</div>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

