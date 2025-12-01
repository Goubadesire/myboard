import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabaseClient" // ✅
import bcrypt from "bcryptjs"

export async function POST(req) {
  const supabase = getSupabaseClient(); // Récupère le client Supabase
  try {
    const { email, password } = await req.json()

    // Vérifie si l'utilisateur existe
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    // Vérifie le mot de passe
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // ✅ Crée une réponse et stocke la session utilisateur dans les cookies
    const response = NextResponse.json({
      message: "Connexion réussie",
      user: { id: user.id, name: user.name, email: user.email },
    })

    response.cookies.set("user", JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
