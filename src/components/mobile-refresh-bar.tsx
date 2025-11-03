// Envoltorio para mostrar RefreshBar solo en móviles
import React from "react"
import { useIsMobile } from "../../components/ui/use-mobile"
import { RefreshBar } from "./refresh-bar"

interface MobileRefreshBarProps {
  onRefresh: () => void
  lastUpdate?: Date
  loading?: boolean
  label?: string
}

// Componente exportado: MobileRefreshBar
// Muestra RefreshBar únicamente en pantallas móviles
export function MobileRefreshBar(props: MobileRefreshBarProps) {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return <RefreshBar {...props} />
}
