import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get("trip_id")

    let query = supabase
      .from("fitness_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    if (tripId) {
      query = query.eq("trip_id", tripId)
    }

    const { data: activities, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch fitness activities" }, { status: 500 })
    }

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Fitness activities API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { activity_type, duration_minutes, distance_km, calories_burned, location, date, trip_id } =
      await request.json()

    const { data: activity, error } = await supabase
      .from("fitness_activities")
      .insert({
        user_id: user.id,
        trip_id: trip_id || null,
        activity_type,
        duration_minutes,
        distance_km,
        calories_burned,
        location,
        date,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create fitness activity" }, { status: 500 })
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Create fitness activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
