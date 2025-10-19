import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "../../lib/utils"

const navItems = [
  { to: "/", icon: Home, label: "Inicio" },
  { to: "/buscar", icon: Search, label: "Buscar" },
  { to: "/publicar", icon: PlusCircle, label: "Publicar" },
  { to: "/mensajes", icon: MessageCircle, label: "Mensajes" },
  { to: "/perfil", icon: User, label: "Perfil" },
]

export function TabBar() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:hidden"
      aria-label="Navegación principal"
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-indigo-800 dark:text-indigo-200"
                  : "text-zinc-800 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100",
              )
            }
            aria-label={label}
          >
            {() => (
              <>
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className={cn("font-medium", "font-semibold")}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
