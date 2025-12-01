// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;        // pas NEXT_PUBLIC
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // clé serveur sécurisée

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL ou Service Role Key manquante !");
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey);
