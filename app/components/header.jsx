"use client"
import { IoMdExit } from "react-icons/io"
import { clearUser, getUser } from "@/lib/session"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const [userName, setUserName] = useState("Admin")
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user) return

    fetch("/api/auth/me", {
      headers: { email: user.email }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user?.name) setUserName(data.user.name)
      })
      .catch(() => setUserName("Admin"))
  }, [])

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  return (
    <header className="w-full bg-base-100 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-primary">StudentBoard</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-base-300"></div>
          <span className="font-medium">{userName}</span>
          <IoMdExit size={20} color="#e74c3c" className="cursor-pointer" onClick={handleLogout} />
        </div>
      </div>
    </header>
  )
}
