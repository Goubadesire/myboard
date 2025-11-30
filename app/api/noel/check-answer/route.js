import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_code = searchParams.get("user_code");
  const question_id = searchParams.get("question_id");

  if (!user_code || !question_id) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("noel_answers")
    .select("*")
    .eq("user_code", user_code)
    .eq("question_id", question_id)
    .single();

  if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ hasAnswered: !!data });
}
