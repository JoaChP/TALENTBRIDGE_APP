import { useEffect, useState } from "react"

/**
 * Hook to handle client-side hydration
 * Returns true once the component has hydrated on the client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
