"use client"

import { Search } from "lucide-react"
import { Button } from "./ui/button"

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
        <Search className="h-12 w-12 text-zinc-400" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-zinc-600 dark:text-zinc-400 text-pretty">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  )
}
