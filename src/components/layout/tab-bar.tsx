"use client"

import { useEffect, useState } from "react"
import { Home, Search, MessageCircle, User, FileCheck } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/auth-store"

const navItems = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/search", icon: Search, label: "Buscar" },
  { to: "/applications", icon: FileCheck, label: "Solicitudes", roleRequired: ["estudiante"] },
  { to: "/company-applications", icon: FileCheck, label: "Aplicaciones", roleRequired: ["empresa"] },
  { to: "/messages", icon: MessageCircle, label: "Mensajes" },
  { to: "/profile", icon: User, label: "Perfil" },
]

export function TabBar() {
  const user = useAuthStore((s) => s.user)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    setCurrentPath(window.location.pathname)
    
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const filteredItems = navItems.filter((item) => {
    // Filter items by role if roleRequired is specified
    if (item.roleRequired) {
      return user?.role && item.roleRequired.includes(user.role)
    }
    return true
  })

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
      aria-label="Navegación principal"
    >
      <div className="flex h-16 items-center justify-around">
        {filteredItems.map(({ to, icon: Icon, label }) => {
          const isActive = currentPath === to || (to !== "/" && currentPath.startsWith(to))
          
          return (
            <a
              key={to}
              href={to}
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, '', to)
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
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
        })}
      </div>
    </nav>
  )
}
