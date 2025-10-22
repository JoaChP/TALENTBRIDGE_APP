"use client"

import { useEffect } from "react"
import { useAuthStore } from "../stores/auth-store"
import type { Role } from "../types"

interface RoleGateProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if ((!user || !allowedRoles.includes(user.role)) && typeof window !== "undefined") {
      window.location.href = "/no-autorizado"
    }
  }, [user, allowedRoles])

  if (!user || !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
