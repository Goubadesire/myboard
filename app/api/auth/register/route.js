import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Tous les champs sont obligatoires" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) {
      console.error("💥 ERREUR SUPABASE :", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    console.log("✅ UTILISATEUR AJOUTÉ :", data);

    // ✅ Retour JSON correct
    return new Response(JSON.stringify({ message: "Utilisateur créé avec succès", data }), { status: 200 });

  } catch (error) {
    console.error("💥 ERREUR SERVEUR :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}