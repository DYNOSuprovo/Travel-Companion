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
    const { trip_id, distance_km } = body

    if (!trip_id) {
      return NextResponse.json({ error: "Trip ID required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("trips")
      .update({
        status: "completed",
        end_time: new Date().toISOString(),
        distance_km: distance_km || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", trip_id)
      .eq("user_id", user.id)

    if (error) throw error

    // Award badge if distance milestone reached
    if (distance_km && distance_km > 100) {
      await supabase
        .from("user_rewards")
        .insert({
          user_id: user.id,
          badge_type: "distance",
          badge_name: "Century Traveler",
          description: "Completed a trip over 100 km",
          points: 100,
        })
        .select()
        .single()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Trip completion error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
