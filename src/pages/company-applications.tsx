"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import type { Application, Practice, User } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { Calendar, User as UserIcon, MessageSquare, ChevronLeft } from "lucide-react"
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

export function CompanyApplicationsPage() {
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
        relevantPractices = allPractices
        relevantApplications = allApplications
      } else {
        // Empresa solo ve SUS prácticas y solicitudes
        relevantPractices = allPractices.filter(
          (p) => p.company.ownerUserId === user.id
        )
        const myPracticeIds = relevantPractices.map((p) => p.id)
        relevantApplications = allApplications.filter((app) =>
          myPracticeIds.includes(app.practiceId)
        )
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

export default CompanyApplicationsPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
