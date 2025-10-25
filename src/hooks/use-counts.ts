import { useEffect, useState } from 'react'
import { mockApi } from '../mocks/api'

interface Counts {
  practices: number
  applications: number
  companies: number
  myPractices?: number  // Para empresas: cuántas ofertas HAN PUBLICADO
  applicationsToMe?: number  // Para empresas: cuántas postulaciones HAN RECIBIDO
}

interface UseCountsOptions {
  userId?: string
  userRole?: string
}

export function useCounts(options?: UseCountsOptions) {
  const [counts, setCounts] = useState<Counts>({ 
    practices: 0, 
    applications: 0, 
    companies: 0,
    myPractices: 0,
    applicationsToMe: 0
  })
  const [loading, setLoading] = useState(true)

  const loadCounts = async () => {
    try {
      const [pr, ap, co] = await Promise.all([
        mockApi.countPractices(),
        options?.userId 
          ? mockApi.listApplications(options.userId).then(apps => apps.length)
          : mockApi.countApplications(),
        mockApi.countCompanies(),
      ])
      
      let myPracticesCount = 0
      let applicationsToMeCount = 0
      
      // Si es empresa, contar sus ofertas y postulaciones recibidas
      if (options?.userRole === "empresa" && options?.userId) {
        const allPractices = await mockApi.listPractices()
        const companyPractices = allPractices.filter(p => p.company.ownerUserId === options.userId)
        myPracticesCount = companyPractices.length
        
        const allApplications = await mockApi.listApplications("all")
        const myPracticeIds = companyPractices.map(p => p.id)
        applicationsToMeCount = allApplications.filter(app => myPracticeIds.includes(app.practiceId)).length
      }
      
      setCounts({ 
        practices: pr, 
        applications: ap, 
        companies: co,
        myPractices: myPracticesCount,
        applicationsToMe: applicationsToMeCount
      })
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
  }, [options?.userId])

  return { counts, loading, reload: loadCounts }
}
