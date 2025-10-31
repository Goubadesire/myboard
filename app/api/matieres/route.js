import { supabase } from "@/lib/supabaseClient";

// ===========================
// GET : récupérer les matières d'un utilisateur
// ===========================
export async function GET(req) {
  try {
    const email = req.headers.get("email");
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    // 🔹 Récupération de l'utilisateur
    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Récupération des matières et coefficient par semestre
    const { data: matieres, error } = await supabase
      .from("semester_subjects")
      .select(`
        matiere:matieres(id, nom),
        semestre_id,
        coefficient
      `)
      .eq("user_id", user.id);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    // 🔹 Transformation pour front
    const uniqueMatieres = [];
    const map = new Map();
    matieres.forEach(item => {
      if (!map.has(item.matiere.id)) {
        map.set(item.matiere.id, {
          id: item.matiere.id,
          nom: item.matiere.nom,
          coefficient: item.coefficient, // peut ajuster si tu veux un coefficient par semestre
        });
        uniqueMatieres.push(map.get(item.matiere.id));
      }
    });

    return new Response(JSON.stringify({ matieres: uniqueMatieres }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// ===========================
// POST : ajouter une nouvelle matière
// ===========================
export async function POST(req) {
  try {
    const { nom, coefficient } = await req.json();
    const email = req.headers.get("email");
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!nom || !coefficient) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Créer la matière
    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .insert([{ nom }])
      .select("id, nom")
      .single();
    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 });

    // 🔹 Récupérer tous les semestres de l'utilisateur
    const { data: semestres } = await supabase
      .from("semestres")
      .select("id")
      .eq("user_id", user.id);

    // 🔹 Créer les liens dans semester_subjects
    const links = semestres.map(s => ({
      semestre_id: s.id,
      matiere_id: matiere.id,
      user_id: user.id,
      coefficient: parseFloat(coefficient)
    }));
    const { error: linkError } = await supabase.from("semester_subjects").insert(links);
    if (linkError) return new Response(JSON.stringify({ error: linkError.message }), { status: 500 });

    return new Response(JSON.stringify({ matiere }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// ===========================
// PUT : modifier une matière et son coefficient
// ===========================
export async function PUT(req) {
  try {
    const { nom, coefficient } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = req.headers.get("email");

    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id || !nom || !coefficient) return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Mettre à jour le nom de la matière
    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .update({ nom })
      .eq("id", id)
      .select("id, nom")
      .single();
    if (matiereError) return new Response(JSON.stringify({ error: matiereError.message }), { status: 500 });

    // 🔹 Mettre à jour le coefficient dans tous les semester_subjects
    const { error: coefError } = await supabase
      .from("semester_subjects")
      .update({ coefficient: parseFloat(coefficient) })
      .eq("matiere_id", id)
      .eq("user_id", user.id);
    if (coefError) return new Response(JSON.stringify({ error: coefError.message }), { status: 500 });

    return new Response(JSON.stringify({ matiere }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// ===========================
// DELETE : supprimer une matière
// ===========================
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = req.headers.get("email");

    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id) return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Supprimer la matière et les liens associés
    const { error } = await supabase.from("matieres").delete().eq("id", id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
