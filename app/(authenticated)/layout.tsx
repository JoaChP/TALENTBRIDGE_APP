"use client"

import { AppShell } from "../../src/components/layout/app-shell"
import { useAuthStore } from "../../src/stores/auth-store"
import { useEffect } from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      window.location.href = "/login"
    }
  }, [user])

  // Show nothing while checking auth or if not authenticated
  if (!user) {
    return null
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}