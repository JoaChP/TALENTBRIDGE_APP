"use client"

import { NavLink } from "react-router-dom"
import { Home, Search, PlusCircle, MessageCircle, User, FileCheck } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/auth-store"

const navItems = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/search", icon: Search, label: "Buscar" },
  { to: "/publish", icon: PlusCircle, label: "Publicar", roleRequired: ["empresa", "admin"] },
  { to: "/postulaciones", icon: FileCheck, label: "Postulaciones", roleRequired: ["estudiante"] },
  { to: "/messages", icon: MessageCircle, label: "Mensajes" },
  { to: "/profile", icon: User, label: "Perfil" },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)

  const filteredItems = navItems.filter((item) => {
    // Filter items by role if roleRequired is specified
    if (item.roleRequired) {
      return user?.role && item.roleRequired.includes(user.role)
    }
    return true
  })

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-zinc-200 lg:bg-white lg:pt-16 dark:lg:border-zinc-800 dark:lg:bg-zinc-950">
      <nav className="flex-1 space-y-1 p-4" aria-label="Navegación principal">
        {filteredItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
