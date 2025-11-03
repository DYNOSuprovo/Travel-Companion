"use client"

import { useState, useEffect, useCallback } from "react"

export interface Reward {
  id: string
  badge_type: string
  badge_name: string
  description?: string
  points: number
  earned_at: string
}

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/rewards")
      if (!response.ok) throw new Error("Failed to fetch rewards")
      const data = await response.json()
      setRewards(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  const checkAchievements = useCallback(async () => {
    try {
      const response = await fetch("/api/rewards/check-achievements")
      if (!response.ok) throw new Error("Failed to check achievements")
      const { achievements } = await response.json()
      return achievements
    } catch (err) {
      throw err instanceof Error ? err : new Error("Unknown error")
    }
  }, [])

  useEffect(() => {
    fetchRewards()
  }, [fetchRewards])

  return {
    rewards,
    loading,
    error,
    checkAchievements,
    refetch: fetchRewards,
  }
}
