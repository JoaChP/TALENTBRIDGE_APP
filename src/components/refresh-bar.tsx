import React from "react"
import { Button } from "./ui/button"

interface RefreshBarProps {
  onRefresh: () => void
  lastUpdate?: Date
  loading?: boolean
  label?: string
}

export function RefreshBar({ onRefresh, lastUpdate, loading, label = "Actualizar" }: RefreshBarProps) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 17.657A8.001 8.001 0 0012 20a8 8 0 007.938-7M18.364 6.343A8.001 8.001 0 0012 4a8 8 0 00-7.938 7" /></svg>
        {label}
      </Button>
      <span className="text-xs text-zinc-500">
        Última actualización: {lastUpdate ? lastUpdate.toLocaleTimeString() : "-"}
      </span>
    </div>
  )
}
