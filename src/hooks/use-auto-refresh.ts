import { useEffect, useRef } from 'react'

/**
 * Hook para auto-refrescar datos periódicamente
 * @param callback Función a ejecutar
 * @param interval Intervalo en milisegundos (default: 30000 = 30 segundos)
 * @param enabled Si el auto-refresh está habilitado (default: true)
 */
export function useAutoRefresh(
  callback: () => void | Promise<void>,
  interval: number = 30000,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Actualizar la referencia del callback si cambia
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Ejecutar inmediatamente al montar
    const executeCallback = async () => {
      try {
        await savedCallback.current()
      } catch (error) {
        console.error('[useAutoRefresh] Error executing callback:', error)
      }
    }

    // Primera ejecución
    executeCallback()

    // Configurar intervalo
    intervalRef.current = setInterval(executeCallback, interval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [interval, enabled])
}
