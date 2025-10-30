import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";
import { transporter } from "@/lib/email"; // on utilise le transporteur Gmail

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "L'email est requis" }), { status: 400 });
    }

    // Vérifie si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Aucun compte trouvé avec cet email" }), { status: 404 });
    }

    // Génère un token unique et une date d’expiration (30 min)
    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Supprime les anciens tokens
    await supabase.from("reset_tokens").delete().eq("user_id", user.id);

    // Insère le nouveau token
    await supabase.from("reset_tokens").insert([{ user_id: user.id, token, expires_at }]);

    // Prépare le lien de réinitialisation
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')}/reset-password?token=${token}`;
    console.log("Reset link:", resetLink);


    // Envoi l’email
    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">Réinitialiser mon mot de passe</a>
        <p>⚠️ Ce lien expirera dans 30 minutes.</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Email envoyé avec succès ✅" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur interne du serveur" }), { status: 500 });
  }
}
