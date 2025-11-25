// filepath: src/app/user/dashboard/page.tsx
"use client";

import { useRoleProtection } from "@/hooks/useRoleProtection";

export default function UserDashboard() {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ["user", "patient", "nurse"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Home</h1>
      <p className="text-gray-700">Welcome to your patient dashboard.</p>
    </div>
  );
}
