"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { BsGlobe } from "react-icons/bs";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon, FiMusic } from "react-icons/fi";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { TbChristmasTree, TbChristmasBall } from "react-icons/tb";

// 🔹 Petit composant utilitaire : compteur animé
function CountUpOnView({ end = 0, duration = 1500, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            observer.disconnect();

            const start = performance.now();
            const animate = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              const current = Math.floor(end * eased);
              setValue(current);
              if (t < 1) requestAnimationFrame(animate);
              else setValue(end);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

// 🔹 Composant Guirlande
function Garland() {
  const colors = ["#ff3b30", "#06d6a0", "#ffd166"];
  return (
    <div className="absolute top-0 left-0 w-full flex justify-center gap-2 z-[9999] pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors[i % colors.length] }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, repeatType: "mirror" }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState("light");
  const [isChristmas, setIsChristmas] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const tracks = [
    "/audios/christmas-jazz.mp3",
    "/audios/golden-freezer.mp3",
    "/audios/santa-claus-is-here.mp3",
    "/audios/tinsel-and-mistletoe-.mp3"
  ];

  // Charger le thème et Noël au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 11, 15);
    const end = new Date(year + 1, 0, 2, 23, 59, 59);

    if (now >= start || now <= end) setIsChristmas(true);

    if (typeof window !== "undefined" && window.lucide) {
      window.lucide.createIcons();
    }
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

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn("Impossible de lancer la musique automatiquement : interaction requise.", e);
    }
  };

  const handleEnded = () => {
    const nextIndex = (trackIndex + 1) % tracks.length;
    setTrackIndex(nextIndex);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.src = tracks[nextIndex];
        audio.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  // Snowfall amélioré : tempête légère + rafales aléatoires
  useEffect(() => {
    const canvas = document.getElementById("snow-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let flakes = [];
    let rafId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function SnowFlake() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 3 + 1;
      this.speed = Math.random() * 1 + 0.5;
      this.wind = Math.random() * 2 - 1; // rafales plus fortes
    }

    function createFlakes() {
      flakes = [];
      for (let i = 0; i < 200; i++) {
        flakes.push(new SnowFlake());
      }
    }

    function drawFlakes() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      flakes.forEach((flake) => {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      });
      ctx.fill();
      updateFlakes();
      rafId = requestAnimationFrame(drawFlakes);
    }

    function updateFlakes() {
      flakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += flake.wind * 0.5 * Math.random(); // rafales aléatoires
        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;
      });
    }

    createFlakes();
    drawFlakes();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleChristmas = () => setIsChristmas((s) => !s);

  const extraStyles = `
    .leds { display:flex; gap:6px; align-items:center }
    .led { width:10px; height:10px; border-radius:50%; box-shadow: 0 0 6px rgba(255,255,255,0.0); opacity:0.95; }
    .led.r { background:#ff3b30; animation:blinkR 1.6s infinite; }
    .led.g { background:#06d6a0; animation:blinkG 1.8s infinite; }
    .led.y { background:#ffd166; animation:blinkY 1.5s infinite; }
    @keyframes blinkR { 0%,40%{opacity:0.15; transform:translateY(0)} 60%{opacity:1; transform:translateY(-2px)} 100%{opacity:0.15} }
    @keyframes blinkG { 0%,35%{opacity:0.2} 55%{opacity:1; transform:translateY(-2px)} 100%{opacity:0.2} }
    @keyframes blinkY { 0%,30%{opacity:0.2} 50%{opacity:1; transform:translateY(-2px)} 100%{opacity:0.2} }
    .christmas-cta { box-shadow: 0 6px 20px rgba(255, 215, 0, 0.15), inset 0 -2px 0 rgba(0,0,0,0.06); transition: transform .18s ease, box-shadow .18s ease; }
    .christmas-cta:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(255,215,0,0.22); }
    .tree-orn { transform-origin: center; animation:orb 2.2s infinite ease-in-out; }
    .tree-orn:nth-child(2) { animation-duration:2.6s; }
    .tree-orn:nth-child(3) { animation-duration:1.9s; }
    @keyframes orb { 0%{opacity:.6; transform:scale(.95)} 50%{opacity:1; transform:scale(1.12)} 100%{opacity:.6; transform:scale(.95)} }
    #snow-canvas { pointer-events: none; }
    .christmas-badge { background: linear-gradient(90deg,#C62828,#1B5E20); color:white; padding:4px 8px; border-radius:999px; font-weight:600; font-size:13px }
  `;

  return (
    <Fragment>
      <Head>
       <title>StudentBoard – Organise ta vie d’étudiant</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Planifie tes cours, suis tes notes et gère ton emploi du temps avec StudentBoard."
        />
        <style>{extraStyles}</style>
      </Head>

      <div className={`bg-base-100 text-base-content ${isChristmas ? "christmas-mode" : ""}`}>
        {/* HEADER */}
        <header className={`fixed top-0 left-0 w-full bg-base-100 shadow z-50 ${isChristmas ? "border-b-2 border-red-500/40" : ""}`}>
          {isChristmas && <Garland />}
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="relative flex items-center gap-4">
              <div className="text-2xl font-bold text-primary flex items-center gap-3">
               {/* <span>StudentBoard </span>*/}
                <TbChristmasBall size={30} color="#1B5E20"/>
                {isChristmas && <span className="christmas-badge">Noël</span>}
              </div>
              {isChristmas && (
                <div className="leds ml-2" aria-hidden>
                  <span className="led r" />
                  <span className="led g" />
                  <span className="led y" />
                </div>
              )}
              <TbChristmasTree size={30} color="#C62828"/>
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={toggleMusic}
                className="btn btn-ghost btn-circle"
                title={isPlaying ? "Arrêter la musique" : "Écouter une musique de Noël"}
                aria-pressed={isPlaying}
              >
                <FiMusic size={18} className={isPlaying ? "text-primary" : ""} />
              </button>
              <button onClick={toggleTheme} className="btn btn-circle" title="Toggle theme">
                {theme === "light" ? <FiMoon size={18} color="#000" /> : <IoSunnyOutline size={18} color="#ffd700" />}
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-32 lg:pt-40 flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Organise ta vie d’étudiant facilement 🎓
            </h1>
            <p className="text-lg mb-8 text-base-content/80">
              Planifie tes cours, suis tes notes et gère ton emploi du temps depuis une seule plateforme.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/register" className={`btn btn-primary christmas-cta`}>Inscrivez-vous maintenant</a>
              <a href="/login" className="btn btn-outline btn-secondary">Se connecter</a>
              
            </div>
          </motion.div>

          <div className="relative mt-12 lg:mt-0 lg:w-[600px]">
            <motion.img
              src="/imgs/dashboardPhoto.jpg"
              alt="Dashboard StudenBoard"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-xl shadow-xl w-full"
            />
            {isChristmas && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute -bottom-6 left-4 w-32"
                aria-hidden
              >
                <svg viewBox="0 0 100 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <polygon points="50,5 15,45 85,45" fill="#0b6623" />
                    <polygon points="50,30 10,70 90,70" fill="#0b7a2a" />
                    <polygon points="50,55 8,95 92,95" fill="#0c8b2f" />
                    <rect x="44" y="96" width="12" height="18" fill="#6b3f1f" rx="2" />
                    <circle cx="50" cy="25" r="3.8" fill="#ffd700" className="tree-orn" />
                    <circle cx="35" cy="50" r="3.8" fill="#ff3b30" className="tree-orn" />
                    <circle cx="65" cy="50" r="3.8" fill="#06d6a0" className="tree-orn" />
                    <circle cx="50" cy="75" r="3.8" fill="#ffd166" className="tree-orn" />
                    <polygon points="50,0 53,8 62,8 55,13 58,21 50,16 42,21 45,13 38,8 47,8" fill="#ffd700" />
                  </g>
                </svg>
              </motion.div>
            )}
          </div>
        </section>



        {/* 🎄 Section Joyeux Noël */}
<section className="py-16 bg-gradient-to-b from-red-600/10 to-red-900/20 backdrop-blur-sm">
  <div className="max-w-6xl mx-auto px-4 text-center">

    {/* Titre */}
    <h2 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
      🎄 Joyeux Noël à toute la famille StudentBoard !
    </h2>
    <p className="text-gray-200 mb-10 text-lg">
      Merci pour votre travail, votre motivation et votre bonne humeur ❤️
    </p>

    {/* Cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

      {/* Exemple de card → tu dupliques autant que tu veux */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/kabore.jpg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Kaboré Mohamed</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiant • 2IFGT</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/Sanders.jpg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Tano Sanders</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiant • UNISAT</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/yasser.jpg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Sankara Yasser</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiant • 2IFGT</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/photoSare.jpeg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Saré Faouzia</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiante • 2IFGT</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/photoMawa.jpeg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Doumbia Mawa</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiante • 2IFGT</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/feli.jpg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Felicia</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiante • IUA</p>
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 
                      shadow-lg hover:shadow-2xl transition-all duration-300 
                      hover:-translate-y-2">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/40">
          <img 
            src="/imgs/photoReine.jpg" 
            alt="Nom utilisateur"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-white">Reine</h3>
        <p className="text-gray-300 text-sm mt-1">Étudiante</p>
      </div>

      {/* Copie-colle ce bloc autant de fois que nécessaire */}
      {/* ... */}
      
    </div>
  </div>
</section>




        {/* CHIFFRES CLÉS */}
        <section className="bg-base-200 py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[{ value: 10000, label: "Étudiants actifs", prefix: "+", suffix: "" },
              { value: 95, label: "Satisfaction", prefix: "", suffix: " %" },
              { value: 100, label: "Compatible mobile & web", prefix: "", suffix: " %" }].map((item, index) => (
              <div key={index}>
                <h3 className="text-4xl font-bold text-primary">
                  <CountUpOnView end={item.value} duration={1500 + index * 200} prefix={item.prefix} suffix={item.suffix} />
                </h3>
                <p className="text-base-content/80 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Tout ce dont tu as besoin pour réussir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[{ title: "Gestion des matières", desc: "Ajoute, organise et consulte toutes tes matières facilement.", image: "/imgs/Learning-rafiki.png" },
              { title: "Emploi du temps intelligent", desc: "Planifie tes cours et reçois des rappels automatiques.", image: "/imgs/Schedule-pana.png" },
              { title: "Suivi des notes", desc: "Suis tes moyennes et vois ton évolution par semestre.", image: "/imgs/undraw_analytics-setup_ptrz.png" },
              { title: "Statistiques claires", desc: "Un tableau de bord qui t’aide à mieux t’organiser.", image: "/imgs/Datareport-pana.png" }].map((feature, index) => (
              <div key={index} className="bg-base-100 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
                <img src={feature.image} alt={feature.title} className="w-30 h-30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-base-content">{feature.title}</h3>
                <p className="text-base-content/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AVIS */}
        <section className="bg-base-200 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-10">Ce que disent nos étudiants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[{ name: "Sanders Tano", text: "StudenBoard a complètement changé ma façon d’étudier. Je suis beaucoup plus organisée !", img: "/imgs/PhotoSanders.jpg" },
                { name: "Yasser Sankara", text: "L’application est claire, rapide et super utile. Je recommande à tous les étudiants.", img: "/imgs/PhotoSankara.jpg" },
                { name: "Mohamed Kaboré", text: "J’adore le design et les fonctionnalités. Tout est pensé pour nous faciliter la vie.", img: "/imgs/PhotoKabore.jpg" }].map((review, index) => (
                <div key={index} className="bg-base-100 shadow-md rounded-2xl p-6">
                  <img src={review.img} alt={review.name} className="w-16 h-16 mx-auto rounded-full mb-4" />
                  <p className="text-base-content/80 italic mb-4">“{review.text}”</p>
                  <h4 className="font-semibold text-primary">{review.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Commence dès aujourd’hui</h2>
          <p className="text-base-content/80 mb-8">
            Rejoins des milliers d’étudiants qui simplifient leur quotidien avec StudenBoard.
          </p>
          <a href="/register" className="btn btn-primary btn-lg christmas-cta">Créer un compte gratuitement</a>
        </section>

        {/* CANVAS NEIGE */}
        <canvas id="snow-canvas" className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"></canvas>

        {/* FOOTER */}
        <footer className="bg-base-200 py-10 text-center text-base-content/70">
          <div className="flex justify-center gap-6 mb-4 text-2xl">
            <a href="https://wa.me/2250500802026" title="Whatsapp" target="_blank" className="hover:text-green-500"><FaWhatsapp /></a>
            <a href="mailto:goubadesire0@gmail.com" title="E-mail" target="_blank" className="hover:text-red-500"><FaEnvelope /></a>
            <a href="https://goubadesire.github.io/portfolio/" target="_blank" title="Portfolio" className="hover:text-blue-500"><BsGlobe /></a>
          </div>
          <p className="text-sm">© 2025 Gouba desire — Tous droits réservés.</p>
        </footer>

        <audio
          ref={audioRef}
          src={tracks[trackIndex]}
          onEnded={handleEnded}
          preload="none"
        />
      </div>
    </Fragment>
  );
}
