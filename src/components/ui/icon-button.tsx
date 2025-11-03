import * as React from "react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label?: string
  color?: "indigo" | "green" | "red" | "slate" | "yellow"
  variant?: "default" | "outline" | "ghost" | "link" | "destructive"
}

/**
 * IconButton
 * - Small, reusable button that shows an icon and optional label.
 * - Accepts a `color` prop to quickly switch background/text palettes.
 * - Keeps accessibility attributes and forwards the ref.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, color = "indigo", className, variant = "default", ...props }, ref) => {
    const colorClasses: Record<string, string> = {
      indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
      green: "bg-green-600 text-white hover:bg-green-700",
      red: "bg-red-600 text-white hover:bg-red-700",
      slate: "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
      yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300",
    }

    const mergedClass = cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium shadow-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      // If variant is default, prefer the Tailwind palette class; fallback handled by inline style below
      variant === "default" ? colorClasses[color] : undefined,
      className,
    )

    // Inline style fallback: use hex colors so buttons remain visible if Tailwind classes are purged
    const inlineColorMap: Record<string, { background?: string; color?: string; border?: string }> = {
      indigo: { background: "#4f46e5", color: "#ffffff" }, // indigo-600
      green: { background: "#16a34a", color: "#ffffff" }, // green-600
      red: { background: "#dc2626", color: "#ffffff" }, // red-600
      slate: { background: "#f1f5f9", color: "#0f172a", border: "#e2e8f0" }, // zinc-100
      yellow: { background: "#fef3c7", color: "#92400e" }, // yellow-100
    }

    const inlineStyle = variant === "default" ? {
      backgroundColor: inlineColorMap[color]?.background,
      color: inlineColorMap[color]?.color,
      borderColor: inlineColorMap[color]?.border,
    } : undefined

    return (
      <Button ref={ref} size="sm" variant={variant} className={mergedClass} style={inlineStyle as any} {...props}>
        <span className="flex items-center">{icon}</span>
        {label ? <span className="hidden sm:inline">{label}</span> : null}
      </Button>
    )
  },
)

IconButton.displayName = "IconButton"

export default IconButton
