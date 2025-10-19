"use client"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleChange = (e) => {
    const { name, value} = e.target
    if(name === 'name') setName(value)
    else if(name === 'email') setEmail(value)
    else if(name === 'password') setPassword(value)  
  }


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  } catch (err) {
    alert("Erreur serveur");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card shadow-md p-8 w-full max-w-sm bg-base-100">
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
        <input
          type="password"
          placeholder="Mot de passe"
          className="input input-bordered w-full mb-6"
          value={password}
          name="password"
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary w-full">Créer le compte</button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Deja inscrit ?{' '}
          <Link href="/login" className="text-primary font-semibold">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  )
}
