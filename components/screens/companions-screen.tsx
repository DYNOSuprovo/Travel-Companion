"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface CompanionsScreenProps {
  user: any
}

export default function CompanionsScreen({ user }: CompanionsScreenProps) {
  const [companions, setCompanions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newEmail, setNewEmail] = useState("")
  const supabase = createClient()

  useEffect(() => {
    loadCompanions()
  }, [user])

  const loadCompanions = async () => {
    try {
      setIsLoading(true)
      const { data, error: err } = await supabase
        .from("trip_companions")
        .select("*, companion:companion_user_id(full_name, email)")
        .eq("added_by", user.id)

      if (err && err.code !== "PGRST116") throw err
      setCompanions(data || [])
    } catch (err: any) {
      console.error("[v0] Companions load error:", err)
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
          <p className="text-slate-600 text-sm">Loading companions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Travel Companions</h2>
        <p className="text-slate-600 text-sm">Manage your travel partners and invitations</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}

      <div className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 space-y-3">
        <label className="block text-sm font-medium text-slate-900">Invite Companion</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
            Invite
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {companions.length > 0 ? (
          <div className="space-y-2">
            {companions.map((comp) => (
              <div
                key={comp.id}
                className="backdrop-blur-sm bg-white/60 rounded-lg p-4 border border-slate-200 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-slate-900">{comp.companion?.full_name || "Unknown"}</div>
                  <div className="text-xs text-slate-600">{comp.companion?.email}</div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    comp.status === "accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-sm bg-white/60 rounded-lg p-8 border border-slate-200 text-center">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-slate-600 text-sm">No companions added yet. Invite friends to travel together!</p>
          </div>
        )}
      </div>
    </div>
  )
}
