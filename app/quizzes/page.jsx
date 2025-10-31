"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function QuizPage() {
  const [user, setUser] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [matiereId, setMatiereId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchFilieres();
  }, [sessionUser?.email]);

  const fetchFilieres = async () => {
    const res = await fetch("/api/filieres", { headers: { email: sessionUser.email } });
    const data = await res.json();
    if (data.filieres) setFilieres(data.filieres);
  };

  const fetchQuizzes = async (matiereId) => {
    const res = await fetch(`/api/quizzes?matiereId=${matiereId}`);
    const data = await res.json();
    if (data.quizzes) setQuizzes(data.quizzes);
  };

  const fetchQuizData = async (quizId) => {
    const res = await fetch(`/api/quizzes/${quizId}`);
    const data = await res.json();
    if (data.quiz) setQuizData(data.quiz);
  };

  const handleNext = async () => {
    const question = quizData.questions[currentQuestionIndex];

    // envoyer réponse à l'API
    await fetch(`/api/quizzes/${quizId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        question_id: question.id,
        answer: selectedAnswer,
      }),
    });

    // augmenter score si correct
    if (selectedAnswer === question.reponse_correcte) {
      setScore((prev) => prev + 1);
    }

    setSelectedAnswer("");

    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // terminer le quiz
      await fetch(`/api/quizzes/${quizId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      setFinished(true);
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Quiz</h1>

        {!quizData && (
          <div className="flex flex-col gap-4">
            {/* Sélection filière */}
            <select
              className="input input-bordered w-72"
              value={matiereId}
              onChange={(e) => {
                setMatiereId(e.target.value);
                fetchQuizzes(e.target.value);
              }}
            >
              <option value="">Sélectionnez une filière</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>

            {/* Sélection quiz */}
            {quizzes.length > 0 && (
              <select
                className="input input-bordered w-72"
                value={quizId}
                onChange={(e) => {
                  setQuizId(e.target.value);
                  fetchQuizData(e.target.value);
                }}
              >
                <option value="">Sélectionnez un quiz</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>{q.titre}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Quiz questions */}
        {quizData && !finished && (
          <div className="bg-base-100 p-6 rounded-2xl shadow-md w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">{quizData.titre}</h2>
            <p className="mb-3">
              Question {currentQuestionIndex + 1} / {quizData.questions.length}
            </p>
            <div className="flex flex-col gap-3">
              {quizData.questions[currentQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`btn btn-outline text-left w-full ${selectedAnswer === opt ? "btn-primary" : ""}`}
                  onClick={() => setSelectedAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary mt-4"
              disabled={!selectedAnswer}
              onClick={handleNext}
            >
              {currentQuestionIndex + 1 === quizData.questions.length ? "Terminer" : "Suivant"}
            </button>
          </div>
        )}

        {/* Résultat */}
        {finished && (
          <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-3">Quiz terminé !</h2>
            <p className="text-lg">Score : {score} / {quizData.questions.length}</p>
            <div className="text-4xl mt-3">
              {score / quizData.questions.length >= 0.5 ? <FaCheckCircle className="text-green-600 mx-auto" /> : <FaTimesCircle className="text-red-600 mx-auto" />}
            </div>
          </div>
        )}
      </MainLayout>
    </AuthGuard>
  );
}
