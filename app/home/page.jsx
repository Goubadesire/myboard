"use client";

import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { BsGlobe } from "react-icons/bs";
import { IoSunnyOutline } from "react-icons/io5";
import { FiMoon } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import {
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

export default function LandingPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Charger la préférence depuis localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Initialiser Lucide Icons
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

  return (
    <Fragment>
      {/* HEAD pour CDN */}
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/daisyui@2.51.5/dist/full.js"></script>
        <script src="https://unpkg.com/lucide@latest"></script>
      </Head>

      <div className="bg-base-100 text-base-content">
        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full bg-base-100 shadow z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">StudentBoard</div>
            <div className="flex gap-4">
              <button onClick={toggleTheme} className="btn btn-circle">
                {theme === "light" ? (
                  <FiMoon size={20} color="#000"/>
                ) : (
                  <IoSunnyOutline size={20} color="#ffd700"/>
                )}
              </button>
              
              <a href="/login" className="btn btn-sm btn-outline btn-secondary">
                Se connecter
              </a>
              <a href="/register" className="btn btn-sm btn-primary">
                S’inscrire
              </a>
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
              StudenBoard t’aide à rester concentré sur l’essentiel.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="/register" className="btn btn-primary ">
                Essayer gratuitement
              </a>
              <a href="/login" className="btn btn-outline btn-secondary ">
                Se connecter
              </a>
            </div>
          </motion.div>

          <motion.img
            src="/imgs/dashboard.png"
            alt="Dashboard StudenBoard"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-12 lg:mt-0 lg:w-[600px] rounded-xl shadow-xl"
          />
        </section>

        {/* CHIFFRES CLÉS */}
        <section className="bg-base-200 py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "+10 000", label: "Étudiants actifs" },
              { value: "95 %", label: "Satisfaction" },
              { value: "100 %", label: "Compatible mobile & web" },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="text-4xl font-bold text-primary">{item.value}</h3>
                <p className="text-base-content/80 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tout ce dont tu as besoin pour réussir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Gestion des matières", desc: "Ajoute, organise et consulte toutes tes matières facilement." },
              { title: "Emploi du temps intelligent", desc: "Planifie tes cours et reçois des rappels automatiques." },
              { title: "Suivi des notes", desc: "Suis tes moyennes et vois ton évolution par semestre." },
              { title: "Statistiques claires", desc: "Un tableau de bord qui t’aide à mieux s’organiser." },
            ].map((feature, index) => (
              <div key={index} className="bg-base-100 shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2 text-base-content">{feature.title}</h3>
                <p className="text-base-content/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AVIS ÉTUDIANTS */}
        <section className="bg-base-200 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-10">Ce que disent nos étudiants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: "Sanders Tano", text: "StudenBoard a complètement changé ma façon d’étudier. Je suis beaucoup plus organisée !", img: "/imgs/PhotoSanders.jpg" },
                { name: "Yasser Sankara", text: "L’application est claire, rapide et super utile. Je recommande à tous les étudiants.", img: "/imgs/PhotoSankara.jpg" },
                { name: "Mohamed Kaboré", text: "J’adore le design et les fonctionnalités. Tout est pensé pour nous faciliter la vie.", img: "/imgs/PhotoKabore.jpg" },
              ].map((review, index) => (
                <div key={index} className="bg-base-100 shadow-md rounded-2xl p-6">
                  <img src={review.img} alt={review.name} className="w-16 h-16 mx-auto rounded-full mb-4" />
                  <p className="text-base-content/80 italic mb-4">“{review.text}”</p>
                  <h4 className="font-semibold text-primary">{review.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">Commence dès aujourd’hui</h2>
          <p className="text-base-content/80 mb-8">
            Rejoins des milliers d’étudiants qui simplifient leur quotidien avec StudenBoard.
          </p>
          <a href="/register" className="btn btn-primary btn-lg">
            Créer un compte gratuitement
          </a>
        </section>

        {/* FOOTER */}
        <footer className="bg-base-200 py-10 text-center text-base-content/70">
          <div className="flex justify-center gap-6 mb-4 text-2xl">
            <a href="https://wa.me/2250500802026" title="Whatsapp" target="_blank" className="hover:text-green-500">
              <FaWhatsapp />
            </a>
            <a href="mailto:goubadesire0@gmail.com" title="E-mail" target="_blank" className="hover:text-red-500">
              <FaEnvelope />
            </a>
            <a href="https://goubadesire.github.io/portfolio/" target="_blank" title="Portfolio" className="hover:text-blue-500">
              <BsGlobe />
            </a>
          </div>
          <p className="text-sm">© 2025 Gouba desire — Tous droits réservés.</p>
        </footer>
      </div>
    </Fragment>
  );
}
