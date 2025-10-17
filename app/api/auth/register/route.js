import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Récupérer les données du formulaire
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe avant insertion
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans Supabase
    const { data, error } = await supabase
      .from("users") // Vérifie bien le nom exact de ta table
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      console.error("💥 ERREUR SUPABASE COMPLETE :", error); // 🔥 log complet Supabase
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ UTILISATEUR AJOUTÉ :", data);
    return Response.json({ message: "Utilisateur créé avec succès", data });
  } catch (error) {
    console.error("💥 ERREUR SERVEUR COMPLETE :", error); // 🔥 log complet serveur
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
