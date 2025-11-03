import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import { withSecurity } from "@/lib/security"
import { handleError, AppError, ErrorCodes } from "@/lib/error-handler"

async function handleGET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "User not authenticated", 401)
    }

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("distance_km, status, transport_mode, created_at")
      .eq("user_id", user.id)

    if (tripsError) {
      throw new AppError(ErrorCodes.DB_ERROR, "Failed to fetch trips", 500)
    }

    const completedTrips = (trips || []).filter((t) => t.status === "completed")
    const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0)
    const averageDistance = completedTrips.length > 0 ? totalDistance / completedTrips.length : 0

    // Count trips by transport mode
    const modeBreakdown = completedTrips.reduce(
      (acc, trip) => {
        acc[trip.transport_mode] = (acc[trip.transport_mode] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Calculate carbon saved (assuming 0.21 kg CO2 per km average)
    const carbonSaved = totalDistance * 0.21

    return NextResponse.json({
      total_distance: Number.parseFloat(totalDistance.toFixed(2)),
      total_trips: completedTrips.length,
      average_distance: Number.parseFloat(averageDistance.toFixed(2)),
      average_speed: Number.parseFloat(averageDistance.toFixed(2)), // Placeholder, would need time data
      carbon_saved: Number.parseFloat(carbonSaved.toFixed(2)),
      mode_breakdown: modeBreakdown,
      active_trips: trips?.filter((t) => t.status === "active").length || 0,
    })
  } catch (error) {
    const response = handleError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function GET(request: NextRequest) {
  return withSecurity(handleGET, {
    requireAuth: true,
    rateLimit: {
      windowMs: 60000,
      maxRequests: 20,
    },
  })(request, {})
}
