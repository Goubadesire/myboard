"use client";

import { useEffect, useState, useRef } from "react";

export default function NoelSection() {
  const [message, setMessage] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  // Récupère un message de Noël depuis l'API
  const fetchMessage = async () => {
    try {
      const res = await fetch("/api/noels");
      const data = await res.json();
      if (data && data.texte) {
        setMessage(data);
        setDisplayedText("");
        indexRef.current = 0;
      }
    } catch (err) {
      console.error("Erreur API Noël :", err);
      setDisplayedText("Impossible de charger le message de Noël 😢");
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  // Effet machine à écrire
  useEffect(() => {
    if (!message || !message.texte) return;

    clearInterval(intervalRef.current);
    setDisplayedText("");
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      const nextChar = message.texte[indexRef.current] || "";
      if (nextChar) {
        setDisplayedText((prev) => prev + nextChar);
        indexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 40);

    return () => clearInterval(intervalRef.current);
  }, [message]);

  // Effet neige
  useEffect(() => {
    const canvas = document.getElementById("snow-noel");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let flakes = [];
    let rafId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    function SnowFlake() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 3 + 1.5;
      this.speed = Math.random() * 1 + 0.5;
      this.wind = Math.random() * 1 - 0.5;
    }

    const createFlakes = () => {
      flakes = [];
      for (let i = 0; i < 80; i++) flakes.push(new SnowFlake());
    };

    const drawFlakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      flakes.forEach((f) => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      });
      ctx.fill();
      flakes.forEach((f) => {
        f.y += f.speed;
        f.x += f.wind * 0.7 * Math.random();
        if (f.y > canvas.height) f.y = -f.radius;
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
      });
      rafId = requestAnimationFrame(drawFlakes);
    };

    createFlakes();
    drawFlakes();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full bg-red-50 py-12 px-6 relative overflow-hidden rounded-2xl shadow-lg">
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

      {/* Texte */}
      <p className="relative z-20 text-center text-lg font-semibold text-red-700 min-h-[60px]">
        {displayedText || "Chargement..."}
      </p>
      <p className="text-center mt-2 text-sm font-medium text-green-900">
        {message?.auteur || ""}
      </p>

      {/* Bouton nouveau message */}
      <div className="flex justify-center mt-4">
        <button
          onClick={fetchMessage}
          className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
        >
          Nouveau message 🎄
        </button>
      </div>

      {/* Canvas neige */}
      <canvas
        id="snow-noel"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Styles animation guirlande */}
      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 0.2; transform: translateY(0); }
          25%, 75% { opacity: 1; transform: translateY(-2px); }
        }
        .animate-blink {
          animation: blink 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
