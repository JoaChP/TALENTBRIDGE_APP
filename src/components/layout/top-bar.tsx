"use client"

import { Search, Sun, Moon } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as React from "react"

export function TopBar() {
  const searchRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

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
          onClick={() => {
            window.history.pushState({}, '', "/")
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}
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
            onFocus={() => {
              window.history.pushState({}, '', "/search")
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}
            aria-label="Buscar prácticas"
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="flex-shrink-0"
        >
          {mounted && (
            theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          )}
          {!mounted && <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  )
}
