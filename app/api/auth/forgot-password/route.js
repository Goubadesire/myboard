import { getSupabaseClient } from "@/lib/supabaseClient";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  const supabase = getSupabaseClient(); // ✅ récupère le client Supabase

  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "Email requis" }), { status: 400 });

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ message: "Si cet email existe, un lien a été envoyé." }), { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    await supabase.from("reset_tokens").delete().eq("user_id", user.id);
    await supabase.from("reset_tokens").insert([{ user_id: user.id, email: user.email, token, expires_at }]);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

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

    return new Response(JSON.stringify({ message: "Email envoyé si le compte existe ✅" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
