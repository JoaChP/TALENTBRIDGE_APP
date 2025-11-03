// Barra de refresco reutilizable con botón y timestamp de última actualización
import React from "react"
import { Button } from "./ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshBarProps {
  onRefresh: () => void
  lastUpdate?: Date
  loading?: boolean
  label?: string
}

// Componente exportado: RefreshBar
// Props: onRefresh (acción), lastUpdate (fecha opcional), loading y label
export function RefreshBar({ onRefresh, lastUpdate, loading, label = "Actualizar" }: RefreshBarProps) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="gap-2">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {label}
      </Button>
      <span className="text-xs text-zinc-500">
        Última actualización: {lastUpdate ? lastUpdate.toLocaleTimeString() : "-"}
      </span>
    </div>
  )
}
