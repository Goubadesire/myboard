"use client";
import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-base-200 shadow-md transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar />
      </aside>

      {/* Overlay (quand le menu est ouvert sur mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Header avec bouton menu */}
        <header className="sticky top-0 z-30">
          <Header onMenuClick={() => setIsOpen(!isOpen)} />
        </header>

        {/* Contenu */}
        <main className="flex-1 p-6 bg-base-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
