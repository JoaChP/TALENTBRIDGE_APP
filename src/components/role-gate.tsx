import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth-store"
import type { Role } from "../types"

interface RoleGateProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <>{children}</>
}
