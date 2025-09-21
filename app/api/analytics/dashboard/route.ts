import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/analytics/dashboard - Get dashboard analytics
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total trips count
    const { count: totalTrips } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get active trips count
    const { count: activeTrips } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active")

    // Get completed trips count
    const { count: completedTrips } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed")

    // Get total distance traveled
    const { data: distanceData } = await supabase
      .from("trips")
      .select("distance_km")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .not("distance_km", "is", null)

    const totalDistance = distanceData?.reduce((sum, trip) => sum + (trip.distance_km || 0), 0) || 0

    // Get transport mode distribution
    const { data: transportModes } = await supabase.from("trips").select("transport_mode").eq("user_id", user.id)

    const transportModeStats =
      transportModes?.reduce(
        (acc, trip) => {
          acc[trip.transport_mode] = (acc[trip.transport_mode] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    // Get recent trips
    const { data: recentTrips } = await supabase
      .from("trips")
      .select("id, trip_number, origin, destination, transport_mode, start_time, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get user rewards count
    const { count: totalRewards } = await supabase
      .from("user_rewards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get total points
    const { data: pointsData } = await supabase.from("user_rewards").select("points").eq("user_id", user.id)

    const totalPoints = pointsData?.reduce((sum, reward) => sum + (reward.points || 0), 0) || 0

    // Get monthly trip trends (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: monthlyTrips } = await supabase
      .from("trips")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", sixMonthsAgo.toISOString())

    const monthlyStats =
      monthlyTrips?.reduce(
        (acc, trip) => {
          const month = new Date(trip.created_at).toISOString().slice(0, 7) // YYYY-MM format
          acc[month] = (acc[month] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    return NextResponse.json({
      overview: {
        totalTrips: totalTrips || 0,
        activeTrips: activeTrips || 0,
        completedTrips: completedTrips || 0,
        totalDistance,
        totalRewards: totalRewards || 0,
        totalPoints,
      },
      transportModeStats,
      recentTrips: recentTrips || [],
      monthlyStats,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
