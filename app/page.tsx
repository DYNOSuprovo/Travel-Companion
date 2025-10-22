"use client"

import { useState } from "react"

export default function Home() {
  const [currentStep, setCurrentStep] = useState("welcome")
  const [currentScreen, setCurrentScreen] = useState("dashboard")
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

  const [activeTrip, setActiveTrip] = useState(null)
  const [tripStats, setTripStats] = useState({
    totalDistance: 1247.5,
    totalTrips: 89,
    averageSpeed: 42.3,
    carbonSaved: 156.8,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendOTP = () => {
    if (formData.email && formData.phone) {
      setCurrentStep("otp")
    }
  }

  const handleVerifyOTP = () => {
    if (formData.otp.length === 6) {
      setCurrentStep("profile")
    }
  }

  const handleCompleteRegistration = () => {
    if (
      formData.state &&
      formData.city &&
      formData.nationality &&
      formData.agreeToTerms &&
      formData.agreeToDataSharing
    ) {
      setCurrentStep("app")
    }
  }

  if (currentStep === "app") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
        <header className="sticky top-0 z-50 glass-dark backdrop-blur-2xl border-b border-white/20 px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg animate-float">
              ✈️
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travel Companion
            </h1>
          </div>
          <button
            onClick={() => setCurrentStep("welcome")}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 ease-out"
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-5 py-6 pb-32">
          {currentScreen === "dashboard" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Good Morning, Traveler! 🌅
                </h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Total Distance",
                    value: tripStats.totalDistance.toFixed(1),
                    unit: "km",
                    gradient: "from-blue-400 to-blue-600",
                    icon: "📍",
                  },
                  {
                    label: "Total Trips",
                    value: tripStats.totalTrips,
                    unit: "journeys",
                    gradient: "from-green-400 to-emerald-600",
                    icon: "🚗",
                  },
                  {
                    label: "Avg Speed",
                    value: tripStats.averageSpeed.toFixed(1),
                    unit: "km/h",
                    gradient: "from-orange-400 to-red-600",
                    icon: "⚡",
                  },
                  {
                    label: "Carbon Saved",
                    value: tripStats.carbonSaved.toFixed(1),
                    unit: "kg CO2",
                    gradient: "from-cyan-400 to-blue-600",
                    icon: "🌱",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`glass rounded-2xl p-5 border border-white/30 hover:border-white/50 card-hover group`}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-all duration-300 ease-out`}
                    />
                    <div className="relative space-y-3">
                      <div className="text-3xl">{stat.icon}</div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.unit}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-3xl p-8 text-center text-white gradient-accent shadow-2xl">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float" />
                  <div
                    className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float"
                    style={{ animationDelay: "2s" }}
                  />
                </div>
                <div className="relative space-y-4">
                  <div className="text-6xl animate-bounce">🗺️</div>
                  <h3 className="text-2xl font-bold">Start Your Journey</h3>
                  <p className="text-sm opacity-90">Track your trip automatically or manually start a new adventure</p>
                  <button
                    onClick={() =>
                      setActiveTrip({ from: "Current Location", to: "", distance: 0, startTime: new Date() })
                    }
                    className="px-8 py-3 bg-white text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold rounded-full hover:scale-110 transition-all duration-300 ease-out inline-block"
                  >
                    Start New Trip
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-foreground">Recent Trips</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold hover:shadow-lg transition-all duration-300 ease-out">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { from: "Home", to: "Office", mode: "Car", distance: "12.5 km", time: "25 min", date: "Today" },
                    {
                      from: "Office",
                      to: "Mall",
                      mode: "Metro",
                      distance: "8.2 km",
                      time: "18 min",
                      date: "Yesterday",
                    },
                    {
                      from: "Home",
                      to: "Park",
                      mode: "Walking",
                      distance: "2.1 km",
                      time: "22 min",
                      date: "2 days ago",
                    },
                  ].map((trip, idx) => (
                    <div
                      key={idx}
                      className="glass rounded-xl p-4 border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 ease-out cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 ease-out">
                            {trip.from} → {trip.to}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {trip.mode} • {trip.distance} • {trip.time}
                          </div>
                          <div className="text-xs text-muted-foreground/60 mt-2">{trip.date}</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                          ✓ Completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScreen === "tracking" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trip Tracking
              </h2>
              <div className="glass rounded-2xl p-12 text-center border border-white/30">
                <div className="text-6xl mb-4 animate-bounce">📍</div>
                <p className="text-foreground font-medium">No active trips. Start tracking your journey!</p>
              </div>
            </div>
          )}

          {currentScreen === "companions" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Companions
              </h2>
              <div className="glass rounded-2xl p-12 text-center border border-white/30">
                <div className="text-6xl mb-4 animate-float">👥</div>
                <p className="text-foreground font-medium">No companions added yet. Invite friends to join!</p>
              </div>
            </div>
          )}

          {currentScreen === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics
              </h2>
              <div className="glass rounded-2xl p-12 text-center border border-white/30">
                <div className="text-6xl mb-4 animate-glow">📊</div>
                <p className="text-foreground font-medium">Your travel analytics will appear here</p>
              </div>
            </div>
          )}

          {currentScreen === "rewards" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Rewards
              </h2>
              <div className="glass rounded-2xl p-12 text-center border border-white/30">
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <p className="text-foreground font-medium">Earn rewards as you travel more!</p>
              </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 glass-dark backdrop-blur-2xl border-t border-white/20 flex justify-around py-3 shadow-2xl">
          {[
            { id: "dashboard", label: "Dashboard", icon: "🏠" },
            { id: "tracking", label: "Tracking", icon: "📍" },
            { id: "companions", label: "Companions", icon: "👥" },
            { id: "analytics", label: "Analytics", icon: "📊" },
            { id: "rewards", label: "Rewards", icon: "🏆" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1.5 transition-all duration-300 ease-out rounded-xl mx-1 ${
                currentScreen === item.id
                  ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-blue-600 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </button>
          ))}
        </nav>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {currentStep === "welcome" && (
          <div className="glass rounded-3xl p-8 border border-white/40 shadow-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 gradient-primary rounded-full mx-auto flex items-center justify-center text-5xl animate-float shadow-lg shadow-blue-500/50">
                ✈️
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to Travel Companion
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your intelligent travel companion for seamless journey tracking and personalized recommendations
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔒", label: "Secure Tracking" },
                { icon: "👥", label: "Companion Management" },
                { icon: "📊", label: "Smart Analytics" },
                { icon: "🏆", label: "Rewards System" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="glass rounded-xl p-4 border border-white/20 text-center hover:border-white/40 hover:bg-white/20 transition-all duration-300 ease-out"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-xs font-semibold text-foreground">{feature.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep("auth")}
              className="w-full py-3 gradient-primary text-white rounded-full font-semibold btn-glow"
            >
              Get Started
            </button>
          </div>
        )}

        {currentStep === "auth" && (
          <div className="glass rounded-3xl p-8 border border-white/40 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </h2>
              <p className="text-sm text-muted-foreground">Enter your details to get started with Travel Companion</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-sm bg-white/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-sm bg-white/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={!formData.email || !formData.phone}
              className="w-full py-3 gradient-primary text-white rounded-full font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send OTP
            </button>
          </div>
        )}

        {currentStep === "otp" && (
          <div className="glass rounded-3xl p-8 border border-white/40 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verify Your Phone
              </h2>
              <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to {formData.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">OTP Code</label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={formData.otp}
                onChange={(e) => handleInputChange("otp", e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-lg text-center tracking-widest bg-white/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentStep("auth")}
                className="py-3 glass rounded-full font-semibold border border-white/30 text-foreground hover:bg-white/20 transition-all duration-300 ease-out"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={formData.otp.length !== 6}
                className="py-3 gradient-primary text-white rounded-full font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {currentStep === "profile" && (
          <div className="glass rounded-3xl p-8 border border-white/40 shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Complete Your Profile
              </h2>
              <p className="text-sm text-muted-foreground">Help us personalize your travel experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-sm bg-white/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                >
                  <option value="">Select your state</option>
                  <option value="kerala">Kerala</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-sm bg-white/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nationality</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/30 text-sm bg-white/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                >
                  <option value="">Select your nationality</option>
                  <option value="indian">Indian</option>
                  <option value="american">American</option>
                  <option value="british">British</option>
                  <option value="canadian">Canadian</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-blue-600"
                />
                <label htmlFor="terms" className="text-xs text-foreground leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  id="data-sharing"
                  checked={formData.agreeToDataSharing}
                  onChange={(e) => handleInputChange("agreeToDataSharing", e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-blue-600"
                />
                <label htmlFor="data-sharing" className="text-xs text-foreground leading-relaxed">
                  I consent to anonymized data sharing with NATPAC for research
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentStep("otp")}
                className="py-3 glass rounded-full font-semibold border border-white/30 text-foreground hover:bg-white/20 transition-all duration-300 ease-out"
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
                className="py-3 gradient-primary text-white rounded-full font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
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
