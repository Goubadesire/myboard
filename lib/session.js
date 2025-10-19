// lib/session.js
import { supabase } from "./supabaseClient"

// Persister l'utilisateur côté client
export function setUser(user) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Récupérer l'utilisateur côté client
export function getUser() {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Supprimer l'utilisateur côté client
export function clearUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

// Récupérer un utilisateur depuis Supabase par email
export async function getUserFromEmail(email) {
  if (!email) return null

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error) return null
  return data
}
