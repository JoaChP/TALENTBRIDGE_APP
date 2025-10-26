"use client"

import { useEffect, useState, memo, useMemo, useCallback } from "react"
import { Home, Search, MessageCircle, User, FileCheck, Shield } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/auth-store"

const navItems = [
  { to: "/", icon: Home, label: "Inicio", spa: true },
  { to: "/search", icon: Search, label: "Buscar", spa: true },
  
  // Estudiantes - Ver sus postulaciones
  { to: "/applications", icon: FileCheck, label: "Solicitudes", roleRequired: ["estudiante"], spa: true },
  
  // Empresas - Gestión (combina publicar y ver postulaciones)
  { to: "/company-applications", icon: FileCheck, label: "Gestión", roleRequired: ["empresa"], spa: true },
  
  // Administradores - Panel de administración
  { to: "/dashboard/admin", icon: Shield, label: "Admin", roleRequired: ["admin"], spa: true },
  
  // Comunes a todos
  { to: "/messages", icon: MessageCircle, label: "Mensajes", spa: true },
  { to: "/profile", icon: User, label: "Perfil", spa: true },
]

export const TabBar = memo(function TabBar() {
  const user = useAuthStore((s) => s.user)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    console.log('[TabBar] Rendering TabBar component')
    setCurrentPath(window.location.pathname)
    
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Memoize filtered items to prevent recalculation
  const filteredItems = useMemo(() => {
    const items = navItems.filter((item) => {
      // Filter items by role if roleRequired is specified
      if (item.roleRequired) {
        return user?.role && item.roleRequired.includes(user.role)
      }
      return true
    }).slice(0, 5) // Límite de 5 items para móvil
    console.log('[TabBar] Filtered items:', items.length, 'User role:', user?.role)
    return items
  }, [user?.role])

  // Optimized navigation handler
  const handleNavigation = useCallback((to: string, useSpa: boolean) => {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      
      if (useSpa) {
        // SPA navigation for routes handled by src/App.tsx
        if (currentPath !== to) {
          window.history.pushState({}, '', to)
          window.dispatchEvent(new PopStateEvent('popstate'))
        }
      } else {
        // HTML navigation for App Router routes
        window.location.href = to
      }
    }
  }, [currentPath])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-indigo-500 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 !block"
      aria-label="Navegación principal"
      style={{ minHeight: '64px' }}
    >
      <div className="flex h-16 items-center justify-around bg-white dark:bg-zinc-950">
        {filteredItems.length === 0 ? (
          <div className="text-xs text-zinc-500">No hay items disponibles</div>
        ) : (
          filteredItems.map(({ to, icon: Icon, label, spa = true }) => {
            const isActive = currentPath === to || (to !== "/" && currentPath.startsWith(to))
            
            return (
              <a
                key={to}
                href={to}
                onClick={handleNavigation(to, spa)}
                aria-label={label}
                className={cn(
                  "flex min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-indigo-800 dark:text-indigo-200"
                    : "text-zinc-800 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className={cn("font-medium", "font-semibold")}>{label}</span>
              </a>
            )
          })
        )}
      </div>
    </nav>
  )
})
