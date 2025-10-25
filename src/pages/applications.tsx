"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import type { Application, Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { Calendar, Building2, MapPin, ArrowRight, MessageSquare, ChevronLeft, ChevronRight, FileCheck, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

const STATUS_COLORS = {
  Enviada: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Revisando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Aceptada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rechazada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const STATUS_ICONS = {
  Enviada: Clock,
  Revisando: Clock,
  Aceptada: CheckCircle,
  Rechazada: XCircle,
}

const ITEMS_PER_PAGE = 5

interface ApplicationWithPractice extends Application {
  practice?: Practice
}

export default function ApplicationsPage() {
  const user = useAuthStore((state) => state.user)
  const [applications, setApplications] = useState<ApplicationWithPractice[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate stats
  const stats = useMemo(() => {
    const total = applications.length
    const aceptadas = applications.filter(app => app.status === "Aceptada").length
    const enEspera = applications.filter(app => app.status === "Enviada" || app.status === "Revisando").length
    const rechazadas = applications.filter(app => app.status === "Rechazada").length
    
    return { total, aceptadas, enEspera, rechazadas }
  }, [applications])

  // Pagination
  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE)
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return applications.slice(startIndex, endIndex)
  }, [applications, currentPage])

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleSendMessage = async (practiceId: string) => {
    if (!user) return
    
    try {
      const thread = await mockApi.createThreadForApplication(practiceId, user.id)
      toast.success("Conversación iniciada")
      handleNavigation(`/messages/${thread.id}`)
    } catch (error) {
      console.error("Error creating thread:", error)
      toast.error("Error al iniciar la conversación")
    }
  }

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

  useEffect(() => {
    loadApplications()
    
    // Escuchar cambios en el estado de las aplicaciones
    const handleStatusChange = () => {
      console.log("[ApplicationsPage] Application status changed, reloading...")
      loadApplications()
    }
    
    window.addEventListener("application-status-changed", handleStatusChange)
    window.addEventListener("talentbridge-data-updated", handleStatusChange)
    
    return () => {
      window.removeEventListener("application-status-changed", handleStatusChange)
      window.removeEventListener("talentbridge-data-updated", handleStatusChange)
    }
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header con stats */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Mis Postulaciones</h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            <FileCheck className="h-4 w-4 mr-2" />
            {stats.total} {stats.total === 1 ? "postulación" : "postulaciones"}
          </Badge>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Gestiona el estado de tus solicitudes
        </p>

        {/* Stats cards */}
        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.aceptadas}</p>
                <p className="text-xs text-green-700 dark:text-green-300">Aceptadas</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600 dark:text-yellow-400" />
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.enEspera}</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">En espera</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <XCircle className="h-5 w-5 mx-auto mb-1 text-red-600 dark:text-red-400" />
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.rechazadas}</p>
                <p className="text-xs text-red-700 dark:text-red-300">Rechazadas</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No tienes postulaciones"
          description="Las prácticas a las que te postules aparecerán aquí."
          action={{
            label: "Buscar prácticas",
            onClick: () => handleNavigation("/search")
          }}
        />
      ) : (
        <>
          {/* Applications list */}
          <div className="grid gap-4">
            {paginatedApplications.map((app) => {
              const StatusIcon = STATUS_ICONS[app.status]
              
              return (
                <Card key={app.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {app.practice?.title || "Práctica"}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{app.practice?.company.name || "Empresa"}</span>
                        </div>
                      </div>
                      <Badge className={`${STATUS_COLORS[app.status]} flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {app.practice && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{app.practice.city}, {app.practice.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Postulado el {new Date(app.createdAt).toLocaleDateString("es-CL")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {app.practice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigation(`/oferta/${app.practice!.id}`)}
                          className="flex-1"
                        >
                          Ver Oferta
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {app.status === "Aceptada" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSendMessage(app.practiceId)}
                          className="flex-1"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Enviar Mensaje
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, stats.total)} de {stats.total}
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
