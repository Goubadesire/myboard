import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "Tous les champs sont obligatoires" }, { status: 400 })
    }

    // Récupérer l'utilisateur depuis Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return Response.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return Response.json({ error: "Mot de passe incorrect" }, { status: 401 })
    }

    return Response.json({ message: "Connexion réussie", user })
  } catch (err) {
    console.error("💥 ERREUR LOGIN COMPLETE :", err)
    return Response.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
