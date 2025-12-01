import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req) {
  const supabase = getSupabaseClient();
  try {
    const email = req.headers.get("email");
    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (userError || !user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: emplois, error: emploisError } = await supabase
      .from("emplois_du_temps")
      .select("*")
      .eq("user_id", user.id);
    if (emploisError) throw emploisError;

    return new Response(JSON.stringify({ emplois }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function POST(req) {
  const supabase = getSupabaseClient();
  try {
    const email = req.headers.get("email");
    const { jour, heure_debut, heure_fin, matiere_id } = await req.json();

    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!jour || !heure_debut || !heure_fin || !matiere_id)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: emploi, error: emploiError } = await supabase
      .from("emplois_du_temps")
      .insert([{ jour, heure_debut, heure_fin, matiere_id, user_id: user.id }])
      .select()
      .single();
    if (emploiError) return new Response(JSON.stringify({ error: emploiError.message }), { status: 500 });

    return new Response(JSON.stringify({ emploi }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function PUT(req) {
  const supabase = getSupabaseClient();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = req.headers.get("email");
    const { jour, heure_debut, heure_fin, matiere_id } = await req.json();

    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id || !jour || !heure_debut || !heure_fin || !matiere_id)
      return new Response(JSON.stringify({ error: "Données manquantes" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { data: emploi, error: emploiError } = await supabase
      .from("emplois_du_temps")
      .update({ jour, heure_debut, heure_fin, matiere_id })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    if (emploiError) return new Response(JSON.stringify({ error: emploiError.message }), { status: 500 });

    return new Response(JSON.stringify({ emploi }), { status: 200 });
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

    if (!email) return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    if (!id) return new Response(JSON.stringify({ error: "ID manquant" }), { status: 400 });

    const { data: user } = await supabase.from("users").select("id").eq("email", email).single();
    if (!user) return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 401 });

    const { error: emploiError } = await supabase.from("emplois_du_temps").delete().eq("id", id).eq("user_id", user.id);
    if (emploiError) return new Response(JSON.stringify({ error: emploiError.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
