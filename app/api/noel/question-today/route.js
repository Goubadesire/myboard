import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function GET() {
  try {
    const { data: questions, error } = await supabase
      .from("noel_questions")
      .select("*")
      .order("id");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!questions || questions.length === 0) return NextResponse.json({ question: null });

    const today = new Date();
    const dayIndex = (today.getDate() + today.getMonth() + today.getFullYear()) % questions.length;

    return NextResponse.json({ question: questions[dayIndex] });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
