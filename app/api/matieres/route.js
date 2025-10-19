// app/api/matieres/route.js
import { supabase } from "@/lib/supabaseClient"

export async function GET(req) {
  try {
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })

    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    // 🔹 Version test : récupérer toutes les matières (sans filtre user_id)
    const { data: matieres, error: matieresError } = await supabase
      .from("matieres")
      .select("*") // <-- on ne filtre pas encore pour tester
      .eq("user_id", user.id) // temporairement commenté

    if (matieresError) return new Response(JSON.stringify({ error: matieresError.message }), { status: 500 })

    return new Response(JSON.stringify({ matieres }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { nom, coefficient, semestre_id } = await req.json()
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!nom || !coefficient || !semestre_id) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 })

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .insert([{ nom, coefficient, semestre_id, user_id: user.id }])
      .select()
      .single()
    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ matiere }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const { nom, coefficient, semestre_id } = await req.json()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!id || !nom || !coefficient || !semestre_id) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 })

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .update({ nom, coefficient, semestre_id })
      .eq("id", id)
      
      .eq("user_id", user.id)
      .select()
      .single()
    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ matiere }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!id) return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 })

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    const { error: matiereError } = await supabase
      .from("matieres")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}
