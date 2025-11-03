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
      // If variant is outline/ghost/link, don't force solid color
      variant === "default" ? colorClasses[color] : undefined,
      className,
    )

    return (
      <Button ref={ref} size="sm" variant={variant} className={mergedClass} {...props}>
        <span className="flex items-center">{icon}</span>
        {label ? <span className="hidden sm:inline">{label}</span> : null}
      </Button>
    )
  },
)

IconButton.displayName = "IconButton"

export default IconButton
