/*
  Archivo: src/components/ui/select.tsx
  Propósito:
    - Componente Select estilizado que incluye un icono indicando el desplegable.
    - Encapsula estilos y comportamiento accesible para selects en el proyecto.
*/

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

// Componente principal exportado: Select
// - Forward-ref de un elemento select envuelto con un icono posicionado.
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-xl border border-zinc-300 bg-white px-3 py-2 pr-8 text-sm text-black dark:text-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-950",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
        aria-hidden="true"
      />
    </div>
  )
})
Select.displayName = "Select"

export { Select }
