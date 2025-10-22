"use client";
import { IoMdExit } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { clearUser, getUser } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ImExit } from "react-icons/im";
import { FaUser } from "react-icons/fa";

export default function Header({ onMenuClick }) {
  const [userPhoto, setUserPhoto] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef();

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    fetch("/api/profiles", {
      headers: { email: user.email },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profile?.photo_url) setUserPhoto(data.profile.photo_url);
      })
      .catch(() => setUserPhoto(null));

    // 🔹 Fermer le menu si clic à l'extérieur
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  return (
    <header className="w-full bg-base-100 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      {/* Section gauche : menu burger + titre */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden btn btn-ghost btn-sm"
          aria-label="Open sidebar"
        >
          <FiMenu size={22} />
        </button>
        <h1 className="text-2xl font-bold text-primary">StudentBoard</h1>
      </div>

      {/* Section droite : photo + popover */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 transition-transform duration-150 hover:scale-105"
        >
          {userPhoto ? (
            <img
              src={userPhoto}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-base-300" />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20 animate-fadeIn">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/profiles");
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <span><FaUser size={20} color="#ff69b4"/></span> Profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <span><ImExit size={20} color="#ff0000"/></span> Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
