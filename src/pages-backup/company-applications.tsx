"use client"

/*
  Archivo: src/pages-backup/company-applications.tsx
  Propósito:
    - Página para que empresas (y admins) gestionen las aplicaciones recibidas a sus prácticas.
    - Carga prácticas, applications y usuarios; enriquece las applications con datos de práctica y applicant.

  Comportamiento clave:
    - Admins ven todas las prácticas y aplicaciones; empresas solo las que pertenecen a sus prácticas.
    - Permite cambiar el estado de una aplicación (Aceptar/Rechazar) y abrir un chat con el candidato.
    - Escucha el evento `talentbridge-data-updated` para recargar datos en tiempo real.

  Nota:
    - Esta versión usa `mockApi` (mocks/api). Al migrar a JSONBin, actualizar `mockApi` y conservar la lógica de recarga.
*/

import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import IconButton from "../components/ui/icon-button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import type { Application, Practice, User, ApplicationStatus } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { User as UserIcon, MessageSquare, ChevronLeft, Check, X } from "lucide-react"
import { RefreshBar } from "../components/refresh-bar"
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
  // Componente: CompanyApplicationsPage
  // - Maneja la carga y renderizado de aplicaciones para la empresa o el admin actual.
  // - No recibe props; depende de `useAuthStore` y `mockApi`.
  const user = useAuthStore((state) => state.user)
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | undefined>(undefined)

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
      setLastUpdate(new Date())
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
      <div className="flex items-start justify-between gap-4">
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
        <div className="flex-shrink-0">
          <RefreshBar onRefresh={loadData} lastUpdate={lastUpdate} loading={loading} />
        </div>
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
              <Card key={application.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-50">
                        <img src={application.applicant.avatarUrl || "/placeholder.svg"} alt={application.applicant.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-balance">{application.applicant.name}</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{application.practice.title} · {application.practice.company.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">Aplicó: {new Date(application.createdAt).toLocaleDateString("es-ES")}</p>
                        {application.applicant.about && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{application.applicant.about}</p>}
                      </div>
                    </div>

                    <div className="mt-3 md:mt-0 flex items-center gap-3">
                      <div className="flex flex-col items-end gap-2 mr-2">
                        <Badge className={STATUS_COLORS[application.status]}>{application.status}</Badge>
                        {(application.status === "Aceptada" || application.status === "Rechazada") && (
                          <span className={`text-sm font-medium ${application.status === "Aceptada" ? "text-green-700" : "text-red-700"}`}>{application.status === "Aceptada" ? "✅ Aceptada" : "❌ Rechazada"}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <IconButton color="blue" variant="default" label="Mensaje" onClick={() => handleStartChat(application)} aria-label="Enviar mensaje" icon={<MessageSquare className="h-4 w-4" />} />
                        <IconButton color="slate" variant="outline" label="Perfil" onClick={() => { window.history.pushState({}, "", `/user/${application.userId}`); window.dispatchEvent(new Event("popstate")) }} aria-label="Ver perfil" icon={<UserIcon className="h-4 w-4" />} />

                        {(application.status === "Enviada" || application.status === "Revisando") ? (
                          <div className="flex gap-2">
                            <IconButton color="teal" variant="default" label="Aceptar" onClick={() => handleUpdateStatus(application.id, "Aceptada")} aria-label="Aceptar" icon={<Check className="h-4 w-4" />} />
                            <IconButton color="rose" variant="default" label="Rechazar" onClick={() => handleUpdateStatus(application.id, "Rechazada")} aria-label="Rechazar" icon={<X className="h-4 w-4" />} />
                          </div>
                        ) : null}
                      </div>
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
