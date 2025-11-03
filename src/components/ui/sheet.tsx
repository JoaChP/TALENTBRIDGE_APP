// Componente lateral (sheet) para mostrar paneles deslizados (cliente)
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
}

// Componente principal exportado: Sheet
const Sheet = ({ open, onOpenChange, children, side = "right" }: SheetProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={cn("fixed bg-white dark:bg-zinc-950 shadow-lg transition-transform", {
          "inset-y-0 right-0 w-full max-w-sm": side === "right",
          "inset-y-0 left-0 w-full max-w-sm": side === "left",
          "inset-x-0 top-0 h-auto max-h-[80vh]": side === "top",
          "inset-x-0 bottom-0 h-auto max-h-[80vh]": side === "bottom",
        })}
      >
        {children}
      </div>
    </div>
  )
}

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-full flex-col p-6", className)} {...props}>
      {children}
    </div>
  ),
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />,
)
SheetTitle.displayName = "SheetTitle"

const SheetClose = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    aria-label="Cerrar"
  >
    <X className="h-4 w-4" />
  </button>
)

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose }
