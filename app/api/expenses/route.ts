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

    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get("trip_id")

    let query = supabase.from("expenses").select("*").eq("user_id", user.id).order("date", { ascending: false })

    if (tripId) {
      query = query.eq("trip_id", tripId)
    }

    const { data: expenses, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
    }

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error("Expenses API error:", error)
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

    const formData = await request.formData()
    const category = formData.get("category") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const tripId = formData.get("trip_id") as string
    const receipt = formData.get("receipt") as File

    let receipt_url = null
    if (receipt) {
      // Upload receipt to storage (implementation depends on your storage solution)
      // For now, we'll just store a placeholder URL
      receipt_url = `/receipts/${user.id}/${Date.now()}-${receipt.name}`
    }

    const { data: expense, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        trip_id: tripId || null,
        category,
        amount,
        description,
        date,
        receipt_url,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
    }

    return NextResponse.json({ expense })
  } catch (error) {
    console.error("Create expense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
