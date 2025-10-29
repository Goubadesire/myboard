"use client";

import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function MatieresPage() {
  const [matieres, setMatieres] = useState([]);
  const [nom, setNom] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [semestres, setSemestres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMatiere, setCurrentMatiere] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nom") setNom(value);
    else if (name === "coefficient") setCoefficient(value);
  };

  const user = useMemo(() => getUser(), []);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchSemestres(), fetchMatieres()]);
  }, [user]);

  const fetchSemestres = async () => {
    try {
      const res = await fetch("/api/semestres", { headers: { email: user.email } });
      if (!res.ok) throw new Error("Impossible de récupérer les semestres");
      const data = await res.json();
      if (data.semestres) setSemestres(data.semestres);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres", { headers: { email: user.email } });
      if (!res.ok) throw new Error("Impossible de récupérer les matières");
      const data = await res.json();
      if (data.matieres) setMatieres(data.matieres);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom || !coefficient || !semestreId) return alert("Veuillez remplir toutes les données");
    setIsLoading(true);

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/matieres?id=${currentMatiere.id}` : "/api/matieres";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          email: user.email
        },
        body: JSON.stringify({ nom, coefficient: parseFloat(coefficient), semestre_id: semestreId })
      });

      const data = await res.json();
      if (data.matiere) {
        await fetchMatieres();
        closeModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (matiere) => {
    setNom(matiere.nom);
    setCoefficient(matiere.coefficient);
    setSemestreId(matiere.semestre_id);
    setCurrentMatiere(matiere);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette matière ?")) return;
    try {
      const res = await fetch(`/api/matieres?id=${id}`, {
        method: "DELETE",
        headers: { email: user.email }
      });
      const data = await res.json();
      if (data.success) {
        setMatieres(prev => prev.filter(m => m.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentMatiere(null);
    setNom("");
    setCoefficient("");
    setSemestreId("");
  };

  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Mes Matières</h1>
          <button
            className="btn btn-primary rounded-xl shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter une matière
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-80 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier la matière" : "Nouvelle matière"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nom"
                  className="input input-bordered w-full"
                  value={nom}
                  name="nom"
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Coefficient"
                  className="input input-bordered w-full"
                  value={coefficient}
                  name="coefficient"
                  onChange={handleChange}
                  required
                />
                <select
                  className="input input-bordered w-full"
                  value={semestreId}
                  onChange={e => setSemestreId(e.target.value)}
                  required
                >
                  <option value="">Choisir un semestre</option>
                  {semestres.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nom} ({s.annee})
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={closeModal}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary flex items-center justify-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                    {isEditMode ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des matières */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {matieres.map(m => (
            <div
              key={m.id}
              className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="card-body p-5 flex flex-col justify-between">
                <div>
                  <h2 className="card-title text-lg font-semibold text-primary">
                    {m.nom}
                  </h2>
                  <p className="text-sm text-gray-500">Coefficient : {m.coefficient}</p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(m)}
                    className="btn btn-sm btn-outline btn-primary rounded-lg"
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="btn btn-sm btn-outline btn-error rounded-lg"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
