"use client";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { CiBookmarkCheck } from "react-icons/ci";
import { BsSubstack } from "react-icons/bs";
import { PiExamDuotone } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { MdAdsClick } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import Link from "next/link";

export default function Sidebar({profile}) {
  return (
    <div className="w-64 h-screen bg-base-200 shadow-lg flex flex-col">
      {/* Titre Menu centré avec fond couleur primaire */}
      <div className="text-center py-7 bg-primary text-base-100 font-bold text-xl">
        {profile?.full_name || "Utilisateur"}
      </div>

      {/* Liste des items */}
      <ul className="flex flex-col mt-4 gap-2 px-2">
        <li className="btn btn-ghost w-full justify-start gap-2">
          <MdOutlineDashboardCustomize size={20} color="#1e90ff" />
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <CiBookmarkCheck size={20} color="#2ecc71" />
          <Link href="/notes">Notes</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <BsSubstack size={20} color="#ffd700"/>
          <Link href="/matieres">Matières</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <PiExamDuotone size={20} color="#f39c12" />
          <Link href="/devoirs">Devoirs</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <CiCalendarDate size={20} color="#34495e" />
          <Link href="/planning">Emploi du temps</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <MdAdsClick size={20} color="#ff69b4"/>
          <Link href='/semestre'>Semestres</Link>
        </li>
        <li className="btn btn-ghost w-full justify-start gap-2">
          <ImProfile size={20} color="#8b4513"/>
          <Link href='/profiles'>Profiles</Link>
        </li>
      </ul>
    </div>
  );
}
