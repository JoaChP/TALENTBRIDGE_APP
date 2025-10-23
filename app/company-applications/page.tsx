"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { LoadingSkeleton } from "../../src/components/loading-skeleton"
import { EmptyState } from "../../src/components/empty-state"
import type { Application, Practice, User, ApplicationStatus } from "../../src/types"
import { mockApi } from "../../src/mocks/api"
import { useAuthStore } from "../../src/stores/auth-store"
import { Calendar, User as UserIcon, MessageSquare, ChevronLeft, Check, X } from "lucide-react"
import { toast } from "sonner"

const STATUS_COLORS = {
  Enviada: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Revisando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Aceptada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rechazada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

interface ApplicationWithDetails extends Application {
  practice?: Practice
  applicant?: User
}

export default function CompanyApplicationsPage() {
  const user = useAuthStore((state) => state.user)
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) return

    try {
      // Reload from localStorage to get latest data
      mockApi.reloadFromStorage()

      // Get all practices and applications
      const [allPractices, allApplications, allUsers] = await Promise.all([
        mockApi.listPractices(),
        mockApi.listApplications("all"),
        mockApi.listUsers?.() || Promise.resolve([]),
      ])

      let relevantPractices: Practice[]
      let relevantApplications: Application[]

      if (user.role === "admin") {
        // Admin puede ver TODAS las prácticas y solicitudes
        console.log('[CompanyApplications] Admin mode - showing all applications')
        relevantPractices = allPractices
        relevantApplications = allApplications
        console.log(`[CompanyApplications] Total practices: ${allPractices.length}, Total applications: ${allApplications.length}`)
      } else {
        // Empresa solo ve SUS prácticas y solicitudes
        console.log(`[CompanyApplications] Company mode - userId: ${user.id}`)
        relevantPractices = allPractices.filter(
          (p) => p.company.ownerUserId === user.id
        )
        console.log(`[CompanyApplications] My practices: ${relevantPractices.length}`)
        const myPracticeIds = relevantPractices.map((p) => p.id)
        relevantApplications = allApplications.filter((app) =>
          myPracticeIds.includes(app.practiceId)
        )
        console.log(`[CompanyApplications] My applications: ${relevantApplications.length}`)
      }

      setPractices(relevantPractices)

      // Enrich with practice and user data
      const enriched = relevantApplications.map((app) => ({
        ...app,
        practice: relevantPractices.find((p) => p.id === app.practiceId),
        applicant: allUsers.find((u) => u.id === app.userId),
      }))

      setApplications(enriched)
    } catch (error) {
      console.error("Error loading applications:", error)
      toast.error("Error al cargar las aplicaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Escuchar actualizaciones de datos
    const handleDataUpdate = () => {
      console.log('[CompanyApplicationsPage] Data updated, reloading...')
      loadData()
    }

    window.addEventListener('talentbridge-data-updated', handleDataUpdate)

    return () => {
      window.removeEventListener('talentbridge-data-updated', handleDataUpdate)
    }
  }, [user])

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!user) return

    try {
      await mockApi.updateApplicationStatus(applicationId, newStatus, user.id)
      toast.success(`Aplicación ${newStatus.toLowerCase()} exitosamente`)
      // Recargar datos para mostrar el cambio
      loadData()
    } catch (error) {
      console.error("Error updating application status:", error)
      toast.error("Error al actualizar la aplicación")
    }
  }

  const handleStartChat = async (application: ApplicationWithDetails) => {
    if (!user || !application.applicant) return

    try {
      const thread = await mockApi.createThreadForApplication(
        application.practiceId,
        application.userId
      )
      window.location.href = `/messages/${thread.id}`
    } catch (error) {
      console.error("Error starting chat:", error)
      toast.error("Error al iniciar la conversación")
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Atrás</span>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-balance">
          {user?.role === "admin" ? "Todas las Aplicaciones" : "Aplicaciones Recibidas"}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          {user?.role === "admin" 
            ? "Gestiona todas las solicitudes de estudiantes del sistema"
            : "Gestiona las solicitudes de estudiantes para tus prácticas"}
        </p>
      </div>

      {practices.length === 0 ? (
        <EmptyState
          title={user?.role === "admin" ? "No hay prácticas en el sistema" : "No has publicado prácticas"}
          description={user?.role === "admin" 
            ? "Aún no hay prácticas publicadas en la plataforma"
            : "Publica tu primera práctica para empezar a recibir aplicaciones"}
          action={user?.role === "admin" ? undefined : {
            label: "Publicar Práctica",
            onClick: () => {
              window.history.pushState({}, "", "/publish")
              window.dispatchEvent(new PopStateEvent("popstate"))
            },
          }}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No hay aplicaciones aún"
          description="Los estudiantes podrán aplicar a tus prácticas publicadas"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            if (!application.practice || !application.applicant) return null

            return (
              <Card
                key={application.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-balance">
                          {application.practice.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <UserIcon className="h-4 w-4" />
                          <span>{application.applicant.name}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Aplicó:{" "}
                            {new Date(application.createdAt).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                      </div>

                      {application.applicant.about && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {application.applicant.about}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge className={STATUS_COLORS[application.status]}>
                          {application.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto w-full">
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => handleStartChat(application)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Enviar mensaje
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          console.log("Ver perfil clicked, userId:", application.userId)
                          console.log("Full application:", application)
                          window.history.pushState({}, "", `/user/${application.userId}`)
                          window.dispatchEvent(new Event("popstate"))
                        }}
                      >
                        Ver perfil
                      </Button>
                      
                      {/* Botones de aceptar/rechazar solo para aplicaciones pendientes */}
                      {(application.status === "Enviada" || application.status === "Revisando") && (
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleUpdateStatus(application.id, "Aceptada")}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Aceptar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleUpdateStatus(application.id, "Rechazada")}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                      
                      {/* Mostrar estado final para aplicaciones ya procesadas */}
                      {(application.status === "Aceptada" || application.status === "Rechazada") && (
                        <div className="w-full p-2 rounded-md text-center text-sm font-medium">
                          {application.status === "Aceptada" ? (
                            <span className="text-green-700 bg-green-50 px-3 py-1 rounded-full">
                              ✅ Aplicación Aceptada
                            </span>
                          ) : (
                            <span className="text-red-700 bg-red-50 px-3 py-1 rounded-full">
                              ❌ Aplicación Rechazada
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}