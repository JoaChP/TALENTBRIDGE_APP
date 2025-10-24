"use client"

import { AppShell } from "../../src/components/layout/app-shell"
import { useAuthStore } from "../../src/stores/auth-store"
import { useHydration } from "../../src/hooks/use-hydration"
import { useEffect, useState } from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((state) => state.user)
  const isHydrated = useHydration()
  const [authChecked, setAuthChecked] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    console.log("[AuthLayout] Effect triggered", { isHydrated, user, authChecked })
    
    if (isHydrated && !authChecked) {
      console.log("[AuthLayout] Starting auth check...")
      
      // Dar tiempo a Zustand para cargar desde localStorage
      const checkAuth = () => {
        const currentUser = useAuthStore.getState().user
        console.log("[AuthLayout] Auth check result:", currentUser)
        
        setAuthChecked(true)
        
        if (currentUser) {
          console.log("[AuthLayout] User found, rendering protected content")
          setShouldRender(true)
        } else {
          console.log("[AuthLayout] No user found, redirecting to login in 1 second")
          // Dar un poco más de tiempo antes de redirigir
          setTimeout(() => {
            const finalUser = useAuthStore.getState().user
            console.log("[AuthLayout] Final auth check:", finalUser)
            
            if (!finalUser) {
              console.log("[AuthLayout] Final redirect to login")
              window.location.href = "/login"
            } else {
              console.log("[AuthLayout] User found at last moment, rendering")
              setShouldRender(true)
            }
          }, 1000)
        }
      }
      
      // Dar tiempo inicial para la hidratación
      setTimeout(checkAuth, 200)
    }
  }, [isHydrated, authChecked])

  // Mostrar loading mientras no hayamos terminado de verificar auth
  if (!isHydrated || !authChecked || (!shouldRender && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">
            {!isHydrated ? "Cargando aplicación..." : 
             !authChecked ? "Verificando autenticación..." : 
             "Preparando contenido..."}
          </p>
        </div>
      </div>
    )
  }

  // No renderizar nada si no tenemos usuario y ya hemos verificado
  if (!user || !shouldRender) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}