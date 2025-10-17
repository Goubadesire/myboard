"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        <input
          type="password"
          placeholder="Mot de passe"
          className="input input-bordered w-full mb-6"
          value={password}
          name="password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary w-full">Se connecter</button>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </form>
    </div>
  )
}
