"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { BsGlobe } from "react-icons/bs";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

/* 🔹 Compteur animé */
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

export default function LandingPage() {
  const [theme, setTheme] = useState("light");

  /* 🔹 Chargement thème */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
      <Fragment>
        <Head>
          <title>StudentBoard – Organise ta vie d’étudiant</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
              name="description"
              content="Planifie tes cours, suis tes notes et gère ton emploi du temps avec StudentBoard."
          />
        </Head>

        <div className="bg-base-100 text-base-content">
          {/* HEADER */}
          <header className="fixed top-0 left-0 w-full bg-base-100 shadow z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="text-2xl font-bold text-primary">
                StudentBoard
              </div>

              <button onClick={toggleTheme} className="btn btn-circle" title="Changer le thème">
                {theme === "light" ? (
                    <FiMoon size={18} />
                ) : (
                    <IoSunnyOutline size={18} color="#ffd700" />
                )}
              </button>
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
                <a href="/register" className="btn btn-primary">
                  Inscrivez-vous maintenant
                </a>
                <a href="/login" className="btn btn-outline btn-secondary">
                  Se connecter
                </a>
              </div>
            </motion.div>

            <motion.img
                src="/imgs/dashboardPhoto.jpg"
                alt="Dashboard StudentBoard"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="rounded-xl shadow-xl w-full lg:w-[600px] mt-12 lg:mt-0"
            />
          </section>

          {/* CHIFFRES CLÉS */}
          <section className="bg-base-200 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { value: 10000, label: "Étudiants actifs", prefix: "+", suffix: "" },
                { value: 95, label: "Satisfaction", prefix: "", suffix: " %" },
                { value: 100, label: "Compatible mobile & web", prefix: "", suffix: " %" },
              ].map((item, index) => (
                  <div key={index}>
                    <h3 className="text-4xl font-bold text-primary">
                      <CountUpOnView
                          end={item.value}
                          duration={1500 + index * 200}
                          prefix={item.prefix}
                          suffix={item.suffix}
                      />
                    </h3>
                    <p className="text-base-content/80 mt-2">{item.label}</p>
                  </div>
              ))}
            </div>
          </section>

          {/* FEATURES */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-16">
              Tout ce dont tu as besoin pour réussir
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                {
                  title: "Gestion des matières",
                  desc: "Ajoute, organise et consulte toutes tes matières facilement.",
                  image: "/imgs/Learning-rafiki.png",
                },
                {
                  title: "Emploi du temps intelligent",
                  desc: "Planifie tes cours et reçois des rappels automatiques.",
                  image: "/imgs/Schedule-pana.png",
                },
                {
                  title: "Suivi des notes",
                  desc: "Suis tes moyennes et vois ton évolution par semestre.",
                  image: "/imgs/undraw_analytics-setup_ptrz.png",
                },
                {
                  title: "Statistiques claires",
                  desc: "Un tableau de bord qui t’aide à mieux t’organiser.",
                  image: "/imgs/Datareport-pana.png",
                },
              ].map((feature, index) => (
                  <div
                      key={index}
                      className="bg-base-100 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
                  >
                    <img src={feature.image} alt={feature.title} className="w-30 h-30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-base-content/80">{feature.desc}</p>
                  </div>
              ))}
            </div>
          </section>

          {/* AVIS */}
          <section className="bg-base-200 py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-10">
                Ce que disent nos étudiants
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    name: "Sanders Tano",
                    text: "StudentBoard a complètement changé ma façon d’étudier.",
                    img: "/imgs/PhotoSanders.jpg",
                  },
                  {
                    name: "Yasser Sankara",
                    text: "L’application est claire, rapide et super utile.",
                    img: "/imgs/PhotoSankara.jpg",
                  },
                  {
                    name: "Mohamed Kaboré",
                    text: "Tout est pensé pour nous faciliter la vie.",
                    img: "/imgs/PhotoKabore.jpg",
                  },
                ].map((review, index) => (
                    <div key={index} className="bg-base-100 shadow-md rounded-2xl p-6">
                      <img
                          src={review.img}
                          alt={review.name}
                          className="w-16 h-16 mx-auto rounded-full mb-4"
                      />
                      <p className="italic mb-4">“{review.text}”</p>
                      <h4 className="font-semibold text-primary">{review.name}</h4>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Commence dès aujourd’hui
            </h2>
            <p className="text-base-content/80 mb-8">
              Rejoins des milliers d’étudiants qui simplifient leur quotidien.
            </p>
            <a href="/register" className="btn btn-primary btn-lg">
              Créer un compte gratuitement
            </a>
          </section>

          {/* FOOTER */}
          <footer className="bg-base-200 py-10 text-center text-base-content/70">
            <div className="flex justify-center gap-6 mb-4 text-2xl">
              <a href="https://wa.me/2250500802026" target="_blank"><FaWhatsapp /></a>
              <a href="mailto:goubadesire0@gmail.com" target="_blank"><FaEnvelope /></a>
              <a href="https://goubadesire.github.io/portfolio/" target="_blank"><BsGlobe /></a>
            </div>
            <p className="text-sm">© 2025 Gouba Désiré — Tous droits réservés.</p>
          </footer>
        </div>
      </Fragment>
  );
}
