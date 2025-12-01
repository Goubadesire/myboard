import { createClient } from "@supabase/supabase-js";

let supabase = null;

export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // <-- ici

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase URL ou Service Role Key manquante. Vérifie tes variables d'environnement !"
      );
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }

  return supabase;
};
