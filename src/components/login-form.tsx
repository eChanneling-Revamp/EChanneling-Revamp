"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, Eye, EyeOff, PhoneCallIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";

const API_BASE_URL = "https://dpdlab1.slt.lk:8645/auth/api";

export function LoginForm() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [step, setStep] = useState<"login" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log(email, password, "URL:", API_BASE_URL);
      if (loginMethod === "password") {
        // Use external API for password login
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: email, // API expects email field
          password: password,
        });

        console.log("Login successful!", response.data);

        // Store token and user data if provided
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          // Set cookie for middleware
          document.cookie = `authToken=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
        }
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          // Set user cookie for middleware role checking
          document.cookie = `user=${encodeURIComponent(
            JSON.stringify(response.data.user)
          )}; path=/; max-age=86400; SameSite=Lax`;
        }

        // Navigate based on user role
        const userRole = response.data.user?.role || response.data.role;
        console.log("User role:", userRole);
        let dashboardPath = "/dashboard";

        if (userRole) {
          switch (userRole.toLowerCase()) {
            case "admin":
            case "super_admin":
              dashboardPath = "/admin/dashboard";
              break;
            case "doctor":
              dashboardPath = "/doctor/dashboard";
              break;
            case "hospital":
              dashboardPath = "/hospital/dashboard";
              break;
            case "nurse":
            case "patient":
            case "user":
              dashboardPath = "/user/dashboard";
              break;
            default:
              dashboardPath = "/dashboard";
              break;
          }
        }

        console.log("Navigating to:", dashboardPath);
        router.push(dashboardPath);
      } else {
        // Send OTP to phone number
        await axios.post(`${API_BASE_URL}/auth/send-otp`, {
          phone_number: phoneNumber,
        });

        setStep("verify");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Login failed"
        );
      } else {
        setError("An error occurred during login");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phone_number: phoneNumber,
        otp: otp,
      });

      console.log("OTP Login successful:", response.data);

      // Store token and user data if provided
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        // Set cookie for middleware
        document.cookie = `authToken=${response.data.token}; path=/; max-age=86400; SameSite=Lax`;
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Set user cookie for middleware role checking
        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(response.data.user)
        )}; path=/; max-age=86400; SameSite=Lax`;
      }

      // Navigate based on user role
      const userRole = response.data.user?.role || response.data.role;
      console.log("User role:", userRole);
      let dashboardPath = "/dashboard";

      if (userRole) {
        switch (userRole.toLowerCase()) {
          case "admin":
          case "super_admin":
            dashboardPath = "/admin/dashboard";
            break;
          case "doctor":
            dashboardPath = "/doctor/dashboard";
            break;
          case "hospital":
            dashboardPath = "/hospital/dashboard";
            break;
          case "nurse":
          case "patient":
          case "user":
            dashboardPath = "/user/dashboard";
            break;
          default:
            dashboardPath = "/dashboard";
            break;
        }
      }

      console.log("Navigating to:", dashboardPath);
      router.push(dashboardPath);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "OTP verification failed"
        );
      } else {
        setError("An error occurred during verification");
      }
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone_number: phoneNumber,
      });

      alert("OTP resent successfully!");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to resend OTP"
        );
      } else {
        setError("An error occurred while resending OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    // Simulate Google login
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Google login initiated");

    setIsLoading(false);
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

        {step === "login" ? (
          <>
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  loginMethod === "password"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("otp")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  loginMethod === "otp"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                OTP
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === "password" ? (
                <>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
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
                </>
              ) : (
                <>
                  {/* Phone Number Field for OTP */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneCallIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading
                  ? loginMethod === "password"
                    ? "Signing in..."
                    : "Sending OTP..."
                  : loginMethod === "password"
                  ? "Sign In"
                  : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Enter the code sent to {phoneNumber}
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Didn't receive the code? Resend
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                disabled={isLoading}
              >
                ← Back to login
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full h-11 text-base font-semibold border-2 border-gray-300 hover:bg-gray-50 bg-white text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading}
          onClick={async () => {
            try {
              // Get Google OAuth URL from external API
              const response = await axios.get(`${API_BASE_URL}/google/url`);
              if (response.data.url) {
                window.location.href = response.data.url;
              }
            } catch (error) {
              console.error("Google login error:", error);
              setError("Failed to initiate Google login");
            }
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
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
