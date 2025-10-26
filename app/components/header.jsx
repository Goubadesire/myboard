"use client";
import { IoMdExit } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { clearUser, getUser } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ImExit } from "react-icons/im";
import { FaUser, FaMoon, FaSun } from "react-icons/fa";

export default function Header({ onMenuClick, toggleTheme, theme }) {
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

      {/* Section droite : bouton dark mode + photo + popover */}
      <div className="flex items-center gap-4">
        {/* Toggle dark mode */}
        <button
          onClick={toggleTheme}
          className="btn btn-circle btn-ghost"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? <FaMoon size={20} color="#000"/> : <FaSun size={20} color="#ffd700"/>}
        </button>

        {/* Photo profil */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-full overflow-hidden border border-base-300 transition-transform duration-150 hover:scale-105"
          >
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-base-200" />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-base-100 border border-base-300 rounded-md shadow-lg z-20 animate-fadeIn">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/profiles");
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-base-200 transition-colors"
              >
                <FaUser size={20} color="#ff69b4" /> Profil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-base-200 transition-colors"
              >
                <ImExit size={20} color="#ff0000" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
