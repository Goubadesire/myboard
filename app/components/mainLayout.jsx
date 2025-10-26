"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { getUser } from "@/lib/session";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [profile, setProfile] = useState(null); // 🔹 Profil utilisateur

  // Charger la préférence thème
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  // Charger le profil utilisateur connecté
  useEffect(() => {
    const sessionUser = getUser();
    if (!sessionUser) return;

    fetch("/api/profiles", { headers: { email: sessionUser.email } })
      .then((res) => res.json())
      .then((data) => setProfile(data.profile || null));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-base-200 shadow-md transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar profile={profile} />
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30">
          <Header
            onMenuClick={() => setIsOpen(!isOpen)}
            toggleTheme={toggleTheme}
            theme={theme}
            profile={profile} // 🔹 Passe aussi le profil au Header si besoin
          />
        </header>

        <main className="flex-1 p-6 bg-base-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
