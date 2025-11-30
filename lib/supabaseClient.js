// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabase;

export const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL ou Key manquante");
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};
