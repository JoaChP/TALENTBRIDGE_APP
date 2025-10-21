"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth-store"
import type { Role } from "../types"

interface RoleGateProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      navigate("/no-autorizado")
    }
  }, [user, allowedRoles, navigate])

  if (!user || !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
