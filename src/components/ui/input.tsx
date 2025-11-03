/*
  Archivo: src/components/ui/input.tsx
  Propósito:
    - Input estilizado reutilizable para entradas de texto.
    - Centraliza clases accesibles (focus, disabled, dark mode) y permite pasar props nativos.

  Uso:
    - Importar `{ Input }` y usar como un `input` normal.
*/

import * as React from "react"
import { cn } from "../../lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

// Componente principal exportado: Input
// - Forward-ref de un elemento input con las clases del diseño de la UI.
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:text-white ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
