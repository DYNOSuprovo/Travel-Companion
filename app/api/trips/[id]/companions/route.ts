import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/trips/[id]/companions - Get companions for a trip
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the trip
    const { data: trip } = await supabase.from("trips").select("id").eq("id", params.id).eq("user_id", user.id).single()

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    const { data: companions, error } = await supabase
      .from("trip_companions")
      .select(`
        *,
        profiles!trip_companions_companion_user_id_fkey(full_name, phone, state, city)
      `)
      .eq("trip_id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ companions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/trips/[id]/companions - Add a companion to a trip
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the trip
    const { data: trip } = await supabase.from("trips").select("id").eq("id", params.id).eq("user_id", user.id).single()

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    const body = await request.json()
    const { companion_user_id } = body

    if (!companion_user_id) {
      return NextResponse.json({ error: "Companion user ID is required" }, { status: 400 })
    }

    // Check if companion already exists for this trip
    const { data: existingCompanion } = await supabase
      .from("trip_companions")
      .select("id")
      .eq("trip_id", params.id)
      .eq("companion_user_id", companion_user_id)
      .single()

    if (existingCompanion) {
      return NextResponse.json({ error: "Companion already added to this trip" }, { status: 400 })
    }

    const { data: companion, error } = await supabase
      .from("trip_companions")
      .insert({
        trip_id: params.id,
        companion_user_id,
        added_by: user.id,
        status: "pending",
      })
      .select(`
        *,
        profiles!trip_companions_companion_user_id_fkey(full_name, phone)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ companion }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
