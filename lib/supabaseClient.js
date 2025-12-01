// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabase = null;

// Fonction pour obtenir le client Supabase de manière sécurisée
export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase URL ou ANON KEY manquante. Vérifie tes variables d'environnement !"
      );
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
};
