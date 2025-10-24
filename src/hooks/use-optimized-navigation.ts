import { useState, useEffect, useCallback } from 'react'

/**
 * Hook optimizado para navegación que proporciona navegación rápida y directa
 */
export function useOptimizedNavigation() {
  const [currentPath, setCurrentPath] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Inicializar con la ruta actual
    setCurrentPath(window.location.pathname)
    
    const handlePopState = () => {
      setIsNavigating(true)
      setCurrentPath(window.location.pathname)
      // Reset navigation state quickly
      setTimeout(() => setIsNavigating(false), 100)
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Función de navegación directa y rápida
  const navigate = useCallback((to: string) => {
    if (currentPath === to) return // No navegar si ya estamos en la ruta
    
    setIsNavigating(true)
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [currentPath])

  // Verificar si una ruta está activa
  const isActive = useCallback((path: string, exact = false) => {
    if (exact) {
      return currentPath === path
    }
    return currentPath === path || (path !== '/' && currentPath.startsWith(path))
  }, [currentPath])

  return {
    currentPath,
    isNavigating,
    navigate,
    isActive
  }
}