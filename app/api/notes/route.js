import { supabase } from "@/lib/supabaseClient";

// 🔹 GET : récupérer toutes les notes et matières liées aux semestres de l'utilisateur
export async function GET(req) {
  try {
    const email = req.headers.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    // 🔹 Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Récupérer les notes de l'utilisateur
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select(`
        id,
        valeur,
        coefficient,
        matiere:matieres (id, nom),
        semestre:semestres (id, nom)
      `)
      .eq("user_id", user.id);
    if (notesError) throw notesError;

    // 🔹 Récupérer les semestres de l'utilisateur via ses matières dans semester_subjects
    const { data: semesterSubjects, error: ssError } = await supabase
      .from("semester_subjects")
      .select(`
        id,
        matiere:matieres (id, nom),
        semestre:semestres (id, nom)
      `)
      .eq("user_id", user.id);
    if (ssError) throw ssError;

    // 🔹 Extraire les semestres uniques de semesterSubjects pour le filtre
    const semestresMap = {};
    semesterSubjects.forEach(ss => {
      semestresMap[ss.semestre.id] = ss.semestre;
    });
    const semestres = Object.values(semestresMap);

    return new Response(JSON.stringify({ notes, matieres: semesterSubjects, semestres }), { status: 200 });

  } catch (err) {
    console.error("Erreur GET Notes:", err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
// 🔹 POST : ajouter une note
export async function POST(req) {
  try {
    const email = req.headers.get("email");
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const { matiere_id, semestre_id, valeur, coefficient } = await req.json();
    if (!matiere_id || !semestre_id || !valeur || !coefficient)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    // 🔹 Insertion et récupération complète de la note avec matiere et semestre
    const { data, error } = await supabase
      .from("notes")
      .insert([{
        matiere_id,
        semestre_id,
        valeur,
        coefficient,
        user_id: user.id
      }])
      .select(`
        id,
        valeur,
        coefficient,
        matiere:matieres(id, nom),
        semestre:semestres(id, nom)
      `)
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

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data, error } = await supabase
      .from("notes")
      .update({ valeur, coefficient })
      .eq("id", id)
      .eq("user_id", user.id)
      .select(`
        id,
        valeur,
        coefficient,
        matiere:matieres(id, nom),
        semestre:semestres(id, nom)
      `)
      .single();

    if (error) throw error;
    return new Response(JSON.stringify({ note: data }), { status: 200 });
  } catch (err) {
    console.error("Erreur PUT Notes:", err);
    return new Response(JSON.stringify({ error: "Erreur lors de la modification" }), { status: 500 });
  }
}

// 🔹 DELETE : supprimer une note
export async function DELETE(req) {
  try {
    const id = req.url.split("id=")[1];
    const email = req.headers.get("email");

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
    return new Response(JSON.stringify({ success: !error, error: error?.message }), { status: error ? 500 : 200 });
  } catch (err) {
    console.error("Erreur DELETE Notes:", err);
    return new Response(JSON.stringify({ error: "Erreur lors de la suppression" }), { status: 500 });
  }
}
