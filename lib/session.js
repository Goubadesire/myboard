// lib/session.js
import { getSupabaseClient } from "./supabaseClient"

export async function getUserFromEmail(email) {
  if (!email) return null
  const supabase = getSupabaseClient() // créé ici, pas au top-level
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()
  if (error) return null
  return data
}
