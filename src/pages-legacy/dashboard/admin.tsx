"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
export { AdminDashboard }
export default AdminDashboard
import { Badge } from "../../components/ui/badge"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import { mockApi } from "../../mocks/api"
import { useAuthStore } from "../../stores/auth-store"
import type { User, Practice, Role } from "../../types"
import { FileCheck, MessageSquare, Trash2, Edit, UserCog, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { RefreshBar } from "../../components/refresh-bar"
import { toast } from "sonner"

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [operationInProgress, setOperationInProgress] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
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

      if (currentUser?.id === userId) {
        await refreshUser()
      }

      loadData()
    } catch (error) {
      console.error("Error changing role:", error)
      toast.error("Error al cambiar el rol")
    } finally {
      setOperationInProgress(false)
    }
  }

  useEffect(() => {
    loadData()

    const handleDataUpdate = () => {
      console.log("[AdminDashboard] Data updated event received, reloading...")
      loadData()
      refreshUser()
    }

    window.addEventListener('talentbridge-data-updated', handleDataUpdate)
    return () => window.removeEventListener('talentbridge-data-updated', handleDataUpdate)
  }, [])

  if (loading) return <LoadingSkeleton />

  // Pagination helpers for users
  const filteredUsers = users.filter(u => roleFilter === "all" || u.role === roleFilter)
  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const usersStart = (usersPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(usersStart, usersStart + itemsPerPage)

  // Pagination helpers for practices
  const practicesTotalPages = Math.ceil(practices.length / itemsPerPage)
  const practicesStart = (practicesPage - 1) * itemsPerPage
  const paginatedPractices = practices.slice(practicesStart, practicesStart + itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Panel de Administración</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Gestiona usuarios, ofertas y aplicaciones del sistema</p>
        </div>
        <RefreshBar onRefresh={loadData} lastUpdate={lastUpdate} loading={loading} label="Actualizar" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.estudiantes} estudiantes, {stats.empresas} empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ofertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPractices}</div>
            <p className="text-xs text-muted-foreground mt-1">Ofertas publicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Solicitudes de estudiantes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">Administradores del sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Section */}
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Usuarios Registrados ({filteredUsers.length})</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as Role | "all"); setUsersPage(1); }} className="px-2 py-1 border rounded">
                <option value="all">Todos los roles</option>
                <option value="estudiante">Estudiantes</option>
                <option value="empresa">Empresas</option>
                <option value="admin">Administradores</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => { setLoading(true); loadData(); toast.success('Lista actualizada'); }} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-zinc-600">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{u.role}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleChangeRole(u.id, u.name, u.role)} disabled={operationInProgress}><UserCog className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id, u.name)} className="text-red-600" disabled={operationInProgress}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}

            {usersTotalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm">Página {usersPage} de {usersTotalPages}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setUsersPage(p => Math.min(usersTotalPages, p + 1))} disabled={usersPage === usersTotalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Practices Section */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Ofertas de Trabajo Publicadas</CardTitle>
          <div className="flex items-center gap-2">
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPracticesPage(1); }} className="px-2 py-1 border rounded">
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
            <Button onClick={() => handleNavigation('/publish')}>Crear Nueva Oferta</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedPractices.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-zinc-600">{p.company.name} • {p.city}, {p.country}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleNavigation(`/oferta/${p.id}/edit`)} disabled={operationInProgress}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePractice(p.id)} className="text-red-600" disabled={operationInProgress}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}

            {practicesTotalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm">Página {practicesPage} de {practicesTotalPages}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPracticesPage(p => Math.max(1, p - 1))} disabled={practicesPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setPracticesPage(p => Math.min(practicesTotalPages, p + 1))} disabled={practicesPage === practicesTotalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
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
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Supervisa todas las postulaciones y su estado</p>
            <Button onClick={() => handleNavigation('/company-applications')} className="w-full"><FileCheck className="h-4 w-4 mr-2" />Ver Todas las Postulaciones</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ver Todas las Conversaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Accede a todos los mensajes del sistema</p>
            <Button onClick={() => handleNavigation('/messages')} className="w-full"><MessageSquare className="h-4 w-4 mr-2" />Ver Mensajes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



// The component is exported as default above (export default function AdminDashboard)
