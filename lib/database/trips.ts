"use server"

import { createClient } from "@/lib/supabase/server"

export interface Trip {
  id: string
  user_id: string
  trip_number: string
  origin: string
  destination: string
  transport_mode: string
  start_time: string
  end_time?: string
  distance_km?: number
  status: "active" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

export async function createTrip(data: {
  origin: string
  destination: string
  transport_mode: string
  distance_km?: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // Generate trip number
  const tripNumber = `TRIP-${Date.now()}`

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      trip_number: tripNumber,
      origin: data.origin,
      destination: data.destination,
      transport_mode: data.transport_mode,
      start_time: new Date().toISOString(),
      distance_km: data.distance_km || 0,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error
  return trip as Trip
}

export async function updateTrip(
  tripId: string,
  data: {
    end_time?: string
    distance_km?: number
    status?: "active" | "completed" | "cancelled"
  },
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("trips")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tripId)

  if (error) throw error
}

export async function getUserTrips() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) throw error
  return trips as Trip[]
}

export async function getTripStats() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: trips, error } = await supabase
    .from("trips")
    .select("distance_km, transport_mode")
    .eq("user_id", user.id)
    .eq("status", "completed")

  if (error) throw error

  const totalDistance = (trips as Trip[]).reduce((sum, trip) => sum + (trip.distance_km || 0), 0)
  const totalTrips = trips.length

  return {
    totalDistance: totalDistance.toFixed(1),
    totalTrips,
    averageSpeed: trips.length > 0 ? (totalDistance / trips.length).toFixed(1) : 0,
    carbonSaved: (totalDistance * 0.21).toFixed(1), // kg CO2 saved
  }
}
