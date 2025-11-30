"use client";

import { useState, useRef, useEffect } from "react";

export default function NoelMusicPlayer({ musiques }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Quand la musique change, lancer la lecture si isPlaying est true
    if (audioRef.current && isPlaying) {
      audioRef.current.src = musiques[currentIndex].src;
      audioRef.current.play().catch(() => {
        // Ignorer les erreurs de lecture automatique
      });
    }
  }, [currentIndex, isPlaying, musiques]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentIndex + 1) % musiques.length;
    setCurrentIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = musiques[nextIndex].src;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    const prevIndex = (currentIndex - 1 + musiques.length) % musiques.length;
    setCurrentIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = musiques[prevIndex].src;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-red-100 via-white to-red-100 p-6 rounded-3xl shadow-xl w-full max-w-md mx-auto border-2 border-red-300 relative overflow-hidden">
  <audio ref={audioRef} src={musiques[currentIndex].src} />
  
  {/* Titre de la musique */}
  <div className="text-center font-bold text-red-700 text-lg md:text-xl tracking-wide">
    🎵 {musiques[currentIndex].title}
  </div>
  
  {/* Boutons */}
  <div className="flex items-center gap-6">
    <button
      onClick={prevTrack}
      className="btn btn-circle bg-red-200 hover:bg-red-300 text-red-800 shadow-md transition-transform hover:scale-110"
      aria-label="Précédent"
    >
      ⏮️
    </button>
    <button
      onClick={togglePlay}
      className="btn btn-circle bg-red-400 hover:bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? "⏸️" : "▶️"}
    </button>
    <button
      onClick={nextTrack}
      className="btn btn-circle bg-red-200 hover:bg-red-300 text-red-800 shadow-md transition-transform hover:scale-110"
      aria-label="Suivant"
    >
      ⏭️
    </button>
  </div>

  {/* Décorations festives */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-blink absolute" style={{ top: "10%", left: "20%" }} />
    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-blink absolute" style={{ top: "30%", left: "70%" }} />
    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-blink absolute" style={{ top: "60%", left: "50%" }} />
  </div>

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
