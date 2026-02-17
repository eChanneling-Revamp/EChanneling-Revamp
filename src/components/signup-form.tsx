"use client";

import type React from "react";
import { useState } from "react";
import { Activity, Lock, Mail, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    nic: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Registering user with data:", formData);

      // Validate NIC for doctors
      if (formData.role === "doctor" && !formData.nic) {
        setError("NIC is required for doctors");
        setIsLoading(false);
        return;
      }

      await axios.post("/api/auth/signup", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        nic: formData.nic || null,
      });

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          role: formData.role,
        }),
      );

      // Redirect to appropriate setup page based on role
      if (formData.role === "doctor") {
        router.push("/doctor-setup");
      } else if (formData.role === "hospital") {
        router.push("/hospital/setup");
      } else {
        // For other roles (patient, nurse), redirect to login or dashboard
        router.push("/login?registered=true");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle specific error codes
        if (error.response?.status === 409) {
          setError(
            "An account with this email already exists. Please login or use different credentials.",
          );
        } else {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              "Registration failed. Please try again.",
          );
        }
      } else {
        setError("An error occurred during registration");
      }
      console.error("Registration error:", error);
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
          Create Account
        </h1>
        <p className="text-base text-gray-600">
          Join eChanneling to access healthcare services
        </p>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Fields */}
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-11 pl-10 pr-12 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              I am a
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="w-full h-11 text-gray-900">
                <SelectValue
                  placeholder="Select your role"
                  className="text-gray-900"
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="patient" className="text-gray-900">
                  Patient
                </SelectItem>
                <SelectItem value="doctor" className="text-gray-900">
                  Doctor
                </SelectItem>
                <SelectItem value="nurse" className="text-gray-900">
                  Nurse
                </SelectItem>
                <SelectItem value="hospital" className="text-gray-900">
                  Hospital Administrator
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NIC Field - Only for Doctors */}
          {formData.role === "doctor" && (
            <div className="space-y-2">
              <label
                htmlFor="nic"
                className="block text-sm font-medium text-gray-700"
              >
                NIC (National ID Card)
              </label>
              <input
                id="nic"
                name="nic"
                type="text"
                placeholder="Enter your NIC number"
                value={formData.nic}
                onChange={handleChange}
                className="w-full h-11 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500">
                Your NIC is required to verify your medical credentials
              </p>
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="flex justify-center border-t border-gray-100 py-6">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
