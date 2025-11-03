"use server"

import { createClient } from "@/lib/supabase/server"

export interface Reward {
  id: string
  user_id: string
  badge_type: string
  badge_name: string
  description?: string
  points: number
  earned_at: string
}

export async function getUserRewards() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: rewards, error } = await supabase
    .from("user_rewards")
    .select("*")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })

  if (error) throw error
  return rewards as Reward[]
}

export async function awardBadge(badgeType: string, badgeName: string, points: number, description?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("user_rewards").insert({
    user_id: user.id,
    badge_type: badgeType,
    badge_name: badgeName,
    points,
    description,
  })

  if (error) throw error
}
