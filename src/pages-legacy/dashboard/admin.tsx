"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import { mockApi } from "../../mocks/api"
import { useAuthStore } from "../../stores/auth-store"
import type { User, Practice, Application, Role } from "../../types"
import { Users, Briefcase, FileCheck, MessageSquare, Trash2, Edit, UserCog, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { RefreshBar } from "../../components/refresh-bar"
import { toast } from "sonner"

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [operationInProgress, setOperationInProgress] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [usersPage, setUsersPage] = useState(1)
  const [practicesPage, setPracticesPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [stats, setStats] = useState({
    totalUsers: 0,
    estudiantes: 0,
    empresas: 0,
    admins: 0,
    totalPractices: 0,
    totalApplications: 0,
  })
  
  const refreshUser = useAuthStore((s) => s.refreshUser)
  const currentUser = useAuthStore((s) => s.user)

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersData, practicesData, applicationsData] = await Promise.all([
        mockApi.listUsers(),
        mockApi.listPractices(),
        mockApi.listApplications("all"),
      ])

      setUsers(usersData)
      setPractices(practicesData)
      setApplications(applicationsData)

      // Calculate stats
      const estudiantes = usersData.filter(u => u.role === "estudiante").length
      const empresas = usersData.filter(u => u.role === "empresa").length
      const admins = usersData.filter(u => u.role === "admin").length

      setStats({
        totalUsers: usersData.length,
        estudiantes,
        empresas,
        admins,
        totalPractices: practicesData.length,
        totalApplications: applicationsData.length,
      })
    } catch (error) {
      console.error("Error loading admin data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
      setLastUpdate(new Date())
    }
  }

  const handleDeletePractice = async (practiceId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta oferta?")) return

    setOperationInProgress(true)
    try {
      await mockApi.deletePractice(practiceId)
      toast.success("Oferta eliminada correctamente")
      loadData() // Reload data
    } catch (error) {
      console.error("Error deleting practice:", error)
      toast.error("Error al eliminar la oferta")
    } finally {
      setOperationInProgress(false)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${userName}? Esta acción no se puede deshacer.`)) return

    setOperationInProgress(true)
    try {
      await mockApi.deleteUser(userId)
      toast.success("Usuario eliminado correctamente")
      
      // Si el usuario eliminado es el usuario actual, refrescar para cerrar sesión
      if (currentUser?.id === userId) {
        await refreshUser()
        // El refreshUser detectará que el usuario fue eliminado y cerrará sesión
        return
      }
      
      loadData() // Reload data
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error al eliminar el usuario")
    } finally {
      setOperationInProgress(false)
    }
  }

  const handleChangeRole = async (userId: string, userName: string, currentRole: Role) => {
    const newRoleInput = prompt(
      `Cambiar rol de ${userName}\n\nRol actual: ${currentRole}\n\nEscribe el nuevo rol:\n- estudiante\n- empresa\n- admin`,
      currentRole
    )

    if (!newRoleInput) return

    const newRole = newRoleInput.toLowerCase().trim() as Role
    
    if (!["estudiante", "empresa", "admin"].includes(newRole)) {
      toast.error("Rol inválido. Usa: estudiante, empresa o admin")
      return
    }

    setOperationInProgress(true)
    try {
      await mockApi.updateUserRole(userId, newRole)
      toast.success(`Rol de ${userName} actualizado a ${newRole}`)
      
      // Si el rol cambiado es el del usuario actual, refrescar datos
      if (currentUser?.id === userId) {
        await refreshUser()
      }
      
      loadData() // Reload data
    } catch (error) {
      console.error("Error changing role:", error)
      toast.error("Error al cambiar el rol")
    } finally {
      setOperationInProgress(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Escuchar eventos de cambios en los datos
    const handleDataUpdate = () => {
      console.log("[AdminDashboard] Data updated event received, reloading...")
      loadData()
      refreshUser() // También refrescar el usuario actual
    }
    
    window.addEventListener('talentbridge-data-updated', handleDataUpdate)
    
    return () => {
      window.removeEventListener('talentbridge-data-updated', handleDataUpdate)
    }
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Panel de Administración</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
            Gestiona usuarios, ofertas y aplicaciones del sistema
          </p>
        </div>
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">Panel de Administración</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
                  Gestiona usuarios, ofertas y aplicaciones del sistema
                </p>
              </div>
              <RefreshBar
                onRefresh={loadData}
                lastUpdate={lastUpdate}
                loading={loading}
                label="Actualizar"
              />
            </div>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.estudiantes} estudiantes, {stats.empresas} empresas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPractices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ofertas publicadas en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Solicitudes de estudiantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Administradores del sistema
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg sm:text-xl">
                Usuarios Registrados ({users.filter(u => roleFilter === "all" || u.role === roleFilter).length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLoading(true)
                  loadData()
                  toast.success("Lista actualizada")
                }}
                disabled={loading}
                title="Recargar lista de usuarios"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as Role | "all")
                  setUsersPage(1) // Reset to first page when filter changes
                }}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
              >
                <option value="all">Todos los roles</option>
                <option value="estudiante">Estudiantes</option>
                <option value="empresa">Empresas</option>
                <option value="admin">Administradores</option>
              </select>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setUsersPage(1) // Reset to first page when items per page changes
                }}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              const filteredUsers = users.filter(u => roleFilter === "all" || u.role === roleFilter)
              const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
              const startIndex = (usersPage - 1) * itemsPerPage
              const endIndex = startIndex + itemsPerPage
              const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

              return (
                <>
                  {paginatedUsers.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Badge 
                          variant="secondary"
                          className={`${
                            user.role === "admin" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200" :
                            user.role === "empresa" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200" :
                            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200"
                          } whitespace-nowrap`}
                        >
                          {user.role === "estudiante" ? "Estudiante" :
                           user.role === "empresa" ? "Empresa" :
                           "Administrador"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleChangeRole(user.id, user.name, user.role)}
                          title="Cambiar rol"
                          disabled={operationInProgress}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar usuario"
                          disabled={operationInProgress}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Página {usersPage} de {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                          disabled={usersPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUsersPage(p => Math.min(totalPages, p + 1))}
                          disabled={usersPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Practices Section */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-4">
          <CardTitle className="text-lg sm:text-xl">Ofertas de Trabajo Publicadas</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setPracticesPage(1) // Reset to first page when items per page changes
              }}
              className="w-full sm:w-auto px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <Button onClick={() => handleNavigation("/publish")} className="w-full sm:w-auto">
              Crear Nueva Oferta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {practices.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center py-8">
                No hay ofertas publicadas
              </p>
            ) : (
              (() => {
                const totalPages = Math.ceil(practices.length / itemsPerPage)
                const startIndex = (practicesPage - 1) * itemsPerPage
                const endIndex = startIndex + itemsPerPage
                const paginatedPractices = practices.slice(startIndex, endIndex)

                return (
                  <>
                    {paginatedPractices.map((practice) => (
                      <div key={practice.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{practice.title}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                            {practice.company.name} • {practice.city}, {practice.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <Badge className="whitespace-nowrap">{practice.status}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNavigation(`/oferta/${practice.id}/edit`)}
                            disabled={operationInProgress}
                            className="flex-1 sm:flex-none"
                          >
                            <Edit className="h-4 w-4 sm:mr-1" />
                            <span className="sm:inline">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePractice(practice.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={operationInProgress}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Página {practicesPage} de {totalPages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPracticesPage(p => Math.max(1, p - 1))}
                            disabled={practicesPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPracticesPage(p => Math.min(totalPages, p + 1))}
                            disabled={practicesPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )
              })()
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestionar Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Supervisa todas las postulaciones y su estado
            </p>
            <Button onClick={() => handleNavigation("/company-applications")} className="w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              Ver Todas las Postulaciones
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ver Todas las Conversaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Accede a todos los mensajes del sistema
            </p>
            <Button onClick={() => handleNavigation("/messages")} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ver Mensajes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
