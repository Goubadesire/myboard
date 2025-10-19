"use client"
import { useState, useEffect } from "react"
import MainLayout from "../components/mainLayout"
import AuthGuard from "../components/AuthGuard"
import { getUser } from "@/lib/session"
import { FaTrash, FaEdit } from "react-icons/fa"

export default function SemestrePage() {
  const [semestres, setSemestres] = useState([])
  const [nom, setNom] = useState("")
  const [annee, setAnnee] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentSemestre, setCurrentSemestre] = useState(null)

  const user = getUser()

  useEffect(() => {
    if (!user) return
    const fetchSemestres = async () => {
      try {
        const res = await fetch("/api/semestres", {
          headers: { email: user.email }
        })
        if (!res.ok) throw new Error("Impossible de récupérer les semestres")
        const data = await res.json()
        if (data.semestres) setSemestres(data.semestres)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSemestres()
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nom || !annee) return

    const method = isEditMode ? "PUT" : "POST"
    const url = isEditMode
      ? `/api/semestres?id=${currentSemestre.id}`
      : "/api/semestres"

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        email: user.email
      },
      body: JSON.stringify({ nom, annee: parseInt(annee) })
    })

    const data = await res.json()
    if (data.semestre) {
      if (isEditMode) {
        setSemestres(prev =>
          prev.map(s => (s.id === data.semestre.id ? data.semestre : s))
        )
      } else {
        setSemestres(prev => [...prev, data.semestre])
      }
      setNom("")
      setAnnee("")
      setIsModalOpen(false)
      setIsEditMode(false)
      setCurrentSemestre(null)
    } else {
      alert(data.error)
    }
  }

  const handleEdit = (semestre) => {
    setNom(semestre.nom)
    setAnnee(semestre.annee)
    setCurrentSemestre(semestre)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce semestre ?")) return

    const res = await fetch(`/api/semestres?id=${id}`, {
      method: "DELETE",
      headers: { email: user.email }
    })

    const data = await res.json()
    if (data.success) {
      setSemestres(prev => prev.filter(s => s.id !== id))
    } else {
      alert(data.error)
    }
  }

  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Mes Semestres</h1>
          <button
            className="btn btn-primary rounded-xl shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Ajouter un semestre
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setIsModalOpen(false)
                setIsEditMode(false)
                setCurrentSemestre(null)
                setNom("")
                setAnnee("")
              }}
            ></div>

            <div className="relative z-50 bg-base-100 p-6 rounded-2xl shadow-xl w-80 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-center text-primary">
                {isEditMode ? "Modifier le semestre" : "Nouveau Semestre"}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nom"
                  className="input input-bordered w-full"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Année"
                  className="input input-bordered w-full"
                  value={annee}
                  onChange={e => setAnnee(e.target.value)}
                  required
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsModalOpen(false)
                      setIsEditMode(false)
                      setCurrentSemestre(null)
                      setNom("")
                      setAnnee("")
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditMode ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des semestres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {semestres.map(s => (
            <div
              key={s.id}
              className="card w-full sm:w-72 bg-base-100 border border-base-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="card-body p-5 flex flex-col justify-between">
                <div>
                  <h2 className="card-title text-lg font-semibold text-primary">
                    {s.nom}
                  </h2>
                  <p className="text-sm text-gray-500">Année : {s.annee}</p>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(s)}
                    className="btn btn-sm btn-outline btn-primary rounded-lg"
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
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
  )
}
