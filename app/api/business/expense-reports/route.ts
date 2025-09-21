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

    const { data: expenseReports, error } = await supabase
      .from("expense_reports")
      .select(
        `
        *,
        expense_line_items (count)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch expense reports" }, { status: 500 })
    }

    return NextResponse.json({ expense_reports: expenseReports })
  } catch (error) {
    console.error("Expense reports API error:", error)
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

    const { report_name, report_period_start, report_period_end, business_trip_id } = await request.json()

    const { data: expenseReport, error } = await supabase
      .from("expense_reports")
      .insert({
        user_id: user.id,
        business_trip_id: business_trip_id || null,
        report_name,
        report_period_start,
        report_period_end,
        total_amount: 0,
        currency: "USD",
        status: "draft",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create expense report" }, { status: 500 })
    }

    return NextResponse.json({ expense_report: expenseReport })
  } catch (error) {
    console.error("Create expense report error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
