import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's organization
    const { data: userProfile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single()

    if (!userProfile?.organization_id) {
      return NextResponse.json({ policies: [] })
    }

    // Get organization policies
    const { data, error } = await supabase
      .from("travel_policies")
      .select("*")
      .eq("organization_id", userProfile.organization_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const policies = data?.map((policy: any) => ({
      id: policy.id,
      name: policy.name,
      maxDailyBudget: policy.max_daily_budget,
      requiresApproval: policy.requires_approval,
      violations: Math.floor(Math.random() * 5), // Placeholder
    }))

    return NextResponse.json({ policies })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, maxDailyBudget, requiresApproval } = body

    if (!name || !maxDailyBudget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user's organization
    const { data: userProfile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single()

    if (!userProfile?.organization_id) {
      return NextResponse.json({ error: "User not in an organization" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("travel_policies")
      .insert([
        {
          organization_id: userProfile.organization_id,
          name,
          max_daily_budget: maxDailyBudget,
          requires_approval: requiresApproval || false,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ policy: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
