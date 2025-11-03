"use client"

import { useState, useEffect } from "react"
import { useCallback } from "react"

export interface Trip {
  id: string
  trip_number: string
  origin: string
  destination: string
  transport_mode: string
  distance_km: number
  status: "active" | "completed" | "cancelled"
  start_time: string
  end_time?: string
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trips")
      if (!response.ok) throw new Error("Failed to fetch trips")
      const data = await response.json()
      setTrips(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrip = useCallback(
    async (tripData: {
      origin: string
      destination: string
      transport_mode: string
    }) => {
      try {
        const response = await fetch("/api/trips/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tripData),
        })
        if (!response.ok) throw new Error("Failed to create trip")
        const newTrip = await response.json()
        setTrips([newTrip, ...trips])
        return newTrip
      } catch (err) {
        throw err instanceof Error ? err : new Error("Unknown error")
      }
    },
    [trips],
  )

  const completeTrip = useCallback(
    async (tripId: string, distance_km: number) => {
      try {
        const response = await fetch("/api/trips/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trip_id: tripId, distance_km }),
        })
        if (!response.ok) throw new Error("Failed to complete trip")

        setTrips(
          trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  status: "completed" as const,
                  distance_km,
                  end_time: new Date().toISOString(),
                }
              : trip,
          ),
        )
      } catch (err) {
        throw err instanceof Error ? err : new Error("Unknown error")
      }
    },
    [trips],
  )

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  return {
    trips,
    loading,
    error,
    createTrip,
    completeTrip,
    refetch: fetchTrips,
  }
}
