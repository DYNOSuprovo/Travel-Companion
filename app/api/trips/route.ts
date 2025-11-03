import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { tripSchema } from "@/lib/validation"
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100) // Cap at 100

    let query = supabase
      .from("trips")
      .select(
        `
        *,
        trip_companions(
          id,
          companion_user_id,
          status,
          profiles!trip_companions_companion_user_id_fkey(full_name)
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status && ["active", "completed", "cancelled"].includes(status)) {
      query = query.eq("status", status)
    }

    const { data: trips, error } = await query

    if (error) {
      throw new AppError(ErrorCodes.DB_ERROR, error.message, 500)
    }

    return NextResponse.json({ trips, count: trips?.length || 0 })
  } catch (error) {
    const response = handleError(error)
    return NextResponse.json(response.body, { status: response.status })
  }
}

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

    // Validate request body
    const validationResult = tripSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
      throw new AppError(ErrorCodes.VALIDATION_ERROR, "Invalid request data", 400, { errors })
    }

    const { trip_number, origin, destination, transport_mode, start_time, end_time, distance_km } =
      validationResult.data

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        trip_number,
        origin,
        destination,
        transport_mode,
        start_time,
        end_time: end_time || null,
        distance_km: distance_km || 0,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        throw new AppError(ErrorCodes.DUPLICATE_RECORD, "Trip already exists", 409)
      }
      throw new AppError(ErrorCodes.DB_ERROR, error.message, 500)
    }

    return NextResponse.json({ trip }, { status: 201 })
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
      maxRequests: 30,
    },
  })(request, {})
}

export async function POST(request: NextRequest) {
  return withSecurity(handlePOST, {
    requireAuth: true,
    rateLimit: {
      windowMs: 60000,
      maxRequests: 10,
    },
  })(request, {})
}
