"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export function LoginForm() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"normal" | "cashier">("normal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, loginType });
      let response;

      // Use different authentication based on loginType
      if (loginType === "cashier") {
        // Cashier login - use local authentication
        console.log("Attempting cashier login...");
        response = await axios.post("/api/auth/cashier-login", {
          email: email,
          password: password,
        });
        console.log("Cashier login successful");
      } else {
        // Normal login - use local JWT authentication
        console.log("Attempting local auth login...");
        response = await axios.post("/api/auth/login", {
          email: email,
          password: password,
        });
        console.log("Local auth successful");
      }

      console.log("Full API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response data keys:", Object.keys(response.data));

      // Check if response has expected structure
      if (!response.data) {
        throw new Error("No data received from login API");
      }

      // Store token and user data if provided
      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.access_token;
      const userData =
        response.data.user || response.data.data || response.data;

      console.log("Extracted token:", token ? "Found" : "Not found");
      console.log("Extracted user data:", userData);

      if (token) {
        localStorage.setItem("authToken", token);
        // Set cookie for middleware
        document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Lax`;
        console.log("✓ Token stored in localStorage and cookie");
      } else {
        console.warn("⚠ No token found in response");
      }

      if (userData && (userData.role || userData.email)) {
        localStorage.setItem("user", JSON.stringify(userData));
        // Set user cookie for middleware role checking
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/; max-age=86400; SameSite=Lax`;
        console.log("✓ User data stored in localStorage and cookie");
      } else {
        console.warn("⚠ No user data found in response");
      }

      // Navigate based on user role
      const userRole = userData?.role || response.data.role;
      const userEmail = userData?.email || email;

      console.log("User data for navigation:", userData);
      console.log("Extracted role:", userRole);
      console.log("Extracted email:", userEmail);
      let dashboardPath = "/dashboard";

      if (!userRole) {
        console.warn("⚠ No user role found, redirecting to generic dashboard");
      }

      if (userRole) {
        console.log("Processing role-based navigation for role:", userRole);
        switch (userRole.toLowerCase()) {
          case "admin":
          case "super_admin":
            dashboardPath = "/admin/dashboard";
            break;
          case "doctor":
            // Check if doctor profile exists in database
            try {
              const doctorCheckResponse = await axios.get(
                `/api/hospital/doctor?email=${userEmail}`,
              );
              if (doctorCheckResponse.data.data) {
                // Doctor profile exists, go to dashboard
                dashboardPath = "/doctor/dashboard";
              } else {
                // Doctor profile doesn't exist, needs to complete setup
                dashboardPath = "/doctor-setup";
              }
            } catch (error: any) {
              // 404 means doctor doesn't exist yet, redirect to setup
              if (error.response?.status === 404) {
                dashboardPath = "/doctor-setup";
              } else {
                console.error("Error checking doctor data:", error);
                dashboardPath = "/doctor/dashboard";
              }
            }
            break;
          case "hospital":
            // Check if hospital data exists
            try {
              const checkResponse = await axios.get(
                `/api/hospital/check?email=${userEmail}`,
              );
              if (checkResponse.data.exists) {
                dashboardPath = "/hospital/dashboard";
              } else {
                dashboardPath = "/hospital/setup";
              }
            } catch (error) {
              console.error("Error checking hospital data:", error);
              dashboardPath = "/hospital/setup";
            }
            break;
          case "nurse":
          case "patient":
          case "user":
            dashboardPath = "/user/dashboard";
            break;
          case "cashier":
            dashboardPath = "/cashier";
            break;
          default:
            dashboardPath = "/dashboard";
            break;
        }
      }

      console.log("=== Navigation Summary ===");
      console.log("Role:", userRole);
      console.log("Target path:", dashboardPath);
      console.log("Token stored:", !!localStorage.getItem("authToken"));
      console.log("User stored:", !!localStorage.getItem("user"));
      console.log("=========================");

      router.push(dashboardPath);
    } catch (error: any) {
      console.error("=== Login Error ===");
      console.error("Full error object:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error - Status:", error.response?.status);
        console.error("Axios error - Data:", error.response?.data);
        console.error("Axios error - Message:", error.message);

        // Extract error message from response
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Login failed";

        setError(errorMessage);
      } else if (error instanceof Error) {
        console.error("Standard Error:", error.message);
        console.error("Error stack:", error.stack);
        setError(error.message || "An error occurred during login");
      } else {
        console.error("Unknown error:", error);
        setError("An unexpected error occurred");
      }
      console.error("==================");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="p-8 pb-6 space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Activity className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-balance">
          Welcome to eChanneling
        </h1>
        <p className="text-base text-gray-600">
          Sign in to access your healthcare dashboard
        </p>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <>
          {/* Login Type Selection (Normal/Cashier) */}
          <div className="flex gap-3 p-1.5 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
            <button
              type="button"
              onClick={() => setLoginType("normal")}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                loginType === "normal"
                  ? "bg-white text-blue-600 shadow-md border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>👤</span>
                <span>Normal Login</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setLoginType("cashier")}
              className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                loginType === "cashier"
                  ? "bg-white text-green-600 shadow-md border border-green-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>💼</span>
                <span>Cashier Login</span>
              </div>
            </button>
          </div>

          {/* Info message for Cashier Login */}
          {loginType === "cashier" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                <span className="font-medium">Cashier Login:</span> Use your
                hospital-provided email and password
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email-password"
                className="block text-sm font-medium text-gray-700"
              >
                {loginType === "cashier" ? "Cashier Email" : "Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email-password"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-12 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </>
      </div>

      {/* Footer */}
      <div className="flex justify-center border-t border-gray-100 py-6">
        <p className="text-sm text-gray-600">
          {"Don't have an account? "}
          <a
            href="/signup"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
