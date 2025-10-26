"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import type { Application, Practice, User } from "../types"
import { CheckCircle, XCircle, Eye, User as UserIcon, Briefcase, ChevronLeft, Trash2, ChevronRight, PlusCircle, FileText, Mail, Phone } from "lucide-react"
import { toast } from "sonner"

export function CompanyApplicationsPage() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<"postulaciones" | "publicar">("postulaciones")
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

  // Pagination
  const totalPages = Math.ceil(applications.length / itemsPerPage)
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return applications.slice(startIndex, endIndex)
  }, [applications, currentPage, itemsPerPage])

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

  const getStudent = (userId: string) => {
    return students.find((s) => s.id === userId)
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              window.location.href = '/'
            }} 
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión Empresarial</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("postulaciones")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "postulaciones"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <FileText className="h-4 w-4" />
            Ver Postulaciones
          </button>
          <button
            onClick={() => setActiveTab("publicar")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "publicar"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Publicar Oferta
          </button>
        </div>
      </div>

      {activeTab === "publicar" ? (
        // Redirigir a la página de publicar
        <div className="flex items-center justify-center py-12">
          <Button
            size="lg"
            onClick={() => window.location.href = '/publish'}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Ir a Publicar Oferta
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Nuevas</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.enviadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">En Revisión</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.revisando}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Aceptadas</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.aceptadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.rechazadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Lista de Postulaciones ({applications.length})
            </CardTitle>
            {applications.length > 0 && (
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">{applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No hay postulaciones aún
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedApplications.map((application) => {
                  const student = getStudent(application.userId)
                  return (
                  <div
                    key={application.id}
                    className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {/* Información del Estudiante */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <UserIcon className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div>
                            <p className="font-semibold text-base sm:text-lg break-words">{student?.name || "Usuario desconocido"}</p>
                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 break-words">
                              Postulado a: <span className="font-medium">{getPracticeName(application.practiceId)}</span>
                            </p>
                          </div>
                          
                          {/* Información de Contacto */}
                          <div className="space-y-1.5 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                              <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                              <a 
                                href={`mailto:${student?.email}`}
                                className="hover:text-indigo-600 hover:underline break-all"
                              >
                                {student?.email || "Sin email"}
                              </a>
                            </div>
                            {student?.phone && (
                              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                <Phone className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                                <a 
                                  href={`tel:${student.phone}`}
                                  className="hover:text-indigo-600 hover:underline"
                                >
                                  {student.phone}
                                </a>
                              </div>
                            )}
                            {student?.about && (
                              <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-1">Sobre el candidato:</p>
                                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 break-words whitespace-pre-wrap">
                                  {student.about}
                                </p>
                              </div>
                            )}
                          </div>
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

                    <div className="flex items-center gap-2 flex-wrap">
                      {application.status === "Enviada" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(application.id)}
                            title="Marcar en revisión"
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Revisar</span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAccept(application.id)}
                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                            title="Aceptar"
                          >
                            <CheckCircle className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Aceptar</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(application.id)}
                            title="Rechazar"
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                          >
                            <XCircle className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Rechazar</span>
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
                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aceptar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(application.id)}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
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
                              window.location.href = `/user/${application.userId}`
                            }}
                            className="flex-1 sm:flex-none"
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
                            window.location.href = `/user/${application.userId}`
                          }}
                          className="w-full sm:w-auto"
                        >
                          Ver perfil
                        </Button>
                      )}
                    </div>
                  </div>
                )})}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 mt-4 border-t">
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex-1 sm:flex-none"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex-1 sm:flex-none"
                    >
                      <span className="hidden sm:inline mr-1">Siguiente</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}

export default CompanyApplicationsPage
