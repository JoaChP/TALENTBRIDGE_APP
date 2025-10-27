import React from "react"
import { useIsMobile } from "./ui/use-mobile"
import { RefreshBar } from "./refresh-bar"

interface MobileRefreshBarProps {
  onRefresh: () => void
  lastUpdate?: Date
  loading?: boolean
  label?: string
}

export function MobileRefreshBar(props: MobileRefreshBarProps) {
  const isMobile = useIsMobile()
  if (!isMobile) return null
  return <RefreshBar {...props} />
}
