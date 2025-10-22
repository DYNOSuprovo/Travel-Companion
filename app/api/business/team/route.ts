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

    // Get user's organization/team
    const { data: userProfile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single()

    if (!userProfile?.organization_id) {
      return NextResponse.json({ members: [] })
    }

    // Get all team members in the organization
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        department,
        trips:trips(count),
        expenses:expenses(sum(amount))
      `,
      )
      .eq("organization_id", userProfile.organization_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const members = data?.map((member: any) => ({
      id: member.id,
      name: member.full_name || "Unknown",
      email: member.email,
      department: member.department || "General",
      totalTrips: member.trips?.[0]?.count || 0,
      totalExpenses: member.expenses?.[0]?.sum || 0,
      complianceScore: Math.floor(Math.random() * 40) + 60, // Placeholder: 60-100%
    }))

    return NextResponse.json({ members })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
