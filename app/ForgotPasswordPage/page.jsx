"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Veuillez entrer votre email", { position: "top-center" });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.error) {
        toast.success("Un lien de réinitialisation a été envoyé à votre email.", {
          position: "top-center",
          autoClose: 3000,
        });
        // Redirige vers la page de connexion après 3 secondes
        setTimeout(() => router.push("/login"), 3000);
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du lien", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Erreur serveur", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card shadow-md p-8 w-full max-w-sm bg-base-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Mot de passe oublié</h2>

        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="Entrez votre email"
          className="input input-bordered w-full mb-6"
          value={email}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? "Envoi en cours…" : "Envoyer le lien"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="text-primary font-semibold">
            Retour à la connexion
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
}
