"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRealtimeTrips(userId: string) {
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    let isMounted = true

    const subscribeToTrips = async () => {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", userId)
          .order("start_time", { ascending: false })

        if (error) throw error
        if (isMounted) setTrips(data || [])

        const channel = supabase
          .channel(`trips:${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "trips",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              if (isMounted) {
                if (payload.eventType === "INSERT") {
                  setTrips((prev) => [payload.new, ...prev])
                } else if (payload.eventType === "UPDATE") {
                  setTrips((prev) => prev.map((trip) => (trip.id === payload.new.id ? payload.new : trip)))
                } else if (payload.eventType === "DELETE") {
                  setTrips((prev) => prev.filter((trip) => trip.id !== payload.old.id))
                }
              }
            },
          )
          .subscribe()

        if (isMounted) setIsLoading(false)
        return () => channel.unsubscribe()
      } catch (err) {
        console.error("[v0] Realtime subscription error:", err)
        if (isMounted) setIsLoading(false)
      }
    }

    subscribeToTrips()

    return () => {
      isMounted = false
    }
  }, [userId])

  return { trips, isLoading }
}
