import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/rewards - Get user rewards and badges
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
    const limit = searchParams.get("limit")

    let query = supabase
      .from("user_rewards")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: rewards, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate total points
    const totalPoints = rewards?.reduce((sum, reward) => sum + (reward.points || 0), 0) || 0

    // Group rewards by badge type
    const badgeStats =
      rewards?.reduce(
        (acc, reward) => {
          acc[reward.badge_type] = (acc[reward.badge_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ) || {}

    // Check for new badges to award
    const newBadges = await checkForNewBadges(user.id, supabase)

    return NextResponse.json({
      rewards: rewards || [],
      totalPoints,
      badgeStats,
      newBadges,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/rewards/claim - Claim available rewards
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

    // Check for claimable rewards and add them
    const newRewards = await awardEligibleBadges(user.id, supabase)

    return NextResponse.json({
      message: "Rewards claimed successfully",
      newRewards,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to check for new badges
async function checkForNewBadges(userId: string, supabase: any) {
  const newBadges = []

  // Get user's trip statistics
  const { data: trips } = await supabase.from("trips").select("*").eq("user_id", userId)

  const completedTrips = trips?.filter((t) => t.status === "completed") || []
  const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance_km || 0), 0)

  // Check existing rewards to avoid duplicates
  const { data: existingRewards } = await supabase.from("user_rewards").select("badge_type").eq("user_id", userId)

  const existingBadgeTypes = existingRewards?.map((r) => r.badge_type) || []

  // First Trip Badge
  if (completedTrips.length >= 1 && !existingBadgeTypes.includes("first_trip")) {
    newBadges.push({
      badge_type: "first_trip",
      badge_name: "First Journey",
      description: "Completed your first trip!",
      points: 100,
    })
  }

  // Explorer Badge (5 trips)
  if (completedTrips.length >= 5 && !existingBadgeTypes.includes("explorer")) {
    newBadges.push({
      badge_type: "explorer",
      badge_name: "Explorer",
      description: "Completed 5 trips",
      points: 250,
    })
  }

  // Adventurer Badge (10 trips)
  if (completedTrips.length >= 10 && !existingBadgeTypes.includes("adventurer")) {
    newBadges.push({
      badge_type: "adventurer",
      badge_name: "Adventurer",
      description: "Completed 10 trips",
      points: 500,
    })
  }

  // Distance Milestones
  if (totalDistance >= 100 && !existingBadgeTypes.includes("distance_100")) {
    newBadges.push({
      badge_type: "distance_100",
      badge_name: "Century Traveler",
      description: "Traveled 100+ kilometers",
      points: 300,
    })
  }

  if (totalDistance >= 500 && !existingBadgeTypes.includes("distance_500")) {
    newBadges.push({
      badge_type: "distance_500",
      badge_name: "Long Distance Traveler",
      description: "Traveled 500+ kilometers",
      points: 750,
    })
  }

  // Eco-Friendly Badge (5+ cycling/walking trips)
  const ecoTrips = completedTrips.filter((t) => ["cycling", "walking"].includes(t.transport_mode))
  if (ecoTrips.length >= 5 && !existingBadgeTypes.includes("eco_friendly")) {
    newBadges.push({
      badge_type: "eco_friendly",
      badge_name: "Eco Warrior",
      description: "Completed 5+ eco-friendly trips",
      points: 400,
    })
  }

  return newBadges
}

// Helper function to award eligible badges
async function awardEligibleBadges(userId: string, supabase: any) {
  const newBadges = await checkForNewBadges(userId, supabase)
  const awardedBadges = []

  for (const badge of newBadges) {
    const { data, error } = await supabase
      .from("user_rewards")
      .insert({
        user_id: userId,
        badge_type: badge.badge_type,
        badge_name: badge.badge_name,
        description: badge.description,
        points: badge.points,
      })
      .select()
      .single()

    if (!error) {
      awardedBadges.push(data)
    }
  }

  return awardedBadges
}
