import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  const { quizId } = params;

  try {
    const { data: questions, error } = await supabase
      .from("quizzes")
      .select(`
        id,
        titre,
        questions:quizzes_questions(id, question, options)
      `)
      .eq("id", quizId)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ quiz: questions });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
