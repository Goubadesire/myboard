"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from "chart.js";
import { FaCalendarAlt, FaProjectDiagram, FaGraduationCap } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [citation, setCitation] = useState(null);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);

    const fetchAll = async () => {
      try {
        const [dRes, mRes, nRes, sRes] = await Promise.all([
          fetch("/api/devoirs", { headers: { email: sessionUser.email } }),
          fetch("/api/matieres", { headers: { email: sessionUser.email } }),
          fetch("/api/notes", { headers: { email: sessionUser.email } }),
          fetch("/api/semestres", { headers: { email: sessionUser.email } }),
        ]);

        const [dData, mData, nData, sData] = await Promise.all([
          dRes.json(),
          mRes.json(),
          nRes.json(),
          sRes.json(),
        ]);

        if (dData.devoirs) setDevoirs(dData.devoirs);
        if (mData.matieres) setMatieres(mData.matieres);
        if (nData.notes) setNotes(nData.notes);
        if (sData.semestres) setSemestres(sData.semestres);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, [sessionUser?.email]);

  useEffect(() => {
  const fetchCitation = async () => {
    try {
      const res = await fetch("/api/citations");
      const data = await res.json();
      setCitation(data);
    } catch (err) {
      console.error("Erreur citation :", err);
    }
  };

  fetchCitation(); // au chargement

  const interval = setInterval(fetchCitation, 3600000); // toutes les heures
  return () => clearInterval(interval);
}, []);


  // Moyennes par semestre
  const moyennesSemestres = useMemo(() => {
    const semestreMap = {};
    const semestreIds = [...new Set(matieres.map(m => m.semestre_id))];

    semestreIds.forEach(id => {
      const matieresSemestre = matieres.filter(m => m.semestre_id === id);
      let totalPondere = 0;
      let totalCoef = 0;

      matieresSemestre.forEach(m => {
        const notesMatiere = notes.filter(n => n.matiere_id === m.id);
        if (notesMatiere.length === 0) return;
        const totalNote = notesMatiere.reduce((sum, n) => sum + n.valeur, 0);
        const moyenneMatiere = totalNote / notesMatiere.length;

        totalPondere += moyenneMatiere * m.coefficient;
        totalCoef += m.coefficient;
      });

      semestreMap[id] = totalCoef === 0 ? 0 : parseFloat((totalPondere / totalCoef).toFixed(2));
    });

    return semestreMap;
  }, [matieres, notes]);

  const moyenneAnnuelle = useMemo(() => {
    const semIds = Object.keys(moyennesSemestres);
    if (semIds.length === 0) return 0;
    const total = semIds.reduce((sum, id) => sum + moyennesSemestres[id], 0);
    return parseFloat((total / semIds.length).toFixed(2));
  }, [moyennesSemestres]);

  // Moyenne par matière
  const moyenneParMatiere = useMemo(() => {
    return matieres.map(m => {
      const notesMatiere = notes.filter(n => n.matiere_id === m.id);
      if (notesMatiere.length === 0) return 0;
      const total = notesMatiere.reduce((sum, n) => sum + n.valeur, 0);
      return parseFloat((total / notesMatiere.length).toFixed(2));
    });
  }, [matieres, notes]);

  // Données du graphique en barre horizontale
  const barData = useMemo(() => {
    return {
      labels: matieres.map(m => m.nom),
      datasets: [
        {
          label: "Moyenne par matière",
          data: moyenneParMatiere,
          backgroundColor: moyenneParMatiere.map(val => {
            if (val < 9) return "rgba(239, 68, 68, 0.8)";
            if (val < 12) return "rgba(251, 191, 36, 0.8)";
            return "rgba(34, 197, 94, 0.8)";
          }),
        },
      ],
    };
  }, [matieres, moyenneParMatiere]);

  const barOptions = useMemo(() => ({
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Moyenne par matière", font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: context => `${context.parsed.x} / 20`,
        },
      },
    },
    scales: {
      x: { max: 20 },
    },
  }), []);

  const today = new Date();

  // Statut dynamique des devoirs
  const devoirsAvenir = useMemo(() => {
    return devoirs
      .map(d => {
        const deadline = new Date(d.date_limite);
        let status = "En cours";
        if (deadline < today) status = "En retard";
        if (d.termine) status = "Terminé"; // si tu gardes un champ terminé dans la BDD
        return { ...d, status };
      })
      .filter(d => new Date(d.date_limite) >= today || d.status === "En retard")
      .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
      .slice(0, 5);
  }, [devoirs]);

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Cartes moyennes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {Object.entries(moyennesSemestres).map(([semestreId, moyenne]) => {
            const semestreNom =
              semestres.find(s => s.id === semestreId)?.nom || `Semestre ${semestreId}`;
            return (
              <div
                key={semestreId}
                className="card p-6 rounded-2xl shadow-lg bg-blue-50 flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300 animate-fadeInUp"
              >
                <h3 className="text-lg font-semibold text-blue-700">{semestreNom}</h3>
                <p className="text-3xl font-bold text-blue-900">{moyenne}</p>
              </div>
            );
          })}

          {/* Moyenne annuelle */}
          <div className="card p-6 rounded-2xl shadow-lg bg-green-50 flex flex-col items-center gap-2 hover:scale-105 transition-all duration-300 animate-fadeInUp">
            <h3 className="text-lg font-semibold text-green-700">Année</h3>
            <p className="text-3xl font-bold text-green-900">{moyenneAnnuelle}</p>
          </div>
        </div>

        {/* Graphique & prochains devoirs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Graphique */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[380px]">
            <Bar data={barData} options={barOptions} />
          </div>

          {/* Prochains devoirs avec statut dynamique */}
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <FaCalendarAlt /> Prochains devoirs
            </h2>
            <ul className="flex flex-col gap-2">
              {devoirsAvenir.length === 0 ? (
                <li className="text-sm text-yellow-700">Aucun devoir à venir</li>
              ) : (
                devoirsAvenir.map(d => (
                  <li
                    key={d.id}
                    className={`p-3 rounded-lg flex justify-between items-center transition-colors duration-200
                      ${d.status === "En cours" ? "bg-yellow-100 hover:bg-yellow-200" : ""}
                      ${d.status === "En retard" ? "bg-red-100 hover:bg-red-200" : ""}
                      ${d.status === "Terminé" ? "bg-green-100 hover:bg-green-200" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-gray-600">{d.titre}</div>
                      <div className="text-xs text-gray-600">{d.date_limite}</div>
                    </div>
                    <div className={`text-xs font-semibold
                      ${d.status === "En cours" ? "text-yellow-800" : ""}
                      ${d.status === "En retard" ? "text-red-700" : ""}
                      ${d.status === "Terminé" ? "text-green-700" : ""}`}
                    >
                      {d.status}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          
        </div>
        {citation && (
            <div className="p-4 mt-6 bg-indigo-50 rounded-2xl shadow-lg text-center">
              <p className="italic text-indigo-700 text-lg">"{citation.texte}"</p>
              <p className="mt-2 font-semibold text-indigo-900">- {citation.auteur}</p>
            </div>
          )}
      </MainLayout>
    </AuthGuard>
  );
}
