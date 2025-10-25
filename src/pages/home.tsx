"use client"

import { useEffect, useState, memo, useMemo } from "react"
import { PracticeCard } from "../components/practice-card"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { useCounts } from "../hooks/use-counts"
import { useOptimizedNavigation } from "../hooks/use-optimized-navigation"
import { PerformanceMonitor, BatchProcessor } from "../utils/performance"

export const HomePage = memo(function HomePage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)
  const { navigate } = useOptimizedNavigation()
  
  // Pasar el rol del usuario para obtener estadísticas específicas
  const { counts } = useCounts({ 
    userId: user?.role === "estudiante" ? user.id : (user?.role === "empresa" ? user.id : undefined),
    userRole: user?.role
  })

  // Memoize las prácticas para evitar re-renders innecesarios
  const memoizedPractices = useMemo(() => practices, [practices])

  useEffect(() => {
    const loadPractices = async () => {
      PerformanceMonitor.start('home-load-practices')
      
      try {
        const data = await mockApi.listPractices()
        
        // Use batch processor para mejorar rendimiento con grandes listas
        BatchProcessor.add(() => {
          setPractices(data)
          PerformanceMonitor.end('home-load-practices')
        })
      } catch (error) {
        console.error("[HomePage] Error loading practices:", error)
        PerformanceMonitor.end('home-load-practices')
      } finally {
        setLoading(false)
      }
    }

    loadPractices()
    
    // Escuchar cambios en los datos
    const handleDataUpdate = () => {
      console.log("[HomePage] Data updated, reloading practices...")
      loadPractices()
    }
    
    window.addEventListener("talentbridge-data-updated", handleDataUpdate)
    
    return () => {
      window.removeEventListener("talentbridge-data-updated", handleDataUpdate)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-2xl font-semibold">Bienvenido a TalentBridge</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Conecta estudiantes con prácticas profesionales, postula y gestiona procesos de selección.</p>

        <div className="mt-4 flex flex-wrap gap-4">
          {user?.role === "empresa" ? (
            // Vista para empresas
            <>
              <div className="rounded-lg bg-indigo-50 px-4 py-3">
                <div className="text-sm text-zinc-600">Mis ofertas publicadas</div>
                <div className="text-2xl font-bold text-indigo-700">{counts.myPractices}</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-4 py-3">
                <div className="text-sm text-zinc-600">Postulaciones recibidas</div>
                <div className="text-2xl font-bold">{counts.applicationsToMe}</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-4 py-3">
                <div className="text-sm text-zinc-600">Empresas</div>
                <div className="text-2xl font-bold">{counts.companies}</div>
              </div>
            </>
          ) : (
            // Vista para estudiantes y admin
            <>
              <div className="rounded-lg bg-indigo-50 px-4 py-3">
                <div className="text-sm text-zinc-600">Prácticas disponibles</div>
                <div className="text-2xl font-bold text-indigo-700">{counts.practices}</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-4 py-3">
                <div className="text-sm text-zinc-600">
                  {user?.role === "estudiante" ? "Mis solicitudes" : "Solicitudes"}
                </div>
                <div className="text-2xl font-bold">{counts.applications}</div>
              </div>
              <div className="rounded-lg bg-zinc-50 px-4 py-3">
                <div className="text-sm text-zinc-600">Empresas</div>
                <div className="text-2xl font-bold">{counts.companies}</div>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          {user?.role === "empresa" && (
            <a
              href="/publish"
              onClick={(e) => handleClick(e, "/publish")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Publicar oferta
            </a>
          )}

          {user?.role === "estudiante" && (
            <a
              href="/postulaciones"
              onClick={(e) => handleClick(e, "/postulaciones")}
              className="rounded-md border border-zinc-200 px-4 py-2 hover:bg-zinc-100 dark:border-zinc-800"
            >
              Ver mis postulaciones
            </a>
          )}
        </div>
      </div>
      {/* Quick actions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-lg font-semibold mb-3">Acciones rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/search"
            onClick={(e) => handleClick(e, "/search")}
            className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 text-left hover:shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <div className="font-medium">Buscar prácticas</div>
              <div className="text-sm text-zinc-500">Explora oportunidades por título, empresa o habilidad</div>
            </div>
          </a>

          {user?.role === "empresa" && (
            <a
              href="/publish"
              onClick={(e) => handleClick(e, "/publish")}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 text-left hover:shadow-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div className="font-medium">Publicar oferta</div>
                <div className="text-sm text-zinc-500">Crea una nueva oferta y gestiona postulaciones</div>
              </div>
            </a>
          )}

          {user?.role === "estudiante" && (
            <a
              href="/postulaciones"
              onClick={(e) => handleClick(e, "/postulaciones")}
              className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 text-left hover:shadow-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-zinc-600">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 21c1.5-4 7.5-6 9-6s7.5 2 9 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="font-medium">Mis postulaciones</div>
                <div className="text-sm text-zinc-500">Revisa y gestiona tus aplicaciones</div>
              </div>
            </a>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-balance">Últimas Oportunidades</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Descubre las prácticas profesionales más recientes
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {memoizedPractices.map((practice) => (
            <PracticeCard key={practice.id} practice={practice} />
          ))}
        </div>
      )}
    </div>
  )
})

export default HomePage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
