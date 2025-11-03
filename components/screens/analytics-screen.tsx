"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface AnalyticsScreenProps {
  user: any
}

export default function AnalyticsScreen({ user }: AnalyticsScreenProps) {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [user])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const { data, error: err } = await supabase.from("trips").select("*").eq("user_id", user.id)

      if (err) throw err

      const trips = data || []
      const transportModes = {} as Record<string, number>
      let totalDistance = 0

      trips.forEach((trip: any) => {
        totalDistance += trip.distance_km || 0
        transportModes[trip.transport_mode] = (transportModes[trip.transport_mode] || 0) + 1
      })

      setAnalytics({
        totalTrips: trips.length,
        totalDistance,
        transportModes,
        avgDistancePerTrip: trips.length > 0 ? (totalDistance / trips.length).toFixed(1) : 0,
      })
    } catch (err: any) {
      console.error("[v0] Analytics load error:", err)
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
          <p className="text-slate-600 text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>
        <p className="text-slate-600 text-sm">Analyze your travel patterns and statistics</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

      {analytics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalTrips}</div>
              <div className="text-xs text-slate-600 mt-1">Total Trips</div>
            </div>
            <div className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.totalDistance.toFixed(1)}</div>
              <div className="text-xs text-slate-600 mt-1">km</div>
            </div>
            <div className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.avgDistancePerTrip}</div>
              <div className="text-xs text-slate-600 mt-1">Avg/Trip</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">Transport Modes</h3>
            <div className="space-y-2">
              {Object.entries(analytics.transportModes).map(([mode, count]) => (
                <div key={mode} className="backdrop-blur-sm bg-white/60 rounded-lg p-3 border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium text-slate-900 capitalize">{mode}</div>
                    <div className="font-bold text-blue-600">{count}</div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalTrips) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
