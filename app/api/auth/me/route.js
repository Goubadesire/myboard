import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req) {
  try {
    // On récupère l'email envoyé en query (ou via header pour plus tard)
    const email = req.headers.get("email") // simplifié pour l'instant

    const { data: user, error } = await supabase
      .from("users")
      .select("name,email")
      .eq("email", email)
      .single()

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })

    return new Response(JSON.stringify({ user }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 })
  }
}
