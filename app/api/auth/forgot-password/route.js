import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // --- Debug variables d'environnement ---
    console.log("EMAIL:", process.env.SMTP_EMAIL);
    console.log("PASS:", process.env.SMTP_PASSWORD ? "SET" : "EMPTY");
    console.log("HOST:", process.env.SMTP_HOST);
    console.log("PORT:", process.env.SMTP_PORT);

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

    // --- Supprime les anciens tokens et log ---
    const { data: deleted, error: deleteError } = await supabase
      .from("reset_tokens")
      .delete()
      .eq("user_id", user.id);

    console.log("Tokens supprimés :", deleted, "Erreur suppression :", deleteError);

    // --- Insère le nouveau token et log ---
    const { data: inserted, error: insertError } = await supabase
      .from("reset_tokens")
      .insert([{ user_id: user.id,email:user.email,  token, expires_at }]);

    console.log("Token inséré :", inserted, "Erreur insertion :", insertError);

    if (insertError) {
      return new Response(JSON.stringify({ error: "Impossible de créer le token" }), { status: 500 });
    }

    // Prépare le lien de réinitialisation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // --- Création du transporteur Nodemailer ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true si port 465
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Envoi de l’email
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
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
