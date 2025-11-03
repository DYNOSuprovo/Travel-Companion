"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface TripsScreenProps {
  user: any
}

export default function TripsScreen({ user }: TripsScreenProps) {
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTrips()
  }, [user])

  const loadTrips = async () => {
    try {
      setIsLoading(true)
      const { data, error: err } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })

      if (err) throw err
      setTrips(data || [])
    } catch (err: any) {
      console.error("[v0] Trips load error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const startTrip = async () => {
    try {
      const { error: err } = await supabase.from("trips").insert({
        user_id: user.id,
        trip_number: `TRIP-${Date.now()}`,
        origin: "Current Location",
        destination: "TBD",
        transport_mode: "car",
        start_time: new Date().toISOString(),
        status: "active",
        distance_km: 0,
      })

      if (err) throw err
      setIsTracking(true)
      await loadTrips()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Trip Tracking</h2>
        <p className="text-slate-600 text-sm">Monitor your active trips and view history</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

      <button
        onClick={startTrip}
        disabled={isTracking}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
      >
        {isTracking ? "Trip in Progress" : "Start New Trip"}
      </button>

      <div className="space-y-2">
        {trips.length > 0 ? (
          <div className="space-y-2">
            {trips.map((trip) => (
              <div key={trip.id} className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-slate-900">
                    {trip.origin} → {trip.destination}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                      trip.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>Mode: {trip.transport_mode}</div>
                  <div>Distance: {trip.distance_km} km</div>
                  <div>Date: {new Date(trip.start_time).toLocaleDateString()}</div>
                  <div>Time: {new Date(trip.start_time).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-sm bg-white/60 rounded-lg p-8 border border-slate-200 text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-slate-600 text-sm">No trips recorded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
