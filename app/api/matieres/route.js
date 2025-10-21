// app/api/matieres/route.js
import { supabase } from "@/lib/supabaseClient"

// ===========================
// GET : récupérer les matières d'un utilisateur
// ===========================
export async function GET(req) {
  try {
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })

    // 🔹 Récupération de l'utilisateur
    // Optimisation : pourrait être passé depuis le front pour éviter cet appel répétitif
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    // 🔹 Récupération des matières
    // Optimisation : sélectionner uniquement les champs nécessaires pour le front
    const { data: matieres, error: matieresError } = await supabase
      .from("matieres")
      .select("id, nom, coefficient, semestre_id") // au lieu de "*"
      .eq("user_id", user.id)

    if (matieresError) return new Response(JSON.stringify({ error: matieresError.message }), { status: 500 })

    return new Response(JSON.stringify({ matieres }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

// ===========================
// POST : ajouter une nouvelle matière
// ===========================
export async function POST(req) {
  try {
    const { nom, coefficient, semestre_id } = await req.json()
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!nom || !coefficient || !semestre_id) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 })

    // 🔹 Récupération de l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    // 🔹 Insertion de la matière
    // Optimisation : sélectionner uniquement les champs nécessaires
    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .insert([{ nom, coefficient, semestre_id, user_id: user.id }])
      .select("id, nom, coefficient, semestre_id")
      .single()

    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ matiere }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

// ===========================
// PUT : modifier une matière
// ===========================
export async function PUT(req) {
  try {
    const { nom, coefficient, semestre_id } = await req.json()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!id || !nom || !coefficient || !semestre_id) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 })

    // 🔹 Récupération de l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    // 🔹 Mise à jour de la matière
    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .update({ nom, coefficient, semestre_id })
      .eq("id", id)
      .eq("user_id", user.id) // s'assure que l'utilisateur ne modifie que ses matières
      .select("id, nom, coefficient, semestre_id")
      .single()

    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ matiere }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}

// ===========================
// DELETE : supprimer une matière
// ===========================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = req.headers.get("email")
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 })
    if (!id) return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 })

    // 🔹 Récupération de l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 })

    // 🔹 Suppression de la matière
    const { error: matiereError } = await supabase
      .from("matieres")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id) // sécurité : ne supprime que ses matières

    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error("Erreur serveur:", err)
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}
