// ProtectedRoute: redirige a /login si no hay usuario autenticado
"use client"

import { useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Componente exportado: ProtectedRoute
// Comportamiento: no renderiza children y redirige si no hay user
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }, [user])

  // No renderizar si no autenticado
  if (!user) {
    return null
  }

  return <>{children}</>
}
