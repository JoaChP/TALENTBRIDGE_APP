"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import type { Application, Practice, User } from "../types"
import { CheckCircle, XCircle, Eye, User as UserIcon, Briefcase, ChevronLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function CompanyApplicationsPage() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [stats, setStats] = useState({
    total: 0,
    enviadas: 0,
    revisando: 0,
    aceptadas: 0,
    rechazadas: 0,
  })

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Obtener todas las prácticas
      const allPractices = await mockApi.listPractices()
      // Filtrar las de esta empresa o todas si es admin
      const companyPractices =
        user.role === "admin"
          ? allPractices
          : allPractices.filter((p) => p.company.ownerUserId === user.id)
      setPractices(companyPractices)

      // Obtener aplicaciones a mis prácticas
      const allApplications = await mockApi.listApplications("all")
      const myPracticeIds = companyPractices.map((p) => p.id)
      const applicationsToMe = allApplications.filter((app) =>
        myPracticeIds.includes(app.practiceId)
      )
      setApplications(applicationsToMe)

      // Obtener estudiantes
      const allUsers = await mockApi.listUsers()
      const studentUsers = allUsers.filter((u) => u.role === "estudiante")
      setStudents(studentUsers)

      // Calcular estadísticas
      setStats({
        total: applicationsToMe.length,
        enviadas: applicationsToMe.filter((a) => a.status === "Enviada").length,
        revisando: applicationsToMe.filter((a) => a.status === "Revisando").length,
        aceptadas: applicationsToMe.filter((a) => a.status === "Aceptada").length,
        rechazadas: applicationsToMe.filter((a) => a.status === "Rechazada").length,
      })
    } catch (error) {
      console.error("Error loading applications:", error)
      toast.error("Error al cargar las postulaciones")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (applicationId: string) => {
    try {
      await mockApi.acceptApplication(applicationId)
      toast.success("Postulación aceptada")
      loadData()
    } catch (error) {
      console.error("Error accepting application:", error)
      toast.error("Error al aceptar la postulación")
    }
  }

  const handleReject = async (applicationId: string) => {
    if (!confirm("¿Estás seguro de rechazar esta postulación?")) return

    try {
      await mockApi.rejectApplication(applicationId)
      toast.success("Postulación rechazada")
      loadData()
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast.error("Error al rechazar la postulación")
    }
  }

  const handleReview = async (applicationId: string) => {
    try {
      await mockApi.reviewApplication(applicationId)
      toast.success("Postulación marcada como en revisión")
      loadData()
    } catch (error) {
      console.error("Error reviewing application:", error)
      toast.error("Error al marcar como en revisión")
    }
  }

  const handleDelete = async (applicationId: string, status: string) => {
    // No permitir eliminar postulaciones aceptadas
    if (status === "Aceptada") {
      toast.error("No se pueden eliminar postulaciones aceptadas")
      return
    }

    if (!confirm("¿Estás seguro de eliminar esta postulación? Esta acción no se puede deshacer.")) return

    try {
      await mockApi.deleteApplication(applicationId)
      toast.success("Postulación eliminada")
      loadData()
    } catch (error: any) {
      console.error("Error deleting application:", error)
      toast.error(error.message || "Error al eliminar la postulación")
    }
  }

  useEffect(() => {
    loadData()

    // Escuchar TODOS los eventos de cambios en aplicaciones
    const handleStatusChange = () => {
      console.log("[CompanyApplicationsPage] Data changed, reloading...")
      loadData()
    }

    window.addEventListener("application-status-changed", handleStatusChange)
    window.addEventListener("application-created", handleStatusChange)
    window.addEventListener("application-deleted", handleStatusChange)
    window.addEventListener("talentbridge-data-updated", handleStatusChange)
    window.addEventListener("practice-deleted", handleStatusChange)

    return () => {
      window.removeEventListener("application-status-changed", handleStatusChange)
      window.removeEventListener("application-created", handleStatusChange)
      window.removeEventListener("application-deleted", handleStatusChange)
      window.removeEventListener("talentbridge-data-updated", handleStatusChange)
      window.removeEventListener("practice-deleted", handleStatusChange)
    }
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  const getStudentName = (userId: string) => {
    const student = students.find((s) => s.id === userId)
    return student?.name || "Usuario desconocido"
  }

  const getPracticeName = (practiceId: string) => {
    const practice = practices.find((p) => p.id === practiceId)
    return practice?.title || "Oferta no encontrada"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Aceptada":
        return <Badge className="bg-green-500">Aceptada</Badge>
      case "Rechazada":
        return <Badge className="bg-red-500 text-white">Rechazada</Badge>
      case "Revisando":
        return <Badge className="bg-yellow-500">En Revisión</Badge>
      default:
        return <Badge variant="secondary">Enviada</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            window.history.pushState({}, '', '/')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }} 
          aria-label="Volver"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-balance">Postulaciones Recibidas</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
            {user?.role === "admin"
              ? "Gestiona todas las postulaciones del sistema"
              : "Gestiona las postulaciones a tus ofertas de trabajo"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Nuevas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.enviadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">En Revisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.revisando}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Aceptadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.aceptadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.rechazadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Postulaciones ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No hay postulaciones aún
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors gap-3"
                >
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{getStudentName(application.userId)}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                          Postulado a: {getPracticeName(application.practiceId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(application.status)}
                      <span className="text-xs text-zinc-500 whitespace-nowrap">
                        {new Date(application.createdAt).toLocaleDateString("es", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {application.status === "Enviada" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReview(application.id)}
                          title="Marcar en revisión"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAccept(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                          title="Aceptar"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(application.id)}
                          title="Rechazar"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(application.id, application.status)}
                          title="Eliminar postulación"
                          className="text-zinc-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {application.status === "Revisando" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAccept(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aceptar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(application.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(application.id, application.status)}
                          title="Eliminar postulación"
                          className="text-zinc-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {application.status === "Rechazada" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.history.pushState({}, "", `/user/${application.userId}`)
                            window.dispatchEvent(new PopStateEvent("popstate"))
                          }}
                        >
                          Ver perfil
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(application.id, application.status)}
                          title="Eliminar postulación"
                          className="text-zinc-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {application.status === "Aceptada" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.history.pushState({}, "", `/user/${application.userId}`)
                          window.dispatchEvent(new PopStateEvent("popstate"))
                        }}
                      >
                        Ver perfil
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyApplicationsPage
