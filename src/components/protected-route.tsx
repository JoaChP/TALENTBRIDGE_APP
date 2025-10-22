"use client"

import { useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }, [user])

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}
