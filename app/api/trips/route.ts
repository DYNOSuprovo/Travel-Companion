import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/trips - Get all trips for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    let query = supabase
      .from("trips")
      .select(`
        *,
        trip_companions(
          id,
          companion_user_id,
          status,
          profiles!trip_companions_companion_user_id_fkey(full_name)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: trips, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ trips })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { trip_number, origin, destination, transport_mode, start_time, end_time, distance_km } = body

    // Validate required fields
    if (!trip_number || !origin || !destination || !transport_mode || !start_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        trip_number,
        origin,
        destination,
        transport_mode,
        start_time,
        end_time,
        distance_km,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
