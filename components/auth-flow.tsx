"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AuthFlowProps {
  onAuthSuccess: (user: any) => void
  onGuestLogin: () => void
}

export default function AuthFlow({ onAuthSuccess, onGuestLogin }: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState("welcome")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    state: "",
    city: "",
    nationality: "",
    agreeToTerms: false,
  })
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            state: formData.state,
            city: formData.city,
            nationality: formData.nationality,
          },
        },
      })

      if (signUpError) throw signUpError
      setCurrentStep("check-email")
    } catch (err: any) {
      setError(err.message || "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please enter email and password")
      return
    }

    setIsLoading(true)
    try {
      const {
        data: { user },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError
      if (user) onAuthSuccess(user)
    } catch (err: any) {
      setError(err.message || "Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-xl border border-white/40">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                  ✈️
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Travel Companion</h1>
                <p className="text-sm text-slate-600">Track your journeys, earn rewards, travel smarter</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🗺️</div>
                  <div className="text-xs font-medium text-slate-600">GPS Tracking</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">👥</div>
                  <div className="text-xs font-medium text-slate-600">Companions</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">📊</div>
                  <div className="text-xs font-medium text-slate-600">Analytics</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-slate-600">Rewards</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setCurrentStep("sign-up")}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Create Account
                </button>
                <button
                  onClick={() => setCurrentStep("sign-in")}
                  className="w-full py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onGuestLogin}
                  className="w-full py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow text-sm"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "sign-up") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-xl border border-white/40">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Account</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select State</option>
                <option value="kerala">Kerala</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="maharashtra">Maharashtra</option>
              </select>

              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Nationality</option>
                <option value="indian">Indian</option>
                <option value="american">American</option>
                <option value="british">British</option>
                <option value="canadian">Canadian</option>
              </select>

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="rounded"
                />
                <span className="text-slate-600">I agree to Terms of Service</span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <button
              onClick={() => setCurrentStep("welcome")}
              className="w-full mt-3 py-2.5 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "sign-in") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-xl border border-white/40">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign In</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <button
              onClick={() => setCurrentStep("welcome")}
              className="w-full mt-3 py-2.5 text-slate-600 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-sm"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "check-email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-8 shadow-xl border border-white/40 space-y-6">
            <div className="text-4xl">📧</div>
            <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
            <p className="text-slate-600 text-sm">
              We've sent a confirmation link to {formData.email}. Please verify your email to complete sign up.
            </p>

            <button
              onClick={() => setCurrentStep("welcome")}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
