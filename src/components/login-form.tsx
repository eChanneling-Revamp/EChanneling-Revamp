"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react";
import { Activity, Lock, User } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    const res = await signIn("credentials", {
          redirect: false, // important for getting JSON response
          username,
          password,
        });
    
        if (res?.error) {
          setError(res.error);
          alert("Login failed: " + res.error);
        } else {
          console.log("Login successful!", res);
          // You can redirect manually, e.g.
          window.location.href = "/dashboard";
        }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    // Simulate Google login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Google login initiated")

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* Header */}
      <div className="p-8 pb-6 space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Activity className="w-9 h-9 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 text-balance">Welcome to eChanneling</h1>
        <p className="text-base text-gray-600">Sign in to access your healthcare dashboard</p>
      </div>

      {/* Content */}
      <div className="px-8 pb-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full h-11 text-base font-semibold border-2 border-gray-300 hover:bg-gray-50 bg-white text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}

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
          <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
