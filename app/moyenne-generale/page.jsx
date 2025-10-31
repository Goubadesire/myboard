"use client";
import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function MoyennesPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchNotes();
  }, [sessionUser?.email]);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.notes) setNotes(data.notes);
      if (data.matieres) setMatieres(data.matieres);
      if (data.semestres) setSemestres(data.semestres);
    } catch (err) {
      console.error("Erreur fetch notes:", err);
    }
  };

  // Moyenne par matière (tous semestres)
  const getMoyenneByMatiere = (matiereId) => {
    const matiereNotes = notes.filter((n) => n.matiere.id === matiereId);
    const totalCoef = matiereNotes.reduce((sum, n) => sum + n.coefficient, 0);
    if (totalCoef === 0) return 0;
    const total = matiereNotes.reduce((sum, n) => sum + n.valeur * n.coefficient, 0);
    return (total / totalCoef).toFixed(2);
  };

  // Moyenne par semestre
  const getMoyenneBySemestre = (semestreId) => {
    const semestreNotes = notes.filter((n) => n.matiere.semestre.id === semestreId);
    const totalCoef = semestreNotes.reduce((sum, n) => sum + n.coefficient, 0);
    if (totalCoef === 0) return 0;
    const total = semestreNotes.reduce((sum, n) => sum + n.valeur * n.coefficient, 0);
    return (total / totalCoef).toFixed(2);
  };

  const getMoyenneStyle = (moyenne) => {
    if (moyenne < 10) return { color: "text-red-500", icon: <FaFrown className="inline ml-1" /> };
    if (moyenne < 14) return { color: "text-yellow-500", icon: <FaMeh className="inline ml-1" /> };
    return { color: "text-green-500", icon: <FaSmile className="inline ml-1" /> };
  };

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Moyennes Générales</h1>

        {/* Moyenne par matière */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {matieres.map((m) => {
            const moyenne = getMoyenneByMatiere(m.id);
            const { color, icon } = getMoyenneStyle(moyenne);

            return (
              <div key={m.id} className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                <div className="card-body p-5 flex flex-col">
                  <h2 className="card-title text-lg font-semibold text-primary">{m.nom}</h2>
                  <span className={`${color} font-semibold text-xl`}>
                    Moyenne générale: {moyenne} {icon}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Moyenne par semestre */}
        <h2 className="text-xl font-bold text-primary mb-4">Moyenne par Semestre</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {semestres.map((s) => {
            const moyenne = getMoyenneBySemestre(s.id);
            const { color, icon } = getMoyenneStyle(moyenne);

            return (
              <div key={s.id} className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                <div className="card-body p-5 flex flex-col">
                  <h2 className="card-title text-lg font-semibold text-primary">{s.nom}</h2>
                  <span className={`${color} font-semibold text-xl`}>
                    Moyenne: {moyenne} {icon}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
