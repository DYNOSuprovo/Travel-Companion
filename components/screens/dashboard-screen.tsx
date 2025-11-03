"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface DashboardScreenProps {
  user: any
  profile: any
}

export default function DashboardScreen({ user, profile }: DashboardScreenProps) {
  const [stats, setStats] = useState(null)
  const [recentTrips, setRecentTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      const { data: tripsData, error: tripsError } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })
        .limit(5)

      if (tripsError) throw tripsError

      const { data: rewardsData, error: rewardsError } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)

      if (rewardsError && rewardsError.code !== "PGRST116") throw rewardsError

      setRecentTrips(tripsData || [])

      const totalDistance = (tripsData || []).reduce((sum: number, trip: any) => sum + (trip.distance_km || 0), 0)
      const totalTrips = tripsData?.length || 0
      const avgSpeed = totalDistance > 0 ? ((totalDistance / totalTrips) * 0.8).toFixed(1) : 0
      const carbonSaved = (totalDistance * 0.12).toFixed(1)

      setStats({
        totalDistance: totalDistance.toFixed(1),
        totalTrips,
        averageSpeed: avgSpeed,
        carbonSaved,
      })
    } catch (err: any) {
      console.error("[v0] Dashboard load error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
        Error loading dashboard: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-slate-600 text-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Distance", value: stats.totalDistance, unit: "km", icon: "📍", color: "blue" },
            { label: "Trips", value: stats.totalTrips, unit: "journeys", icon: "🚗", color: "green" },
            { label: "Avg Speed", value: stats.averageSpeed, unit: "km/h", icon: "⚡", color: "orange" },
            { label: "Carbon Saved", value: stats.carbonSaved, unit: "kg CO2", icon: "🌱", color: "emerald" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/60 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-sm"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.unit}</div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold">Start a New Trip</h3>
            <p className="text-sm opacity-90">Track your next journey automatically</p>
          </div>
          <div className="text-4xl">🗺️</div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 text-lg">Recent Trips</h3>
        {recentTrips.length > 0 ? (
          <div className="space-y-2">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      {trip.origin} → {trip.destination}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {trip.transport_mode} • {trip.distance_km} km
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(trip.start_time).toLocaleDateString()}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      trip.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  >
                    {trip.status === "completed" ? "Completed" : "Active"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-sm bg-white/60 rounded-lg p-8 border border-slate-200 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-slate-600 text-sm">No trips yet. Start tracking to see your journeys!</p>
          </div>
        )}
      </div>
    </div>
  )
}
