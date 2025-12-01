// app/api/profiles/route.js
import { getSupabaseClient } from "@/lib/supabaseClient";

// GET /api/profiles
export async function GET(req) {
  const supabase = getSupabaseClient();

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
        { status: 404 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ profile }), { status: 200 });
  } catch (err) {
    console.error("Erreur GET profile :", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

// PUT /api/profiles
export async function PUT(req) {
  const supabase = getSupabaseClient();

  try {
    const email = req.headers.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );
    }

    const { full_name, filiere, ecole, photo_url } = await req.json();

    if (!full_name || !filiere || !ecole) {
      return new Response(
        JSON.stringify({ error: "Données manquantes" }),
        { status: 400 }
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
        { status: 404 }
      );
    }

    const { data: existingProfile, error: existingError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) throw existingError;

    let data;
    if (existingProfile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ full_name, filiere, ecole, photo_url })
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;
      data = updatedProfile;
    } else {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([{ user_id: user.id, full_name, filiere, ecole, photo_url }])
        .select()
        .maybeSingle();

      if (insertError) throw insertError;
      data = newProfile;
    }

    return new Response(JSON.stringify({ profile: data }), { status: 200 });
  } catch (err) {
    console.error("Erreur PUT profile:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
