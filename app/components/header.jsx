import { FiMenu } from "react-icons/fi";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({ onMenuClick, toggleTheme, theme }) {
  const [user, setUser] = useState(null);

  // Chargement user
  useEffect(() => {
    const sessionUser = getUser();
    setUser(sessionUser);
  }, []);

  return (
      <header className="w-full bg-red-50 shadow-md p-4 flex justify-between items-center sticky top-0 z-10 relative rounded-b-2xl">

        {/* Section gauche */}
        <div className="flex items-center gap-3">
          <button
              onClick={onMenuClick}
              className="md:hidden btn btn-ghost btn-sm bg-white/10 dark:bg-black/20 rounded"
              aria-label="Open sidebar"
          >
            <FiMenu size={22} className="text-black dark:text-dark"/>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-red-700">
            Bonjour, {user?.name || "étudiant"} !
          </h1>
        </div>

        {/* Toggle thème */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
              onClick={toggleTheme}
              className="btn btn-circle btn-ghost"
              aria-label="Toggle dark mode"
          >
            {theme === "light" ? <FaMoon size={18} color="#000" /> : <FaSun size={18} color="#ffd700" />}
          </button>
        </div>
      </header>
  );
}
