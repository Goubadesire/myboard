import { NextResponse } from "next/server"

const publicRoutes = ["/login", "/register", "/api/auth/login", "/api/auth/register"]

export function middleware(req) {
  const url = req.nextUrl.pathname

  // Laisser passer les routes publiques
  if (publicRoutes.includes(url)) return NextResponse.next()

  // Vérifie la présence du cookie "user"
  const userCookie = req.cookies.get("user")

  if (!userCookie) {
    // Redirige vers /login si non connecté
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Sinon on laisse passer
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
