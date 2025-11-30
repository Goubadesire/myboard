'use client';

import { useState, useEffect, useRef } from "react";
import MainLayout from "../components/mainLayout";
import AuthGuard from "../components/AuthGuard";
import { getUser } from "@/lib/session";
import NoelMusicPlayer from "../components/NoelMusicPlayer";
import NoelVideoGallery from "../components/NoelVideoGallery";

export default function NoelPage() {
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setUser(getUser());

    // Effet neige
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const flakes = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      dy: Math.random() * 1 + 0.5,
      dx: Math.random() * 0.5 - 0.25,
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        f.y += f.dy;
        f.x += f.dx;
        if (f.y > height) f.y = -f.r;
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;
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

  const musiques = [
  { title: "Santa Claus is Here!", src: "/audios/santa-claus-is-here.mp3" },
  { title: "Tinsel and Mistletoe", src: "/audios/tinsel-and-mistletoe-.mp3" },
  { title: "Holidays 2", src: "/audios/holidays.mp3" },
  { title: "Golden Freezer", src: "/audios/golden-freezer.mp3" },
  { title: "Christmas Jazz", src: "/audios/christmas-jazz.mp3" },
];

  //les videos
  const videos = [
  { title: "All I Want for Christmas Is You", youtubeId: "aAkMkVFwAoo" },
  { title: "Mistletoe", youtubeId: "LUjn3RpkcKY" },
  { title: "Petit Papa Noël", youtubeId: "sGlXYeiCz_4" },
  { title: "Santa Tell Me", youtubeId: "nlR0MkrRklg" },
  { title: "Boyce Avenue", youtubeId: "ZSXZbguDUWg" },
  { title: "New Christmas", youtubeId: "1eq9QUkvcRw" },
  
];


  return (
    <AuthGuard>
      <MainLayout>
        {/* Canvas neige */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />

        {/* Musique de Noël */}
        <NoelMusicPlayer musiques={musiques} />
        <br />
        <NoelVideoGallery videos={videos}/>

        {/* Contenu */}
        <div className="relative z-10">
          
          {/* Ici tu peux ajouter ton quiz ou autres sections */}
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
