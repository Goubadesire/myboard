import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req, { params }) {
  const { quizId } = params;
  const { user_id } = await req.json();

  try {
    // Calculer le score
    const { data: answers, error } = await supabase
      .from("user_quiz_answers")
      .select("is_correct")
      .eq("user_id", user_id)
      .eq("quiz_id", quizId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const total = answers.length;
    const correct = answers.filter(a => a.is_correct).length;
    const score = total === 0 ? 0 : (correct / total) * 20;

    // Mettre à jour ou créer le résultat
    const { data: result, error: upsertError } = await supabase
      .from("user_quiz_results")
      .upsert([{ user_id, quiz_id: quizId, score, completed_at: new Date() }], { onConflict: ["user_id", "quiz_id"] })
      .select()
      .single();

    if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 400 });

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
