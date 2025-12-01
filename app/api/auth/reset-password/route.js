// /app/api/auth/reset-password/route.js
import { getSupabaseClient } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const supabase = getSupabaseClient(); // ✅ récupère le client dynamiquement
  try {
    const { token, password } = await req.json();
    const cleanedToken = token?.trim();
    console.log("Token reçu :", token);

    if (!token || !password) {
      return new Response(JSON.stringify({ error: "Token et mot de passe requis" }), { status: 400 });
    }

    // 🔹 Recherche du token
    const { data: resetToken, error: tokenError } = await supabase
      .from("reset_tokens")
      .select("user_id, expires_at")
      .eq("token", cleanedToken)
      .single();

    if (tokenError || !resetToken) {
      return new Response(JSON.stringify({ error: "Token invalide" }), { status: 404 });
    }

    if (new Date(resetToken.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Token expiré" }), { status: 400 });
    }

    // 🔹 Hash du nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 🔹 Mise à jour du mot de passe
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", resetToken.user_id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Impossible de mettre à jour le mot de passe" }), { status: 500 });
    }

    // 🔹 Suppression du token
    await supabase.from("reset_tokens").delete().eq("token", cleanedToken);

    return new Response(JSON.stringify({ message: "Mot de passe réinitialisé avec succès ✅" }), { status: 200 });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
  }
}
