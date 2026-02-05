"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserRole =
  | "admin"
  | "super_admin"
  | "doctor"
  | "hospital"
  | "nurse"
  | "patient"
  | "user"
  | "cashier";

interface UseRoleProtectionOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function useRoleProtection({
  allowedRoles,
  redirectTo,
}: UseRoleProtectionOptions) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userString = localStorage.getItem("user");

    if (!userString) {
      // No user data, redirect to login
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      const userRole = user.role?.toLowerCase() as UserRole;

      // Check if user's role is in the allowed roles
      const hasAccess = allowedRoles.some(
        (role) => role.toLowerCase() === userRole,
      );

      if (hasAccess) {
        setIsAuthorized(true);
      } else {
        // User doesn't have access, redirect to their dashboard
        const roleRedirects: Record<UserRole, string> = {
          admin: "/admin/dashboard",
          super_admin: "/admin/dashboard",
          doctor: "/doctor/dashboard",
          hospital: "/hospital/dashboard",
          nurse: "/user/dashboard",
          patient: "/user/dashboard",
          user: "/user/dashboard",
          cashier: "/cashier/dashboard",
        };

        const destination = redirectTo || roleRedirects[userRole] || "/login";
        router.push(destination);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return { isAuthorized, isLoading };
}
