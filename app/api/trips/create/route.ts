import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { origin, destination, transport_mode, distance_km } = body

    if (!origin || !destination || !transport_mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const tripNumber = `TRIP-${Date.now()}`

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        trip_number: tripNumber,
        origin,
        destination,
        transport_mode,
        start_time: new Date().toISOString(),
        distance_km: distance_km || 0,
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(trip)
  } catch (error) {
    console.error("[v0] Trip creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
