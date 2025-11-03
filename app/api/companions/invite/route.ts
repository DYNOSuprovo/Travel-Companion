import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { companion_email } = body

    if (!companion_email) {
      return NextResponse.json({ error: "Companion email required" }, { status: 400 })
    }

    const { data: invite, error } = await supabase
      .from("trip_companions")
      .insert({
        trip_id: "default-trip", // Would be actual trip ID
        companion_user_id: user.id,
        added_by: user.id,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(invite)
  } catch (error) {
    console.error("[v0] Invitation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
