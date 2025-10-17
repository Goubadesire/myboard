"use client"
import Header from "./header"
import Sidebar from "./sidebar"

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar à gauche */}
      <aside className="w-64 bg-base-200 shadow-md">
        <Sidebar />
      </aside>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Header en haut */}
        <header className="sticky top-0 z-10">
          <Header />
        </header>

        {/* Contenu */}
        <main className="flex-1 p-6 bg-base-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
