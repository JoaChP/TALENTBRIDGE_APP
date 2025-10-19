"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../stores/auth-store"
import type { Role } from "../types"

interface RoleGateProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RoleGate({ allowedRoles, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/no-autorizado")
    }
  }, [user, allowedRoles, router])

  if (!user || !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
