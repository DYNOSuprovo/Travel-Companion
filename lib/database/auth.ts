"use server"

import { createClient } from "@/lib/supabase/server"

export interface UserProfile {
  id: string
  full_name?: string
  phone?: string
  state: string
  city: string
  nationality: string
  created_at: string
  updated_at: string
}

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) throw error
  return profile as UserProfile
}

export async function updateUserProfile(updates: Partial<UserProfile>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error
}
