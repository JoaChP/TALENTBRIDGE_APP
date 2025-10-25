"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import { mockApi } from "../../mocks/api"
import type { User, Practice, Application, Role } from "../../types"
import { Users, Briefcase, FileCheck, MessageSquare, Trash2, Edit, UserCog } from "lucide-react"
import { toast } from "sonner"

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    estudiantes: 0,
    empresas: 0,
    admins: 0,
    totalPractices: 0,
    totalApplications: 0,
  })

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const loadData = async () => {
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
    }
  }

  const handleDeletePractice = async (practiceId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta oferta?")) return

    try {
      await mockApi.deletePractice(practiceId)
      toast.success("Oferta eliminada correctamente")
      loadData() // Reload data
    } catch (error) {
      console.error("Error deleting practice:", error)
      toast.error("Error al eliminar la oferta")
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${userName}? Esta acción no se puede deshacer.`)) return

    try {
      await mockApi.deleteUser(userId)
      toast.success("Usuario eliminado correctamente")
      loadData() // Reload data
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Error al eliminar el usuario")
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

    try {
      await mockApi.updateUserRole(userId, newRole)
      toast.success(`Rol de ${userName} actualizado a ${newRole}`)
      loadData() // Reload data
    } catch (error) {
      console.error("Error changing role:", error)
      toast.error("Error al cambiar el rol")
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Panel de Administración</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Gestiona usuarios, ofertas y aplicaciones del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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
          <CardTitle>Usuarios Registrados ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    user.role === "admin" ? "default" :
                    user.role === "empresa" ? "secondary" :
                    "outline"
                  }>
                    {user.role === "estudiante" ? "Estudiante" :
                     user.role === "empresa" ? "Empresa" :
                     "Administrador"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangeRole(user.id, user.name, user.role)}
                    title="Cambiar rol"
                  >
                    <UserCog className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practices Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ofertas de Trabajo Publicadas</CardTitle>
          <Button onClick={() => handleNavigation("/publish")}>
            Crear Nueva Oferta
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {practices.length === 0 ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center py-8">
                No hay ofertas publicadas
              </p>
            ) : (
              practices.map((practice) => (
                <div key={practice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{practice.title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {practice.company.name} • {practice.city}, {practice.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{practice.status}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigation(`/oferta/${practice.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePractice(practice.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ver Todas las Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Gestiona y modera todas las solicitudes de estudiantes
            </p>
            <Button onClick={() => handleNavigation("/company-applications")} className="w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              Ver Postulaciones
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
