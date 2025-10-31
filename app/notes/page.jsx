"use client";
import { useState, useEffect, useMemo } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import { FaTrash, FaEdit, FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function NotesPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [semesterSubjects, setSemesterSubjects] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [selectedSemestreId, setSelectedSemestreId] = useState("");
  const [modalSemestreId, setModalSemestreId] = useState("");
  const [matiereId, setMatiereId] = useState("");
  const [valeur, setValeur] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;
    setUser(sessionUser);
    fetchData();
  }, [sessionUser?.email]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/notes", { headers: { email: sessionUser.email } });
      const data = await res.json();
      if (data.notes) setNotes(data.notes);
      if (data.matieres) setSemesterSubjects(data.matieres);
      if (data.semestres) setSemestres(data.semestres);
    } catch (err) {
      console.error("Erreur fetchData:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "valeur") setValeur(value);
    if (name === "coefficient") setCoefficient(value);
  };

  const resetModal = () => {
    setValeur("");
    setCoefficient("");
    setMatiereId("");
    setModalSemestreId(selectedSemestreId || "");
    setCurrentNote(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valeur || !coefficient || !matiereId || !modalSemestreId) {
      return alert("Veuillez remplir toutes les données");
    }

    setIsSubmitting(true);
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `/api/notes?id=${currentNote.id}` : "/api/notes";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", email: sessionUser.email },
        body: JSON.stringify({
          valeur: parseFloat(valeur),
          coefficient: parseFloat(coefficient),
          matiere_id: matiereId,
          semestre_id: modalSemestreId,
        }),
      });

      const data = await res.json();
      if (data.note) {
        if (isEditMode) {
          setNotes(prev => prev.map(n => n.id === data.note.id ? data.note : n));
        } else {
          setNotes(prev => [...prev, data.note]);
        }
        resetModal();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setValeur(note.valeur);
    setCoefficient(note.coefficient);
    setMatiereId(note.matiere.id);
    setModalSemestreId(note.semestre.id);
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
        setNotes(prev => prev.filter(n => n.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Erreur handleDelete:", err);
    }
  };

  // Notes par matière + semestre
  const notesByMatiere = useMemo(() => {
    const map = {};
    semesterSubjects.forEach(ss => {
      const filteredNotes = notes.filter(
        n => n.matiere.id === ss.matiere.id && n.semestre.id === ss.semestre.id
      );
      map[`${ss.matiere.id}_${ss.semestre.id}`] = filteredNotes;
    });
    return map;
  }, [notes, semesterSubjects]);

  const getMoyenneByMatiere = (matiereId, semestreId) => {
    const matiereNotes = notesByMatiere[`${matiereId}_${semestreId}`] || [];
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
          <button className="btn btn-primary rounded-xl shadow-sm" onClick={() => { resetModal(); setIsModalOpen(true); }}>
            Ajouter une note
          </button>
        </div>

        {/* Sélection du semestre */}
        <div className="mb-6">
          <select
            className="input input-bordered w-full max-w-xs"
            value={selectedSemestreId}
            onChange={(e) => setSelectedSemestreId(e.target.value)}
          >
            <option value="">Sélectionnez un semestre</option>
            {semestres.map(s => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>
        </div>

        {/* Modal pour ajouter/modifier une note */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal}></div>
            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-80 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier la note" : "Nouvelle note"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <select
                  className="input input-bordered w-full"
                  value={modalSemestreId}
                  onChange={(e) => setModalSemestreId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un semestre</option>
                  {semestres.map(s => (
                    <option key={s.id} value={s.id}>{s.nom}</option>
                  ))}
                </select>

                <select
                  className="input input-bordered w-full"
                  value={matiereId}
                  onChange={(e) => setMatiereId(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une matière</option>
                  {semesterSubjects
                    .filter(ss => ss.semestre.id === modalSemestreId)
                    .map(ss => (
                      <option key={ss.matiere.id} value={ss.matiere.id}>{ss.matiere.nom}</option>
                    ))}
                </select>

                <input type="number" placeholder="Valeur" className="input input-bordered w-full" name="valeur" value={valeur} onChange={handleChange} required />
                <input type="number" placeholder="Coefficient" className="input input-bordered w-full" name="coefficient" value={coefficient} onChange={handleChange} required />

                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="btn btn-ghost" onClick={resetModal}>Annuler</button>
                  <button type="submit" className="btn btn-primary flex items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Envoi..." : isEditMode ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {semesterSubjects
            .filter(ss => ss.semestre.id === selectedSemestreId)
            .map(ss => {
              const moyenne = getMoyenneByMatiere(ss.matiere.id, ss.semestre.id);
              const { color, icon } = getMoyenneStyle(moyenne);
              const key = `${ss.matiere.id}_${ss.semestre.id}`;

              return (
                <div key={key} className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="card-body p-5 flex flex-col">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title text-lg font-semibold text-primary">{ss.matiere.nom}</h2>
                      <span className={`${color} font-semibold`}>
                        Moyenne: {moyenne} {icon}
                      </span>
                    </div>

                    <div className="flex flex-col mt-3 gap-2">
                      {(notesByMatiere[key] || []).map(n => (
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
