"use client";

import { useState, useEffect } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaGraduationCap, FaSchool } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    filiere: "",
    ecole: "",
    photo_url: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const sessionUser = getUser();

  useEffect(() => {
    if (!sessionUser) return;

    setUser(sessionUser);

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profiles", { headers: { email: sessionUser.email } });
        const data = await res.json();

        if (data.profile) {
          setProfile({
            full_name: data.profile.full_name || "",
            filiere: data.profile.filiere || "",
            ecole: data.profile.ecole || "",
            photo_url: data.profile.photo_url || "",
          });
          setPreviewUrl(data.profile.photo_url || null);
        }
      } catch (err) {
        setMessage("Erreur fetch profil: " + err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.full_name || !profile.filiere || !profile.ecole) {
      return alert("Veuillez remplir tous les champs");
    }

    setIsSubmitting(true);

    try {
      let photo_url = profile.photo_url;

      if (photoFile) {
        setLoadingUpload(true);
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadRes = await fetch(`/api/profiles/upload?email=${sessionUser.email}`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Erreur upload");

        photo_url = uploadData.url;
        setLoadingUpload(false);
      }

      const res = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          email: sessionUser.email,
        },
        body: JSON.stringify({ ...profile, photo_url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur mise à jour profil");

      setProfile(data.profile);
      setPreviewUrl(data.profile.photo_url || null);
      setPhotoFile(null);

      toast.success("Profil mis à jour !");
    } catch (err) {
      console.error("❌ Erreur profil :", err);
      toast.error(err.message);
      setLoadingUpload(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <MainLayout>
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Mon Profil</h1>

        {message && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-center">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* 🔹 Carte infos du profil */}
          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center gap-4">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Photo de profil"
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                ?
              </div>
            )}
            <div className="text-center space-y-2">
              <p className="flex items-center justify-center gap-2">
                <FaUser size={20} color="#27ae60"/> <span>{profile.full_name || "-"}</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaGraduationCap size={20} color="#3f51b5"/> <span>{profile.filiere || "-"}</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaSchool size={20} color="#e34234"/> <span>{profile.ecole || "-"}</span>
              </p>
            </div>
          </div>

          {/* 🔹 Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4 border border-gray-200">
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Photo de profil"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300"
                />
              </div>
            )}

            <label>
              Nom complet
              <input
                type="text"
                name="full_name"
                value={profile.full_name}
                onChange={handleInputChange}
                className="input input-bordered w-full mt-1"
                required
              />
            </label>

            <label>
              Filière
              <input
                type="text"
                name="filiere"
                value={profile.filiere}
                onChange={handleInputChange}
                className="input input-bordered w-full mt-1"
                required
              />
            </label>

            <label>
              École
              <input
                type="text"
                name="ecole"
                value={profile.ecole}
                onChange={handleInputChange}
                className="input input-bordered w-full mt-1"
                required
              />
            </label>

            <label>
              Photo de profil
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="input input-bordered w-full mt-1"
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary flex items-center justify-center gap-2 mt-2"
              disabled={isSubmitting || loadingUpload}
            >
              {isSubmitting || loadingUpload ? "En cours..." : "Mettre à jour"}
            </button>
          </form>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
