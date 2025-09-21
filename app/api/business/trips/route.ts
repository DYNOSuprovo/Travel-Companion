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

    const { data: businessTrips, error } = await supabase
      .from("business_trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch business trips" }, { status: 500 })
    }

    return NextResponse.json({ business_trips: businessTrips })
  } catch (error) {
    console.error("Business trips API error:", error)
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

    const { purpose, client_company, project_code, cost_center, budget_allocated, is_billable, trip_id } =
      await request.json()

    const { data: businessTrip, error } = await supabase
      .from("business_trips")
      .insert({
        user_id: user.id,
        trip_id: trip_id || null,
        purpose,
        client_company,
        project_code,
        cost_center,
        budget_allocated,
        budget_currency: "USD",
        is_billable: is_billable || false,
        approval_status: "pending",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create business trip" }, { status: 500 })
    }

    // In a real app, you might send approval notifications here
    // await sendApprovalNotification(businessTrip)

    return NextResponse.json({ business_trip: businessTrip })
  } catch (error) {
    console.error("Create business trip error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
