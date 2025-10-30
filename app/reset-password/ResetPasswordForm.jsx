"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  console.log("Token reçu:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!data.error) {
        toast.success("Mot de passe réinitialisé avec succès ✅");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.error || "Erreur lors de la réinitialisation");
      }
    } catch {
      toast.error("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <form onSubmit={handleSubmit} className="card shadow-md p-8 w-full max-w-sm bg-base-100 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Réinitialiser le mot de passe</h2>

        <label className="label">
          <span className="label-text">Nouveau mot de passe</span>
        </label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Entrez votre nouveau mot de passe"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="absolute inset-y-0 right-3" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <label className="label">
          <span className="label-text">Confirmer le mot de passe</span>
        </label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmez votre mot de passe"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="button" className="absolute inset-y-0 right-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "En cours…" : "Réinitialiser le mot de passe"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="text-info font-semibold">Se connecter</Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
}
