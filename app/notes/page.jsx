"use client";
import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaTrash, FaEdit, FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function NotesPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [valeur, setValeur] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target
    if(name === 'valeur') setValeur(value)
    else if(name === 'coefficient') setCoefficient(value) 
  }


  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchMatieres();
    fetchNotes();
  }, [sessionUser?.email]);

  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.matieres) setMatieres(data.matieres);
    } catch (err) {
      console.error("Erreur fetch matieres:", err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.notes) setNotes(data.notes);
    } catch (err) {
      console.error("Erreur fetch notes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valeur || !coefficient || !matiereId) return alert("Veuillez remplir toutes les données");

    setIsSubmitting(true); // 🔹 active le loading

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/notes?id=${currentNote.id}` : "/api/notes";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          email: sessionUser.email,
        },
        body: JSON.stringify({
          valeur: parseFloat(valeur),
          coefficient: parseFloat(coefficient),
          matiere_id: matiereId,
        }),
      });

      const data = await res.json();
      if (data.note) {
        if (isEditMode) {
          setNotes((prev) => prev.map((n) => (n.id === data.note.id ? data.note : n)));
        } else {
          setNotes((prev) => [...prev, data.note]);
        }
        resetModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    } finally {
      setIsSubmitting(false); // 🔹 désactive le loading
    }
  };

  const handleEdit = (note) => {
    setValeur(note.valeur);
    setCoefficient(note.coefficient);
    setMatiereId(note.matiere_id);
    setCurrentNote(note);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette note ?")) return;

    try {
      const res = await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
        headers: { email: sessionUser.email },
      });
      const data = await res.json();
      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  const resetModal = () => {
    setValeur("");
    setCoefficient("");
    setMatiereId("");
    setCurrentNote(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const notesByMatiere = useMemo(() => {
    const map = {};
    matieres.forEach((m) => {
      map[m.id] = notes.filter((n) => n.matiere_id === m.id);
    });
    return map;
  }, [matieres, notes]);

  const getMoyenneByMatiere = (matiere_id) => {
    const matiereNotes = notesByMatiere[matiere_id] || [];
    const totalCoef = matiereNotes.reduce((sum, n) => sum + n.coefficient, 0);
    if (totalCoef === 0) return 0;
    const total = matiereNotes.reduce((sum, n) => sum + n.valeur * n.coefficient, 0);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Mes Notes</h1>
          <button className="btn btn-primary rounded-xl shadow-sm" onClick={() => setIsModalOpen(true)}>
            Ajouter une note
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal}></div>
            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-80 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier la note" : "Nouvelle note"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select className="input input-bordered w-full" value={matiereId} onChange={(e) => setMatiereId(e.target.value)} required>
                  <option value="">Sélectionnez une matière</option>
                  {matieres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>

                <input type="number" placeholder="Valeur" className="input input-bordered w-full" value={valeur} name="valeur" onChange={handleChange} required />
                <input type="number" placeholder="Coefficient" className="input input-bordered w-full" value={coefficient} name="coefficient" onChange={handleChange} required />

                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="btn btn-ghost" onClick={resetModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary flex items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      isEditMode ? "Mettre à jour" : "Ajouter"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {matieres.map((m) => {
            const moyenne = getMoyenneByMatiere(m.id);
            const { color, icon } = getMoyenneStyle(moyenne);

            return (
              <div key={m.id} className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                <div className="card-body p-5 flex flex-col">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title text-lg font-semibold text-primary">{m.nom}</h2>
                    <span className={`${color} font-semibold`}>
                      Moyenne: {moyenne} {icon}
                    </span>
                  </div>

                  <div className="flex flex-col mt-3 gap-2">
                    {(notesByMatiere[m.id] || []).map((n) => (
                      <div key={n.id} className="flex justify-between items-center bg-base-200 p-2 rounded">
                        <span>{n.valeur} (coef {n.coefficient})</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(n)} className="btn btn-sm btn-outline btn-primary rounded-lg"><FaEdit /></button>
                          <button onClick={() => handleDelete(n.id)} className="btn btn-sm btn-outline btn-error rounded-lg"><FaTrash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
