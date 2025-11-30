import { FiMenu } from "react-icons/fi";
import { getUser } from "@/lib/session";
import { useEffect, useState, useRef } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({ onMenuClick, toggleTheme, theme }) {
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);

  // Chargement user
  useEffect(() => {
    const sessionUser = getUser();
    setUser(sessionUser);
  }, []);

  // Effet neige
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const flakes = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dy: Math.random() * 1 + 0.5,
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.y += f.dy;
        if (f.y > height) f.y = -f.r;
      });
      requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full bg-red-50 shadow-md p-4 flex justify-between items-center sticky top-0 z-10 relative overflow-hidden rounded-b-2xl">
      {/* Canvas neige */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* Guirlande */}
      <div className="absolute top-0 left-0 w-full flex justify-between px-4 py-2 z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full animate-blink"
            style={{ backgroundColor: ["#ff3b30", "#06d6a0", "#ffd166"][i % 3] }}
          />
        ))}
      </div>

      {/* Section gauche */}
      <div className="flex items-center gap-3 z-10">
        <button
          onClick={onMenuClick}
          className="md:hidden btn btn-ghost btn-sm bg-white/10 dark:bg-black/20 rounded"
          aria-label="Open sidebar"
        >
          <FiMenu size={22} className="text-black dark:text-dark"/>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-red-700 animate-fadeIn">
          Joyeux Noël, {user?.name || "étudiant"} !
        </h1>
      </div>

      {/* Toggle thème */}
      <div className="flex items-center gap-3 md:gap-4 z-10">
        <button
          onClick={toggleTheme}
          className="btn btn-circle btn-ghost"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? <FaMoon size={18} color="#000" /> : <FaSun size={18} color="#ffd700" />}
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 0.2; transform: translateY(0); }
          25%, 75% { opacity: 1; transform: translateY(-2px); }
        }
        .animate-blink {
          animation: blink 1.5s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </header>
  );
}
