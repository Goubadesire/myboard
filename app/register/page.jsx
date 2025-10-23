"use client"
import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmed, setShowPasswordConfirmed] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "name") setName(value)
    else if (name === "email") setEmail(value)
    else if (name === "password") setPassword(value)
    else if (name === "confirmPassword") setConfirmPassword(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🔹 Vérification des mots de passe
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", { position: "top-center" })
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!data.error) {
        const user = data.data[0]

        localStorage.setItem("user", JSON.stringify({ email: user.email, name: user.name }))

        toast.success("Compte créé avec succès 🎉 Bienvenue !", {
          position: "top-center",
          autoClose: 1500,
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        toast.error(data.error || "Erreur lors de la création du compte", { position: "top-center" })
      }
    } catch (err) {
      toast.error("Erreur serveur", { position: "top-center" })
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card shadow-md p-8 w-full max-w-sm bg-base-100 relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>

        <label className="label">
          <span className="label-text">Nom</span>
        </label>
        <input
          type="text"
          placeholder="Entrer votre nom"
          className="input input-bordered w-full mb-4"
          value={name}
          name="name"
          onChange={handleChange}
        />

        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-4"
          value={email}
          name="email"
          onChange={handleChange}
          required
        />

        <label className="label">
          <span className="label-text">Mot de passe</span>
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className="input input-bordered w-full "
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3  flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <label className="label">
          <span className="label-text">Confirmer le mot de passe</span>
        </label>
        <div className="relative mb-6">
          <input
            type={showPasswordConfirmed ? "text" : "password"}
            placeholder="Confirmer le mot de passe"
            className="input input-bordered w-full mb-6"
            value={confirmPassword}
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 mb-6 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowPasswordConfirmed(!showPasswordConfirmed)}
            aria-label={showPasswordConfirmed ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPasswordConfirmed ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-full">Créer le compte</button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-primary font-semibold">
            Se connecter
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href='/home' className="text-info font-semibold">Accueil</Link>
        </p>

        {/* ✅ Toast Container React-Toastify */}
        <ToastContainer />
      </form>
    </div>
  )
}
