"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useRef } from "react"

export function TopBar() {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95">
  <div className="container mx-auto flex h-16 items-center gap-4 px-4 lg:ml-64">
        <button
          onClick={() => window.location.href = "/"}
          className="flex items-center gap-2 font-bold text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-lg"
          aria-label="Ir a inicio"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">TB</div>
          <span className="hidden sm:inline">TalentBridge</span>
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <Input
            ref={searchRef}
            type="search"
            placeholder="Buscar prácticas... (presiona /)"
            className="pl-9"
            onFocus={() => window.location.href = "/search"}
            aria-label="Buscar prácticas"
          />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
