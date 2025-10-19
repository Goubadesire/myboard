"use client";

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/session"

/**
 * AuthGuard
 * - wrapper client qui redirige vers /login si pas d'utilisateur trouvé
 * - usage : <AuthGuard><YourProtectedContent/></AuthGuard>
 */
export default function AuthGuard({ children }) {
  const router = useRouter()

  useEffect(() => {
    const user = getUser()
    if (!user) {
      // remplace l'historique pour éviter le retour en arrière vers la page protégée
      router.replace("/login")
    }
  }, [router])

  // Tant que getUser() est null, on retourne null pour éviter le flash
  if (typeof window !== "undefined") {
    const user = getUser()
    if (!user) return null
  } else {
    return null
  }

  return children
}
