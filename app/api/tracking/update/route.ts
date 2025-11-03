import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"
import { withSecurity } from "@/lib/security"
import { handleError, AppError, ErrorCodes } from "@/lib/error-handler"

async function handlePOST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new AppError(ErrorCodes.UNAUTHORIZED, "User not authenticated", 401)
    }

    const body = await request.json()
    const { trip_id, locations, distance, duration, avg_speed, max_speed } = body

    if (!trip_id || !Array.isArray(locations)) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, "Trip ID and locations array required", 400)
    }

    const { error: updateError } = await supabase
      .from("trips")
      .update({
        distance_km: distance || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", trip_id)
      .eq("user_id", user.id)

    if (updateError) {
      throw new AppError(ErrorCodes.DB_ERROR, "Failed to update trip", 500)
    }

    // This would require a trip_tracking table in the database
    // For now, we just return the updated stats
    return NextResponse.json({
      success: true,
      stats: {
        distance,
        duration,
        average_speed: avg_speed,
        max_speed,
        location_points: locations.length,
      },
    })
  } catch (error) {
    const response = handleError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

export async function POST(request: NextRequest) {
  return withSecurity(handlePOST, {
    requireAuth: true,
    rateLimit: {
      windowMs: 60000,
      maxRequests: 60, // Allow frequent updates for tracking
    },
  })(request, {})
}
