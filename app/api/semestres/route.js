// app/api/semestres/route.js
import { getSupabaseClient } from "@/lib/supabaseClient";

// GET /api/semestres
export async function GET(req) {
  const supabase = getSupabaseClient(); // créer le client ici

  try {
    const email = req.headers.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur introuvable" }),
        { status: 401 }
      );
    }

    const { data: semestres, error: semestresError } = await supabase
      .from("semestres")
      .select("*")
      .eq("user_id", user.id)
      .order("annee", { ascending: true });

    if (semestresError) {
      return new Response(
        JSON.stringify({ error: semestresError.message }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ semestres }), { status: 200 });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// POST /api/semestres
export async function POST(req) {
  const supabase = getSupabaseClient();

  try {
    const { nom, annee } = await req.json();
    const email = req.headers.get("email");

    if (!email)
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );

    if (!nom || !annee)
      return new Response(
        JSON.stringify({ error: "Nom et année sont obligatoires" }),
        { status: 400 }
      );

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user)
      return new Response(
        JSON.stringify({ error: "Utilisateur introuvable" }),
        { status: 401 }
      );

    const { data: semestre, error: semestreError } = await supabase
      .from("semestres")
      .insert([{ nom, annee, user_id: user.id }])
      .select()
      .single();

    if (semestreError)
      return new Response(
        JSON.stringify({ error: semestreError.message }),
        { status: 500 }
      );

    return new Response(JSON.stringify({ semestre }), { status: 200 });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// PUT /api/semestres
export async function PUT(req) {
  const supabase = getSupabaseClient();

  try {
    const { nom, annee } = await req.json();
    const email = req.headers.get("email");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!email)
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );

    if (!id)
      return new Response(
        JSON.stringify({ error: "ID du semestre manquant" }),
        { status: 400 }
      );

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user)
      return new Response(
        JSON.stringify({ error: "Utilisateur introuvable" }),
        { status: 401 }
      );

    const { data: semestre, error } = await supabase
      .from("semestres")
      .update({ nom, annee })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );

    return new Response(JSON.stringify({ semestre }), { status: 200 });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// DELETE /api/semestres
export async function DELETE(req) {
  const supabase = getSupabaseClient();

  try {
    const email = req.headers.get("email");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!email)
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );

    if (!id)
      return new Response(
        JSON.stringify({ error: "ID du semestre manquant" }),
        { status: 400 }
      );

    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user)
      return new Response(
        JSON.stringify({ error: "Utilisateur introuvable" }),
        { status: 401 }
      );

    const { error } = await supabase
      .from("semestres")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Erreur serveur:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
