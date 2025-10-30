import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const cleanedToken = token.trim();
    console.log("Token reçu :", token);

    // 1️⃣ Vérifie que token et password sont fournis
    if (!token || !password) {
      return new Response(JSON.stringify({ error: "Token et mot de passe requis" }), { status: 400 });
    }

    // 2️⃣ Recherche du token en base
    const { data: resetToken, error: tokenError } = await supabase
      .from("reset_tokens")
      .select("user_id, expires_at")
      .eq("token", cleanedToken)
      .single();

    if (tokenError || !resetToken) {
      return new Response(JSON.stringify({ error: "Token invalide" }), { status: 404 });
    }

    // Vérifie si le token a expiré
    if (new Date(resetToken.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Token expiré" }), { status: 400 });
    }

    // 3️⃣ Hash le nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 4️⃣ Mise à jour du mot de passe dans la table users
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", resetToken.user_id);

    if (updateError) {
      return new Response(JSON.stringify({ error: "Impossible de mettre à jour le mot de passe" }), { status: 500 });
    }

    // 5️⃣ Supprime le token après usage
    await supabase.from("reset_tokens").delete().eq("token", token);

    // 6️⃣ Réponse de succès
    return new Response(JSON.stringify({ message: "Mot de passe réinitialisé avec succès ✅" }), { status: 200 });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
  }
}
