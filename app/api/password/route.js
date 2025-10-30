// /pages/api/password/forgot.js
import { supabase } from "@/lib/supabaseClient";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  try {
    // 1️⃣ Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      // ⚠ On ne dit pas si l'utilisateur existe pour la sécurité
      return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
    }

    // 2️⃣ Générer un token sécurisé
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1h

    // 3️⃣ Insérer le token dans la table password_resets
    const { error: insertError } = await supabase.from("password_resets").insert({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: "Impossible de créer le token." });
    }

    // 4️⃣ Préparer le lien de réinitialisation
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/password/reset?token=${token}`;

    // 5️⃣ TODO: Envoyer l'email via ton service SMTP (Mailtrap, SendGrid, etc.)
    // Exemple pseudo-code :
    // await sendEmail(user.email, "Réinitialisation du mot de passe", `Cliquez ici pour réinitialiser : ${resetLink}`);

    // 6️⃣ Réponse
    return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
