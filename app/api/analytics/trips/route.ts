import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/analytics/trips - Get detailed trip analytics
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
    const period = searchParams.get("period") || "month" // month, quarter, year
    const transport_mode = searchParams.get("transport_mode")

    const dateFilter = new Date()
    switch (period) {
      case "quarter":
        dateFilter.setMonth(dateFilter.getMonth() - 3)
        break
      case "year":
        dateFilter.setFullYear(dateFilter.getFullYear() - 1)
        break
      default: // month
        dateFilter.setMonth(dateFilter.getMonth() - 1)
    }

    let query = supabase
      .from("trips")
      .select(`
        id,
        trip_number,
        origin,
        destination,
        transport_mode,
        start_time,
        end_time,
        distance_km,
        status,
        created_at,
        trip_feedback(rating, feedback_text)
      `)
      .eq("user_id", user.id)
      .gte("created_at", dateFilter.toISOString())
      .order("created_at", { ascending: false })

    if (transport_mode) {
      query = query.eq("transport_mode", transport_mode)
    }

    const { data: trips, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate analytics
    const analytics = {
      totalTrips: trips?.length || 0,
      completedTrips: trips?.filter((t) => t.status === "completed").length || 0,
      activeTrips: trips?.filter((t) => t.status === "active").length || 0,
      cancelledTrips: trips?.filter((t) => t.status === "cancelled").length || 0,
      totalDistance: trips?.reduce((sum, trip) => sum + (trip.distance_km || 0), 0) || 0,
      averageRating:
        trips?.reduce((sum, trip) => {
          const rating = trip.trip_feedback?.[0]?.rating || 0
          return sum + rating
        }, 0) / (trips?.filter((t) => t.trip_feedback?.length > 0).length || 1) || 0,
      transportModeBreakdown:
        trips?.reduce(
          (acc, trip) => {
            acc[trip.transport_mode] = (acc[trip.transport_mode] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ) || {},
      dailyTripCounts:
        trips?.reduce(
          (acc, trip) => {
            const date = new Date(trip.created_at).toISOString().split("T")[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ) || {},
    }

    return NextResponse.json({
      analytics,
      trips: trips || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
