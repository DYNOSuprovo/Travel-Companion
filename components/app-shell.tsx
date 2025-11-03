"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardScreen from "./screens/dashboard-screen"
import TripsScreen from "./screens/trips-screen"
import CompanionsScreen from "./screens/companions-screen"
import AnalyticsScreen from "./screens/analytics-screen"
import RewardsScreen from "./screens/rewards-screen"

interface AppShellProps {
  user: any
  onLogout: () => void
}

export default function AppShell({ user, onLogout }: AppShellProps) {
  const [currentScreen, setCurrentScreen] = useState("dashboard")
  const [userProfile, setUserProfile] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadUserProfile()
  }, [user])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") throw error
      setUserProfile(data)
    } catch (err) {
      console.error("[v0] Profile load error:", err)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      onLogout()
    } catch (err) {
      console.error("[v0] Logout error:", err)
    }
  }

  const screens: Record<string, any> = {
    dashboard: <DashboardScreen user={user} profile={userProfile} />,
    trips: <TripsScreen user={user} />,
    companions: <CompanionsScreen user={user} />,
    analytics: <AnalyticsScreen user={user} />,
    rewards: <RewardsScreen user={user} />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 px-5 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              ✈️
            </div>
            <h1 className="text-xl font-bold text-slate-900">Travel Companion</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 py-6 pb-24 max-w-7xl mx-auto w-full">
        {isLoadingProfile ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 text-sm">Loading...</p>
            </div>
          </div>
        ) : (
          screens[currentScreen] || screens.dashboard
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/80 border-t border-slate-200 flex justify-around py-3 shadow-2xl">
        {[
          { id: "dashboard", label: "Dashboard", icon: "🏠" },
          { id: "trips", label: "Trips", icon: "🚗" },
          { id: "companions", label: "Companions", icon: "👥" },
          { id: "analytics", label: "Analytics", icon: "📊" },
          { id: "rewards", label: "Rewards", icon: "🏆" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex-1 py-3 px-2 flex flex-col items-center gap-1.5 transition-all rounded-lg text-xs font-medium ${
              currentScreen === item.id ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <div className="text-2xl">{item.icon}</div>
            <div>{item.label}</div>
          </button>
        ))}
      </nav>
    </div>
  )
}
