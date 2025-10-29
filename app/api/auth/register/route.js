import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont obligatoires" }),
        { status: 400 }
      );
    }

    // 1️⃣ Vérifie si l'email existe déjà
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Cet email est déjà utilisé, essaye un autre." }),
        { status: 400 }
      );
    }

    // 2️⃣ Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Création de l'utilisateur
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) {
      console.error("💥 ERREUR SUPABASE :", error);
      return new Response(JSON.stringify({ error: "Impossible de créer l'utilisateur" }), { status: 400 });
    }

    console.log("✅ UTILISATEUR AJOUTÉ :", data);

    return new Response(
      JSON.stringify({ message: "Utilisateur créé avec succès", data }),
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 ERREUR SERVEUR :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur, réessaye plus tard" }),
      { status: 500 }
    );
  }
}
