"use client"

import { useState } from "react"

export function WelcomeScreen() {
  const [currentStep, setCurrentStep] = useState("welcome")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    otp: "",
    state: "",
    city: "",
    nationality: "",
    agreeToTerms: false,
    agreeToDataSharing: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendOTP = () => {
    console.log("Sending OTP to:", formData.phone)
    setCurrentStep("otp")
  }

  const handleVerifyOTP = () => {
    console.log("Verifying OTP:", formData.otp)
    setCurrentStep("profile")
  }

  const handleCompleteRegistration = () => {
    console.log("Registration completed:", formData)
    setCurrentStep("app")
  }

  if (currentStep === "app") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <div style={{ textAlign: "center", paddingTop: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Welcome to Travel Companion!</h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "32px" }}>Your journey tracking app is ready</p>
          <button
            onClick={() => setCurrentStep("welcome")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007AFF",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {currentStep === "welcome" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#007AFF",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "32px",
                }}
              >
                ✈️
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>Welcome to Travel Companion</h1>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Your intelligent travel companion for seamless journey tracking and personalized recommendations
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              {[
                { icon: "🔒", label: "Secure Tracking" },
                { icon: "👥", label: "Companion Management" },
                { icon: "📊", label: "Smart Analytics" },
                { icon: "🏆", label: "Rewards System" },
              ].map((feature) => (
                <div key={feature.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{feature.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: "500" }}>{feature.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep("auth")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#007AFF",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Get Started
            </button>
          </div>
        )}

        {currentStep === "auth" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Create Your Account</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Enter your details to get started with Travel Companion
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={!formData.email || !formData.phone}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: formData.email && formData.phone ? "#007AFF" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: formData.email && formData.phone ? "pointer" : "not-allowed",
              }}
            >
              Send OTP
            </button>
          </div>
        )}

        {currentStep === "otp" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Verify Your Phone</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Enter the 6-digit OTP sent to {formData.phone}
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                OTP Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => handleInputChange("otp", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "18px",
                  textAlign: "center",
                  letterSpacing: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={() => setCurrentStep("auth")}
                style={{
                  padding: "12px",
                  backgroundColor: "white",
                  color: "#007AFF",
                  border: "1px solid #007AFF",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={formData.otp.length !== 6}
                style={{
                  padding: "12px",
                  backgroundColor: formData.otp.length === 6 ? "#007AFF" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: formData.otp.length === 6 ? "pointer" : "not-allowed",
                }}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {currentStep === "profile" && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Complete Your Profile</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
              Help us personalize your travel experience
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                State
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select your state</option>
                <option value="kerala">Kerala</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>City</label>
              <input
                type="text"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                Nationality
              </label>
              <select
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select your nationality</option>
                <option value="indian">Indian</option>
                <option value="american">American</option>
                <option value="british">British</option>
                <option value="canadian">Canadian</option>
              </select>
            </div>

            <div style={{ marginBottom: "24px", paddingTop: "16px", borderTop: "1px solid #eee" }}>
              <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  style={{ marginTop: "2px" }}
                />
                <label htmlFor="terms" style={{ fontSize: "12px" }}>
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="data-sharing"
                  checked={formData.agreeToDataSharing}
                  onChange={(e) => handleInputChange("agreeToDataSharing", e.target.checked)}
                  style={{ marginTop: "2px" }}
                />
                <label htmlFor="data-sharing" style={{ fontSize: "12px" }}>
                  I consent to anonymized data sharing with NATPAC for research
                </label>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={() => setCurrentStep("otp")}
                style={{
                  padding: "12px",
                  backgroundColor: "white",
                  color: "#007AFF",
                  border: "1px solid #007AFF",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={handleCompleteRegistration}
                disabled={
                  !formData.state ||
                  !formData.city ||
                  !formData.nationality ||
                  !formData.agreeToTerms ||
                  !formData.agreeToDataSharing
                }
                style={{
                  padding: "12px",
                  backgroundColor:
                    formData.state &&
                    formData.city &&
                    formData.nationality &&
                    formData.agreeToTerms &&
                    formData.agreeToDataSharing
                      ? "#007AFF"
                      : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor:
                    formData.state &&
                    formData.city &&
                    formData.nationality &&
                    formData.agreeToTerms &&
                    formData.agreeToDataSharing
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
