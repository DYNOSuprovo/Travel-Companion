import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/trips/[id]/feedback - Get feedback for a trip
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

    const { data: feedback, error } = await supabase
      .from("trip_feedback")
      .select(`
        *,
        profiles!trip_feedback_user_id_fkey(full_name)
      `)
      .eq("trip_id", params.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/trips/[id]/feedback - Add feedback for a trip
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

    const body = await request.json()
    const { rating, feedback_text, suggestions } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if user already provided feedback for this trip
    const { data: existingFeedback } = await supabase
      .from("trip_feedback")
      .select("id")
      .eq("trip_id", params.id)
      .eq("user_id", user.id)
      .single()

    if (existingFeedback) {
      return NextResponse.json({ error: "Feedback already provided for this trip" }, { status: 400 })
    }

    const { data: feedback, error } = await supabase
      .from("trip_feedback")
      .insert({
        trip_id: params.id,
        user_id: user.id,
        rating,
        feedback_text,
        suggestions,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ feedback }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
