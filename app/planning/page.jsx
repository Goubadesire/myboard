"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function EmploiDuTempsPage() {
  const [user, setUser] = useState(null);
  const [emplois, setEmplois] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCreneau, setCurrentCreneau] = useState(null);
  const [jour, setJour] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [matiereId, setMatiereId] = useState("");

  const sessionUser = getUser();

  const colorClasses = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
  ];

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchMatieres();
  }, [sessionUser?.email]);

  useEffect(() => {
    if (matieres.length > 0) fetchEmplois();
  }, [matieres]);

  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.matieres) setMatieres(data.matieres);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmplois = async () => {
    try {
      const res = await fetch("/api/emplois", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.emplois) {
        // Précharger une couleur stable pour chaque créneau
        const emploisAvecCouleur = data.emplois.map((c) => {
          const matiereIndex = matieres.findIndex((m) => m.id === c.matiere_id);
          const color = matiereIndex !== -1 ? colorClasses[matiereIndex % colorClasses.length] : "bg-gray-100 text-gray-800";
          return { ...c, color };
        });
        setEmplois(emploisAvecCouleur);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jour || !heureDebut || !heureFin || !matiereId) return alert("Veuillez remplir toutes les données");

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/emplois?id=${currentCreneau.id}` : "/api/emplois";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", email: sessionUser.email },
        body: JSON.stringify({ jour, heure_debut: heureDebut, heure_fin: heureFin, matiere_id: matiereId }),
      });
      const data = await res.json();
      if (data.emploi) {
        const matiereIndex = matieres.findIndex((m) => m.id === data.emploi.matiere_id);
        const color = matiereIndex !== -1 ? colorClasses[matiereIndex % colorClasses.length] : "bg-gray-100 text-gray-800";
        const emploiAvecCouleur = { ...data.emploi, color };

        if (isEditMode) {
          setEmplois((prev) => prev.map((c) => (c.id === emploiAvecCouleur.id ? emploiAvecCouleur : c)));
        } else {
          setEmplois((prev) => [...prev, emploiAvecCouleur]);
        }
        resetModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (creneau) => {
    setJour(creneau.jour);
    setHeureDebut(creneau.heure_debut);
    setHeureFin(creneau.heure_fin);
    setMatiereId(creneau.matiere_id);
    setCurrentCreneau(creneau);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce créneau ?")) return;
    try {
      const res = await fetch(`/api/emplois?id=${id}`, { method: "DELETE", headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.success) setEmplois((prev) => prev.filter((c) => c.id !== id));
      else alert(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  const resetModal = () => {
    setJour("");
    setHeureDebut("");
    setHeureFin("");
    setMatiereId("");
    setCurrentCreneau(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const joursOrdre = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Emploi du Temps</h1>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Ajouter un créneau
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal}></div>
            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-80 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier le créneau" : "Nouveau créneau"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select className="input input-bordered w-full" value={jour} onChange={(e) => setJour(e.target.value)} required>
                  <option value="">Sélectionnez un jour</option>
                  {joursOrdre.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
                <input type="time" className="input input-bordered w-full" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required />
                <input type="time" className="input input-bordered w-full" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required />
                <select className="input input-bordered w-full" value={matiereId} onChange={(e) => setMatiereId(e.target.value)} required>
                  <option value="">Sélectionnez une matière</option>
                  {matieres.map((m) => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="btn btn-ghost" onClick={resetModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{isEditMode ? "Mettre à jour" : "Ajouter"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Agenda vertical par jour */}
        <div className="flex flex-col gap-6">
          {joursOrdre.map((j) => {
            const creneauxDuJour = emplois
              .filter((c) => c.jour === j)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

            return (
              <div
                key={j}
                className="border border-base-300 rounded-2xl p-4 bg-base-100 shadow-md"
              >
                <h2 className="text-lg font-semibold text-primary mb-3">{j}</h2>

                {creneauxDuJour.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun créneau</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {creneauxDuJour.map((c) => {
                      const heureDebutFormatted = c.heure_debut.slice(0, 5);
                      const heureFinFormatted = c.heure_fin.slice(0, 5);
                      const pointColor = c.color.split(" ")[0] || "bg-gray-300";

                      return (
                        <div
                          key={c.id}
                          className={`flex justify-between items-center p-3 rounded-lg border border-base-300 shadow-sm ${c.color}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${pointColor}`}></span>
                            <span className="font-medium">{heureDebutFormatted} - {heureFinFormatted}</span>
                            <span>: {matieres.find((m) => m.id === c.matiere_id)?.nom || "?"}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(c)} className="btn btn-sm btn-outline btn-primary rounded-lg">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-outline btn-error rounded-lg">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
