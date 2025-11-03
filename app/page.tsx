"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AuthFlow from "@/components/auth-flow"
import AppShell from "@/components/app-shell"

export default function Home() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError

      if (authUser) {
        setUser(authUser)
      }
    } catch (err) {
      console.error("[v0] Auth check error:", err)
      setError(err?.message || "Authentication error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    const guestUser = {
      id: "guest-" + Date.now(),
      email: "guest@travel-companion.local",
      user_metadata: {
        full_name: "Guest User",
        is_guest: true,
      },
    }
    setIsGuest(true)
    setUser(guestUser)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <AppShell
        user={user}
        onLogout={() => {
          setUser(null)
          setIsGuest(false)
        }}
        isGuest={isGuest}
      />
    )
  }

  return <AuthFlow onAuthSuccess={(userData) => setUser(userData)} onGuestLogin={handleGuestLogin} />
}
