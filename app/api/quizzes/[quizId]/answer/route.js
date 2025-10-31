import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req, { params }) {
  const { quizId } = params;
  const { user_id, question_id, answer } = await req.json();

  try {
    // Vérifier si la réponse est correcte
    const { data: question, error } = await supabase
      .from("quizzes_questions")
      .select("reponse_correcte")
      .eq("id", question_id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const is_correct = question.reponse_correcte === answer;

    // Enregistrer la réponse
    const { data, error: insertError } = await supabase
      .from("user_quiz_answers")
      .insert([{ user_id, quiz_id: quizId, question_id, answer, is_correct }])
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

    return NextResponse.json({ answer: data, is_correct });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
