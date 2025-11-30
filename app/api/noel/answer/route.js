import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function POST(req) {
  try {
    const { question_id, user_code, answer } = await req.json();

    if (!question_id || !user_code || !answer) {
      return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("noel_answers")
      .insert({ question_id, user_code, answer })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
