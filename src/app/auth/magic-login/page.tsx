"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMagicLinkToken } from "@/lib/jwt";
import axios from "axios";

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token");
      return;
    }

    handleMagicLogin(token);
  }, [searchParams]);

  const handleMagicLogin = async (token: string) => {
    try {
      // Call API to verify token and log in user
      const response = await axios.post("/api/auth/magic-login", { token });

      if (response.data.success) {
        setStatus("success");
        setMessage("Login successful! Redirecting to setup...");

        // Clear all previous session data first
        localStorage.clear();

        // Store user data and hospital info
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          console.log("Magic login - User data stored:", response.data.user);
        }

        if (response.data.hospitalInfo) {
          localStorage.setItem(
            "hospitalInfo",
            JSON.stringify(response.data.hospitalInfo)
          );
        }

        // Store form pre-fill data (name and phone number)
        if (response.data.user.name || response.data.user.phoneNumber) {
          localStorage.setItem(
            "userFormData",
            JSON.stringify({
              name: response.data.user.name,
              phoneNumber: response.data.user.phoneNumber,
              createdByHospital: response.data.user.createdByHospital || false,
            })
          );
        }

        // Redirect based on role
        setTimeout(() => {
          const userRole = response.data.user.role?.toLowerCase();
          console.log("Redirecting user with role:", userRole);

          if (userRole === "doctor") {
            router.push("/doctor-setup");
          } else if (userRole === "nurse") {
            router.push("/nurse-setup");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        setStatus("error");
        setMessage(response.data.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Magic login error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.error || "An error occurred during login"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Account
            </h1>
            <p className="text-gray-600">Please wait while we log you in...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to eChanneling!
            </h1>
            <p className="text-green-600 font-medium">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Login Failed
            </h1>
            <p className="text-red-600 mb-6">{message}</p>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Go to Login Page
            </button>
          </>
        )}
      </div>
    </div>
  );
}
