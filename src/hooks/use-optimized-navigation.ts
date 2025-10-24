import { useState, useEffect, useMemo, useCallback } from 'react'
import { debounce } from '../utils/performance'

/**
 * Hook optimizado para navegación que previene actualizaciones innecesarias
 * y mejora el rendimiento de las transiciones entre páginas
 */
export function useOptimizedNavigation() {
  const [currentPath, setCurrentPath] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)

  // Debounced path update para prevenir re-renders excesivos
  const updatePath = useMemo(() => 
    debounce((path: string) => {
      setCurrentPath(path)
      setIsNavigating(false)
    }, 50), []
  )

  useEffect(() => {
    // Inicializar con la ruta actual
    setCurrentPath(window.location.pathname)
    
    const handlePopState = () => {
      setIsNavigating(true)
      updatePath(window.location.pathname)
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [updatePath])

  // Función de navegación optimizada
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