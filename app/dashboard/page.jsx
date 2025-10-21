"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaCalendarAlt, FaProjectDiagram } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [emplois, setEmplois] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [semestres, setSemestres] = useState([]); // <-- nouvelle state pour les semestres

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchDevoirs();
    fetchEmplois();
    fetchMatieres();
    fetchNotes();
    fetchSemestres(); // <-- récupère les semestres
  }, [sessionUser?.email]);

  const fetchDevoirs = async () => {
    try {
      const res = await fetch("/api/devoirs", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.devoirs) setDevoirs(data.devoirs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmplois = async () => {
    try {
      const res = await fetch("/api/emplois", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.emplois) setEmplois(data.emplois);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.matieres) setMatieres(data.matieres);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.notes) setNotes(data.notes);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSemestres = async () => {
    try {
      const res = await fetch("/api/semestres", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.semestres) setSemestres(data.semestres);
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 Optimisation : calcul des moyennes
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

  // Graphique : devoirs par matière
  const matieresLabels = matieres.map(m => m.nom);
  const matieresData = matieres.map(m => devoirs.filter(d => d.matiere_id === m.id).length);

  const barData = {
    labels: matieresLabels,
    datasets: [
      {
        label: "Nombre de devoirs",
        data: matieresData,
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  // Tâches à venir
  const today = new Date();
  const devoirsAvenir = devoirs
    .filter(d => new Date(d.date_limite) >= today)
    .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
    .slice(0, 5);

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Moyennes par semestre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {Object.entries(moyennesSemestres).map(([semestreId, moyenne]) => {
            const semestreNom = semestres.find(s => s.id === semestreId)?.nom || `Semestre ${semestreId}`;
            return (
              <div key={semestreId} className="card p-4 bg-base-100 rounded-xl shadow">
                <h3 className="font-semibold text-lg"><span>Semestre</span> {semestreNom}</h3>
                <p>Moyenne générale: {moyenne}</p>
              </div>
            );
          })}

          <div className="card p-4 bg-base-100 rounded-xl shadow">
            <h3 className="font-semibold text-lg">Année</h3>
            <p>Moyenne générale annuelle: {moyenneAnnuelle}</p>
          </div>
        </div>

        {/* Graphique & tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-base-100 p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-primary mb-3">Devoirs par matière</h2>
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="bg-base-100 p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-primary mb-3">Prochains devoirs</h2>
            <ul className="flex flex-col gap-2">
              {devoirsAvenir.length === 0 ? (
                <li className="text-sm text-gray-500">Aucun devoir à venir</li>
              ) : (
                devoirsAvenir.map(d => (
                  <li key={d.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-medium">{d.titre}</div>
                      <div className="text-xs text-gray-600">{d.date_limite}</div>
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
