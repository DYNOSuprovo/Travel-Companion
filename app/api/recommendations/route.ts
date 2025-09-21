import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/recommendations - Get personalized recommendations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all" // routes, companions, transport, destinations

    // Get user preferences
    const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

    // Get user's trip history for ML analysis
    const { data: tripHistory } = await supabase
      .from("trips")
      .select(`
        *,
        trip_feedback(rating, feedback_text)
      `)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(50)

    // Get user's profile for location-based recommendations
    const { data: profile } = await supabase
      .from("profiles")
      .select("state, city, nationality")
      .eq("id", user.id)
      .single()

    // Generate ML-based recommendations
    const recommendations = await generateRecommendations({
      user,
      preferences,
      tripHistory: tripHistory || [],
      profile,
      type,
    })

    return NextResponse.json({ recommendations })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/recommendations/preferences - Update user preferences for better recommendations
export async function POST(request: NextRequest) {
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
    const { preferred_transport_modes, budget_range_min, budget_range_max, preferred_trip_duration_hours, interests } =
      body

    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .upsert({
        user_id: user.id,
        preferred_transport_modes,
        budget_range_min,
        budget_range_max,
        preferred_trip_duration_hours,
        interests,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ML recommendation engine (simplified version)
async function generateRecommendations({
  user,
  preferences,
  tripHistory,
  profile,
  type,
}: {
  user: any
  preferences: any
  tripHistory: any[]
  profile: any
  type: string
}) {
  const recommendations: any = {}

  // Route recommendations based on past trips and preferences
  if (type === "routes" || type === "all") {
    const frequentDestinations = tripHistory.reduce(
      (acc, trip) => {
        acc[trip.destination] = (acc[trip.destination] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topDestinations = Object.entries(frequentDestinations)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([destination]) => destination)

    recommendations.routes = [
      {
        id: "route_1",
        title: "Explore nearby attractions",
        description: `Discover hidden gems around ${profile?.city || "your area"}`,
        destinations: topDestinations.slice(0, 3),
        estimatedDuration: "2-4 hours",
        transportMode: preferences?.preferred_transport_modes?.[0] || "walking",
        confidence: 0.85,
      },
      {
        id: "route_2",
        title: "Weekend getaway",
        description: "Perfect for a relaxing weekend trip",
        destinations: [`${profile?.state || "State"} National Park`, "Historic Downtown", "Scenic Overlook"],
        estimatedDuration: "1-2 days",
        transportMode: "car",
        confidence: 0.78,
      },
    ]
  }

  // Transport mode recommendations
  if (type === "transport" || type === "all") {
    const transportStats = tripHistory.reduce(
      (acc, trip) => {
        acc[trip.transport_mode] = (acc[trip.transport_mode] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const preferredModes = Object.entries(transportStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)

    recommendations.transport = [
      {
        mode: "cycling",
        title: "Try cycling for short trips",
        description: "Eco-friendly and great exercise for trips under 10km",
        benefits: ["Environmental", "Health", "Cost-effective"],
        confidence: 0.72,
      },
      {
        mode: "public_transport",
        title: "Use public transport for city trips",
        description: "Efficient and affordable for urban destinations",
        benefits: ["Cost-effective", "Reduces traffic", "Reliable"],
        confidence: 0.68,
      },
    ]
  }

  // Companion recommendations (simplified - would use more complex ML in production)
  if (type === "companions" || type === "all") {
    recommendations.companions = [
      {
        id: "comp_1",
        title: "Find travel buddies",
        description: "Connect with travelers in your area with similar interests",
        matchCriteria: preferences?.interests || ["adventure", "culture"],
        confidence: 0.65,
      },
    ]
  }

  // Destination recommendations based on user profile and preferences
  if (type === "destinations" || type === "all") {
    const userInterests = preferences?.interests || []

    recommendations.destinations = [
      {
        id: "dest_1",
        name: "Local Cultural District",
        description: "Rich history and cultural attractions",
        category: "culture",
        distance: "15 km",
        estimatedCost: preferences?.budget_range_max ? `$${Math.round(preferences.budget_range_max * 0.3)}` : "$50",
        rating: 4.5,
        confidence: 0.82,
        matchedInterests: userInterests.filter((interest: string) => ["culture", "history", "art"].includes(interest)),
      },
      {
        id: "dest_2",
        name: "Adventure Park",
        description: "Outdoor activities and nature trails",
        category: "adventure",
        distance: "25 km",
        estimatedCost: preferences?.budget_range_max ? `$${Math.round(preferences.budget_range_max * 0.4)}` : "$75",
        rating: 4.3,
        confidence: 0.76,
        matchedInterests: userInterests.filter((interest: string) =>
          ["adventure", "nature", "outdoor"].includes(interest),
        ),
      },
    ]
  }

  return recommendations
}
