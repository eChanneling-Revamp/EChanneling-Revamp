"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileTabs() {
    const pathname = usePathname();

    const tabs = [
        { name: "Profile", path: "/profile" },
        { name: "Security", path: "/profile/security" },
        { name: "Preferences", path: "/profile/preferences" },
    ];

    return (
        <div className="border-b border-gray-200 mb-6">
            <ul className="flex gap-8 text-sm font-medium">
                {tabs.map((tab) => {
                    const active = pathname === tab.path;
                    return (
                        <li key={tab.name} className="relative pb-2">
                            <Link
                                href={tab.path}
                                className={`${
                                    active
                                        ? "text-blue-700"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.name}
                            </Link>

                            {/* Blue underline for active tab */}
                            {active && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-700 rounded-full" />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
