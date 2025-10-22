import { supabase } from "@/lib/supabaseClient";



export async function GET(req) {
  try {
    const email = req.headers.get("email");
    if (!email) {
      return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), { status: 401 });
    }

    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
    }

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    return new Response(JSON.stringify({ profile }), { status: 200 });
  } catch (err) {
    console.error("Erreur GET profile :", err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}





export async function PUT(req) {
  try {
    const email = req.headers.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non connecté" }),
        { status: 401 }
      );
    }
   

    const { full_name, filiere, ecole, photo_url } = await req.json();
 console.log("📥 Payload reçu API :", { full_name, filiere, ecole, photo_url });
    // 🔹 Validation des champs obligatoires
    if (!full_name || !filiere || !ecole) {
      return new Response(
        JSON.stringify({ error: "Données manquantes" }),
        { status: 400 }
      );
    }

    // 🔹 Récupérer l'utilisateur
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

    // 🔹 Vérifier si le profil existe
    const { data: existingProfile, error: existingError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) throw existingError;
console.log("📥 Payload reçu API :", { full_name, filiere, ecole, photo_url });
console.log("🔹 User trouvé :", user);
console.log("🔹 Profil existant :", existingProfile);

    let data;
    if (existingProfile) {
      // Mettre à jour
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ full_name, filiere, ecole, photo_url })
        .eq("user_id", user.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;
      data = updatedProfile;
    } else {
      // Créer
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
