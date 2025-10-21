"use client"

import { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth-store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  // Instead of returning null, immediately redirect
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
