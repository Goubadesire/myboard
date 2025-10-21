"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { FaCalendarAlt, FaProjectDiagram, FaGraduationCap } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [emplois, setEmplois] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [semestres, setSemestres] = useState([]);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);

    const fetchAll = async () => {
      try {
        const [dRes, eRes, mRes, nRes, sRes] = await Promise.all([
          fetch("/api/devoirs", { headers: { email: sessionUser.email } }),
          fetch("/api/emplois", { headers: { email: sessionUser.email } }),
          fetch("/api/matieres", { headers: { email: sessionUser.email } }),
          fetch("/api/notes", { headers: { email: sessionUser.email } }),
          fetch("/api/semestres", { headers: { email: sessionUser.email } }),
        ]);

        const [dData, eData, mData, nData, sData] = await Promise.all([
          dRes.json(),
          eRes.json(),
          mRes.json(),
          nRes.json(),
          sRes.json(),
        ]);

        if (dData.devoirs) setDevoirs(dData.devoirs);
        if (eData.emplois) setEmplois(eData.emplois);
        if (mData.matieres) setMatieres(mData.matieres);
        if (nData.notes) setNotes(nData.notes);
        if (sData.semestres) setSemestres(sData.semestres);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, [sessionUser?.email]);

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

  // Données du graphique
  const doughnutData = useMemo(() => {
    const colors = moyenneParMatiere.map(val => {
      if (val < 9) return "rgba(239, 68, 68, 0.9)"; // Rouge
      if (val < 12) return "rgba(251, 191, 36, 0.9)"; // Jaune
      return "rgba(34, 197, 94, 0.9)"; // Vert
    });

    return {
      labels: matieres.map(m => m.nom),
      datasets: [
        {
          label: "Moyenne par matière",
          data: moyenneParMatiere,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
    };
  }, [matieres, moyenneParMatiere]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 14,
            padding: 10,
            font: { size: 12 },
          },
        },
        title: {
          display: true,
          text: "Moyenne par matière",
          font: { size: 16 },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFont: { size: 14 },
          bodyFont: { size: 13 },
          callbacks: {
            label: context => `${context.label}: ${context.parsed} / 20`,
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    }),
    []
  );

  const today = new Date();
  const devoirsAvenir = useMemo(() => {
    return devoirs
      .filter(d => new Date(d.date_limite) >= today)
      .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
      .slice(0, 5);
  }, [devoirs]);

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Moyennes par semestre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(moyennesSemestres).map(([semestreId, moyenne]) => {
            const semestreNom =
              semestres.find(s => s.id === semestreId)?.nom || `Semestre ${semestreId}`;
            return (
              <div
                key={semestreId}
                className="card p-6 rounded-2xl shadow-lg bg-blue-50 flex items-center gap-4 hover:scale-105 transition-all duration-300 animate-fadeInUp"
              >
                <FaGraduationCap className="text-blue-700 text-3xl" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-1">
                    {semestreNom}
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">{moyenne} / 20</p>
                  <p className="text-sm text-blue-600 mt-1">Moyenne générale</p>
                </div>
              </div>
            );
          })}

          <div className="card p-6 rounded-2xl shadow-lg bg-green-50 flex items-center gap-4 hover:scale-105 transition-all duration-300 animate-fadeInUp">
            <FaGraduationCap className="text-green-700 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-1">Année</h3>
              <p className="text-2xl font-bold text-green-900">{moyenneAnnuelle} / 20</p>
              <p className="text-sm text-green-600 mt-1">Moyenne générale annuelle</p>
            </div>
          </div>
        </div>

        {/* Graphique & prochains devoirs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Graphique */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[380px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaProjectDiagram /> Moyenne par matière
            </h2>
            <div className="h-[300px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Prochains devoirs */}
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
                    className="p-3 bg-yellow-100 rounded-lg flex justify-between items-center hover:bg-yellow-200 transition-colors duration-200"
                  >
                    <div>
                      <div className="font-medium">{d.titre}</div>
                      <div className="text-xs text-yellow-700">{d.date_limite}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
