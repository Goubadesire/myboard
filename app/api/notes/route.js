import { supabase } from "@/lib/supabaseClient";

// 🔹 GET : récupérer toutes les notes ET les matières de l'utilisateur
export async function GET(req) {
  try {
    const email = req.headers.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user)
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔸 Récupérer les notes avec les matières liées
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select(`
        id,
        valeur,
        coefficient,
        matiere_id,
        matieres (
          id,
          nom,
          semestre_id
        )
      `)
      .eq("user_id", user.id);

    if (notesError)
      return new Response(JSON.stringify({ error: notesError.message }), { status: 500 });

    // 🔸 Récupérer aussi les matières de cet utilisateur
    const { data: matieres, error: matieresError } = await supabase
      .from("matieres")
      .select("id, nom, semestre_id")
      .eq("user_id", user.id);

    if (matieresError)
      return new Response(JSON.stringify({ error: matieresError.message }), { status: 500 });

    return new Response(JSON.stringify({ notes, matieres }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// 🔹 POST : ajouter une note
export async function POST(req) {
  try {
    const email = req.headers.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const { matiere_id, valeur, coefficient } = await req.json();
    if (!matiere_id || !valeur || !coefficient)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user)
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // Trouver le semestre de la matière
    const { data: matiere, error: matiereError } = await supabase
      .from("matieres")
      .select("semestre_id")
      .eq("id", matiere_id)
      .single();

    if (matiereError || !matiere)
      return new Response(JSON.stringify({ error: "Matière introuvable" }), { status: 400 });

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          matiere_id,
          valeur,
          coefficient,
          semestre_id: matiere.semestre_id,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ note: data }), { status: 200 });
  } catch (err) {
    console.error("Erreur POST Notes:", err);
    return new Response(JSON.stringify({ error: "Erreur lors de l’ajout de la note" }), { status: 500 });
  }
}

// 🔹 PUT : modifier une note
export async function PUT(req) {
  try {
    const id = req.url.split("id=")[1];
    const email = req.headers.get("email");
    const { valeur, coefficient } = await req.json();

    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!valeur || !coefficient)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();

    const { data, error } = await supabase
      .from("notes")
      .update({ valeur, coefficient })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return new Response(JSON.stringify({ note: data }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// 🔹 DELETE : supprimer une note
export async function DELETE(req) {
  try {
    const id = req.url.split("id=")[1];
    const email = req.headers.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();

    const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);

    if (error) throw error;
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
