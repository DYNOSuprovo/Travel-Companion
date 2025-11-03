"use server"

import { createClient } from "@/lib/supabase/server"

export interface Companion {
  id: string
  user_id: string
  companion_user_id: string
  added_by: string
  status: "pending" | "accepted" | "declined"
  created_at: string
}

export async function inviteCompanion(companionEmail: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  // In a real app, you'd look up the user by email
  // For now, we'll create a record with the email
  const { error } = await supabase.from("trip_companions").insert({
    trip_id: "default", // Would be actual trip ID
    companion_user_id: user.id,
    added_by: user.id,
    status: "pending",
  })

  if (error) throw error
}

export async function getUserCompanions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: companions, error } = await supabase
    .from("trip_companions")
    .select("*")
    .eq("added_by", user.id)
    .eq("status", "accepted")

  if (error) throw error
  return companions as Companion[]
}

export async function getPendingInvites() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: invites, error } = await supabase
    .from("trip_companions")
    .select("*")
    .eq("added_by", user.id)
    .eq("status", "pending")

  if (error) throw error
  return invites as Companion[]
}
