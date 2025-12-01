// /app/api/devoirs/route.js
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req) {
  const supabase = getSupabaseClient();
  try {
    const email = req.headers.get("email");
    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user)
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: devoirs, error: devoirsError } = await supabase
      .from("devoirs")
      .select("*")
      .eq("user_id", user.id)
      .order("date_limite", { ascending: true });

    if (devoirsError) return new Response(JSON.stringify({ error: devoirsError.message }), { status: 500 });

    return new Response(JSON.stringify({ devoirs }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function POST(req) {
  const supabase = getSupabaseClient();
  try {
    const { titre, description, date_limite, statut, matiere_id } = await req.json();
    const email = req.headers.get("email");

    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!titre || !description || !date_limite || !matiere_id)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: devoir, error: devoirError } = await supabase
      .from("devoirs")
      .insert([{ titre, description, date_limite, statut, matiere_id, user_id: user.id }])
      .select()
      .single();

    if (devoirError) return new Response(JSON.stringify({ error: devoirError.message }), { status: 500 });

    return new Response(JSON.stringify({ devoir }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function PUT(req) {
  const supabase = getSupabaseClient();
  try {
    const { titre, description, date_limite, statut, matiere_id } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = req.headers.get("email");

    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id || !titre || !description || !date_limite || !matiere_id)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: devoir, error: devoirError } = await supabase
      .from("devoirs")
      .update({ titre, description, date_limite, statut, matiere_id })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (devoirError) return new Response(JSON.stringify({ error: devoirError.message }), { status: 500 });

    return new Response(JSON.stringify({ devoir }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function DELETE(req) {
  const supabase = getSupabaseClient();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = req.headers.get("email");

    if (!email)
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id) return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { error: devoirError } = await supabase
      .from("devoirs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (devoirError) return new Response(JSON.stringify({ error: devoirError.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
