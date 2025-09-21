import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// PUT /api/trips/[id]/companions/[companionId] - Update companion status
export async function PUT(request: NextRequest, { params }: { params: { id: string; companionId: string } }) {
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
    const { status } = body

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update companion status (only the companion themselves can update their status)
    const { data: companion, error } = await supabase
      .from("trip_companions")
      .update({ status })
      .eq("id", params.companionId)
      .eq("companion_user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ companion })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/trips/[id]/companions/[companionId] - Remove companion from trip
export async function DELETE(request: NextRequest, { params }: { params: { id: string; companionId: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Allow deletion by trip owner or the companion themselves
    const { error } = await supabase
      .from("trip_companions")
      .delete()
      .eq("id", params.companionId)
      .or(`added_by.eq.${user.id},companion_user_id.eq.${user.id}`)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Companion removed successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
