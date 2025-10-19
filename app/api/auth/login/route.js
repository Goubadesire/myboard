import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // Vérifie si l'utilisateur existe
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    // Vérifie le mot de passe
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 })
    }

    // ✅ Crée une réponse et stocke la session utilisateur dans les cookies
    const response = NextResponse.json({
      message: "Connexion réussie",
      user: { id: user.id, name: user.name, email: user.email },
    })

    // Enregistre le cookie (durée : 7 jours)
    response.cookies.set("user", JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true, // Empêche JavaScript d’y accéder (sécurité)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
