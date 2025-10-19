import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
