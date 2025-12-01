// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// --- Variables d'environnement ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Vérification rapide ---
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL ou ANON KEY manquante. Vérifie tes variables d'environnement !"
  );
}

// --- Client public (côté client ou serveur) ---
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Client admin (côté serveur seulement) ---
export const supabaseAdmin = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Supabase Service Role Key manquante ! Utile uniquement côté serveur."
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
};
