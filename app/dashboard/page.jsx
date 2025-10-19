"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaPlus, FaTasks, FaCalendarAlt, FaProjectDiagram } from "react-icons/fa";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [emplois, setEmplois] = useState([]);
  const [matieres, setMatieres] = useState([]);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchDevoirs();
    fetchEmplois();
    fetchMatieres();
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

  // Stats calculées
  const totalDevoirs = devoirs.length;
  const devoirsEnCours = devoirs.filter(d => d.statut === "en cours").length;
  const devoirsEnRetard = devoirs.filter(d => d.statut === "en retard").length;

  // Graphique mock: nombre de devoirs par matière
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

  // Tâches à venir (prochains devoirs)
  const today = new Date();
  const devoirsAvenir = devoirs
    .filter(d => new Date(d.date_limite) >= today)
    .sort((a, b) => new Date(a.date_limite) - new Date(b.date_limite))
    .slice(0, 5);

  return (
    <AuthGuard>
      <MainLayout>
        <h1 className="text-2xl font-bold text-primary mb-6">Dashboard</h1>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-xl shadow flex items-center gap-4">
            <FaTasks className="text-blue-700 text-3xl" />
            <div>
              <div className="text-xl font-bold">{totalDevoirs}</div>
              <div className="text-sm text-gray-600">Total devoirs</div>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow flex items-center gap-4">
            <FaTasks className="text-green-700 text-3xl" />
            <div>
              <div className="text-xl font-bold">{devoirsEnCours}</div>
              <div className="text-sm text-gray-600">Devoirs en cours</div>
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow flex items-center gap-4">
            <FaTasks className="text-red-700 text-3xl" />
            <div>
              <div className="text-xl font-bold">{devoirsEnRetard}</div>
              <div className="text-sm text-gray-600">Devoirs en retard</div>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl shadow flex items-center gap-4">
            <FaCalendarAlt className="text-yellow-700 text-3xl" />
            <div>
              <div className="text-xl font-bold">{emplois.length}</div>
              <div className="text-sm text-gray-600">Créneaux planifiés</div>
            </div>
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
