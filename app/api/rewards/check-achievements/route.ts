import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: trips } = await supabase
      .from("trips")
      .select("distance_km, status")
      .eq("user_id", user.id)
      .eq("status", "completed")

    const totalDistance = trips?.reduce((sum, trip) => sum + (trip.distance_km || 0), 0) || 0
    const tripCount = trips?.length || 0

    const achievements = []

    // Check distance milestones
    if (totalDistance >= 1000) {
      achievements.push({
        type: "distance",
        name: "Thousand Miler",
        description: "Travelled over 1000 km",
        points: 500,
      })
    }

    if (totalDistance >= 100) {
      achievements.push({
        type: "distance",
        name: "Century Traveler",
        description: "Travelled over 100 km",
        points: 100,
      })
    }

    // Check trip count milestones
    if (tripCount >= 50) {
      achievements.push({
        type: "trips",
        name: "50 Trip Explorer",
        description: "Completed 50 trips",
        points: 250,
      })
    }

    if (tripCount >= 10) {
      achievements.push({
        type: "trips",
        name: "Frequent Traveler",
        description: "Completed 10 trips",
        points: 50,
      })
    }

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error("[v0] Achievement check error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
