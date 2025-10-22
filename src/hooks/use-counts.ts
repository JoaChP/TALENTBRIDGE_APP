import { useEffect, useState } from 'react'
import { mockApi } from '../mocks/api'

interface Counts {
  practices: number
  applications: number
  companies: number
}

export function useCounts() {
  const [counts, setCounts] = useState<Counts>({ 
    practices: 0, 
    applications: 0, 
    companies: 0 
  })
  const [loading, setLoading] = useState(true)

  const loadCounts = async () => {
    try {
      const [pr, ap, co] = await Promise.all([
        mockApi.countPractices(),
        mockApi.countApplications(),
        mockApi.countCompanies(),
      ])
      setCounts({ practices: pr, applications: ap, companies: co })
      setLoading(false)
    } catch (error) {
      console.error('Error loading counts:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCounts()

    // Escuchar el evento personalizado de actualización de datos
    const handleDataUpdate = () => {
      console.log('[useCounts] Data updated, reloading counts...')
      loadCounts()
    }

    window.addEventListener('talentbridge-data-updated', handleDataUpdate)
    
    // También recargar cuando el componente se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[useCounts] Page visible, reloading counts...')
        loadCounts()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('talentbridge-data-updated', handleDataUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return { counts, loading, reload: loadCounts }
}
