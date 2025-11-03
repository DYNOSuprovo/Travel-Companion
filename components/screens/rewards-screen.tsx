"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface RewardsScreenProps {
  user: any
}

export default function RewardsScreen({ user }: RewardsScreenProps) {
  const [rewards, setRewards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    loadRewards()
  }, [user])

  const loadRewards = async () => {
    try {
      setIsLoading(true)
      const { data, error: err } = await supabase
        .from("user_rewards")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false })

      if (err && err.code !== "PGRST116") throw err
      setRewards(data || [])
    } catch (err: any) {
      console.error("[v0] Rewards load error:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Loading rewards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Rewards & Badges</h2>
        <p className="text-slate-600 text-sm">Earn badges as you travel more and reach milestones</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

      {rewards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="backdrop-blur-sm bg-white/60 rounded-lg p-6 border border-slate-200 text-center space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl">🏆</div>
              <div>
                <div className="font-semibold text-slate-900">{reward.badge_name}</div>
                <div className="text-xs text-slate-600 mt-1">{reward.description}</div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="text-lg font-bold text-blue-600">+{reward.points}</div>
                <div className="text-xs text-slate-600">Points</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="backdrop-blur-sm bg-white/60 rounded-lg p-12 border border-slate-200 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-slate-600 text-sm">Start traveling to earn rewards and badges!</p>
        </div>
      )}
    </div>
  )
}
