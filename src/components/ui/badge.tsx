/*
  Archivo: src/components/ui/badge.tsx
  Propósito:
    - Componente Badge (etiqueta) pequeño para mostrar estados, categorías o counts.
    - Soporta variantes (`default`, `secondary`, `outline`) para distintas apariencias.
*/

import type * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline"
}

// Componente principal exportado: Badge
// - Renderiza un contenedor inline-flex con estilos según `variant`.
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200": variant === "default",
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200": variant === "secondary",
          "border border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:text-zinc-200": variant === "outline",
        },
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
