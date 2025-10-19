"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function DevoirsPage() {
  const [user, setUser] = useState(null);
  const [devoirs, setDevoirs] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDevoir, setCurrentDevoir] = useState(null);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateLimite, setDateLimite] = useState("");
  const [statut, setStatut] = useState("en cours");
  const [matiereId, setMatiereId] = useState("");

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchMatieres();
    fetchDevoirs();
  }, [sessionUser?.email]);

  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.matieres) setMatieres(data.matieres);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDevoirs = async () => {
    try {
      const res = await fetch("/api/devoirs", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.devoirs) setDevoirs(data.devoirs);
    } catch (err) {
      console.error(err);
    }
  };

  const resetModal = () => {
    setTitre("");
    setDescription("");
    setDateLimite("");
    setStatut("en cours");
    setMatiereId("");
    setCurrentDevoir(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre || !description || !dateLimite || !matiereId) return alert("Veuillez remplir tous les champs");

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/devoirs?id=${currentDevoir.id}` : "/api/devoirs";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", email: sessionUser.email },
        body: JSON.stringify({ titre, description, date_limite: dateLimite, statut, matiere_id: matiereId }),
      });
      const data = await res.json();
      if (data.devoir) {
        if (isEditMode) {
          setDevoirs((prev) => prev.map((d) => (d.id === data.devoir.id ? data.devoir : d)));
        } else {
          setDevoirs((prev) => [...prev, data.devoir]);
        }
        resetModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (devoir) => {
    setTitre(devoir.titre);
    setDescription(devoir.description);
    setDateLimite(devoir.date_limite);
    setStatut(devoir.statut);
    setMatiereId(devoir.matiere_id);
    setCurrentDevoir(devoir);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce devoir ?")) return;
    try {
      const res = await fetch(`/api/devoirs?id=${id}`, { method: "DELETE", headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.success) setDevoirs((prev) => prev.filter((d) => d.id !== id));
      else alert(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  const colorClasses = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
  ];

  const statutColors = {
    "en cours": "bg-blue-100 text-blue-800",
    "terminé": "bg-green-100 text-green-800",
    "en retard": "bg-red-100 text-red-800",
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Devoirs</h1>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Ajouter un devoir
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal}></div>
            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-96 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier le devoir" : "Nouveau devoir"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="text" className="input input-bordered w-full" placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                <textarea className="input input-bordered w-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="date" className="input input-bordered w-full" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} required />
                <select className="input input-bordered w-full" value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="en cours">En cours</option>
                  <option value="terminé">Terminé</option>
                  <option value="en retard">En retard</option>
                </select>
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

        {/* Liste des devoirs */}
        <div className="grid md:grid-cols-2 gap-4">
          {devoirs.map((d, i) => {
            const matiere = matieres.find((m) => m.id === d.matiere_id);
            const color = matiere ? colorClasses[matiere.id % colorClasses.length] : "bg-gray-100 text-gray-800";
            const statutColor = statutColors[d.statut] || "bg-gray-200 text-gray-800";

            return (
              <div key={d.id} className={`relative flex flex-col p-4 rounded-xl border border-base-300 shadow hover:shadow-lg transition-shadow duration-200 ${color}`}>
                {/* Badge statut */}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${statutColor}`}>
                  {d.statut}
                </span>

                <div className="font-bold text-lg mb-1">{d.titre}</div>
                <div className="text-sm mb-2">{d.description}</div>
                <div className="text-xs text-gray-600 mb-2">{d.date_limite} - {matiere?.nom || "?"}</div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => handleEdit(d)} className="btn btn-sm btn-outline btn-primary rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(d.id)} className="btn btn-sm btn-outline btn-error rounded-lg"><FaTrash /></button>
                </div>
              </div>
            );
          })}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
