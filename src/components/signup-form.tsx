"use client";

import type React from "react";
import { useState } from "react";
import {
  Activity,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import axios from "axios";
import { phoneNumber } from "better-auth/plugins";

// Use local API routes as proxy to external API
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nic: "",
    age: "",
    gender: "male",
    role: "patient",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      // Register user using external API via proxy
      const registerResponse = await axiosInstance.post(
        "/api/external-auth/register",
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          phone_number: formData.phoneNumber,
          nic: formData.nic,
          role: formData.role,
          age: parseInt(formData.age),
          gender: formData.gender,
        }
      );

      console.log("Registration successful:", registerResponse.data);

      // Send OTP after successful registration
      const otpResponse = await axiosInstance.post(
        "/api/external-auth/send-otp",
        {
          phone_number: formData.phoneNumber,
        }
      );

      console.log("OTP sent:", otpResponse.data);

      // Move to OTP verification step
      setStep("verify");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Handle specific error codes
        if (error.response?.status === 409) {
          setError(
            "An account with this email, phone number, or NIC already exists. Please login or use different credentials."
          );
        } else {
          setError(
            error.response?.data?.message ||
              error.response?.data?.error ||
              "Registration failed. Please try again."
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
      // Verify OTP using external API via proxy
      const response = await axiosInstance.post(
        "/api/external-auth/verify-otp",
        {
          phone_number: formData.phoneNumber,
          otp: otp,
        }
      );

      console.log("OTP verified:", response.data);

      // Verification successful, redirect to login
      router.push("/login?verified=true");
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
      const response = await axiosInstance.post("/api/external-auth/send-otp", {
        phone_number: formData.phoneNumber,
      });

      console.log("OTP resent:", response.data);
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

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="p-8 pb-6 space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Activity className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-balance">
          {step === "register" ? "Create Account" : "Verify Your Email"}
        </h1>
        <p className="text-base text-gray-600">
          {step === "register"
            ? "Join eChanneling to access healthcare services"
            : `We sent a 6-digit code to ${formData.email}`}
        </p>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full h-11 px-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+94771234567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* NIC Field */}
            <div className="space-y-2">
              <label
                htmlFor="nic"
                className="block text-sm font-medium text-gray-700"
              >
                NIC Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="nic"
                  name="nic"
                  type="text"
                  placeholder="200012345678"
                  value={formData.nic}
                  onChange={handleChange}
                  className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Age and Gender Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 text-base text-gray-900 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    required
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all appearance-none bg-white"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 text-center">
                Enter Verification Code
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
              {isLoading ? "Verifying..." : "Verify Email"}
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

            {/* Back to Register */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                disabled={isLoading}
              >
                ← Back to registration
              </button>
            </div>
          </form>
        )}
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
