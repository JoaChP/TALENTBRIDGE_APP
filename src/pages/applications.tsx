"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import type { Application, Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { Calendar, Building2, MapPin, ArrowRight, ChevronLeft } from "lucide-react"

const STATUS_COLORS = {
  Enviada: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Revisando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Aceptada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rechazada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

interface ApplicationWithPractice extends Application {
  practice?: Practice
}

export function ApplicationsPage() {
  const user = useAuthStore((state) => state.user)
  const [applications, setApplications] = useState<ApplicationWithPractice[]>([])
  const [loading, setLoading] = useState(true)

  const handleNavigation = (path: string) => {
    const link = document.createElement('a')
    link.href = path
    link.click()
  }

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return
      
      try {
        const [appsData, practicesData] = await Promise.all([
          mockApi.listApplications(user.id),
          mockApi.listPractices(),
        ])
        
        // Enrich applications with practice data
        const enrichedApps = appsData.map((app) => ({
          ...app,
          practice: practicesData.find((p) => p.id === app.practiceId),
        }))
        
        setApplications(enrichedApps)
      } catch (error) {
        console.error("Error loading applications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" onClick={() => window.history.back()} aria-label="Volver">
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Atrás</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-balance">Mis Postulaciones</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Gestiona y da seguimiento a tus solicitudes de prácticas
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No has realizado postulaciones"
          description="Comienza a explorar oportunidades y postula a las prácticas que te interesen"
          action={{
            label: "Buscar Prácticas",
            onClick: () => handleNavigation("/search"),
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            if (!application.practice) return null
            
            return (
              <Card key={application.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-balance">
                          {application.practice.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <Building2 className="h-4 w-4" />
                          <span>{application.practice.company.name}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {application.practice.city}, {application.practice.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Postulado: {new Date(application.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={STATUS_COLORS[application.status]}>
                          {application.status}
                        </Badge>
                        <Badge variant="outline">{application.practice.modality}</Badge>
                        <Badge variant="outline">{application.practice.durationMonths} meses</Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto w-full">
                      <Button
                        variant="outline"
                        className="w-full md:w-auto"
                        onClick={() => handleNavigation(`/oferta/${application.practice!.id}`)}
                      >
                        Ver Oferta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Postulaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {applications.length}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter((a) => a.status === "Enviada").length}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Enviadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter((a) => a.status === "Revisando").length}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">En Revisión</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter((a) => a.status === "Aceptada").length}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Aceptadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApplicationsPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
