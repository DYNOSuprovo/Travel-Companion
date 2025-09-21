import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

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

    const { region_name, bounds } = await request.json()

    // Calculate estimated file size based on area
    const area = Math.abs(bounds.north - bounds.south) * Math.abs(bounds.east - bounds.west)
    const estimated_size = Math.floor(area * 1000000 * 50) // Rough estimate

    // Create offline map record
    const { data: map, error: mapError } = await supabase
      .from("offline_maps")
      .insert({
        user_id: user.id,
        region_name,
        bounds,
        file_size: estimated_size,
        status: "downloading",
      })
      .select()
      .single()

    if (mapError) {
      return NextResponse.json({ error: "Failed to create map download" }, { status: 500 })
    }

    // In a real app, you'd trigger actual map tile downloading
    // For now, simulate download completion after 5 seconds
    setTimeout(async () => {
      await supabase.from("offline_maps").update({ status: "ready" }).eq("id", map.id)
    }, 5000)

    return NextResponse.json({
      success: true,
      map_id: map.id,
      estimated_size,
      status: "downloading",
    })
  } catch (error) {
    console.error("Offline map download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
