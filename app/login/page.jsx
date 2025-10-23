"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "email") setEmail(value)
    else if (name === "password") setPassword(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ email: data.user.email, name: data.user.name }))
        router.push("/dashboard") // redirection si login OK
      } else {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage("Erreur serveur")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card shadow-md p-8 w-full max-w-sm bg-base-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>

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
            className="input input-bordered w-full mb-6"
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
          <button
            type='button'
           className="absolute inset-y-0 right-3 mb-6 flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
           >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}

          </button>
        </div>
        

        <button type="submit" className="btn btn-primary w-full">Se connecter</button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore inscrit ?{' '}
          <Link href="/register" className="text-primary font-semibold">
            S'inscrire
          </Link>
        </p>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href='/home' className="text-info font-semibold">Accueil</Link>
        </p>
      </form>
    </div>
  )
}
