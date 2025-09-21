import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: stories, error } = await supabase
      .from("travel_stories")
      .select(
        `
        *,
        profiles:user_id (
          full_name,
          avatar_url
        ),
        story_likes!left (
          user_id
        )
      `,
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
    }

    // Transform data to include user info and like status
    const transformedStories = stories?.map((story) => ({
      ...story,
      user_name: story.profiles?.full_name || "Anonymous",
      user_avatar: story.profiles?.avatar_url,
      is_liked: story.story_likes?.some((like: any) => like.user_id === story.user_id) || false,
    }))

    return NextResponse.json({ stories: transformedStories })
  } catch (error) {
    console.error("Stories API error:", error)
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

    const { title, content, tags, location, trip_id, photos } = await request.json()

    const { data: story, error } = await supabase
      .from("travel_stories")
      .insert({
        user_id: user.id,
        trip_id: trip_id || null,
        title,
        content,
        tags: tags || [],
        location,
        photos: photos || [],
        is_public: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
    }

    return NextResponse.json({ story })
  } catch (error) {
    console.error("Create story error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
