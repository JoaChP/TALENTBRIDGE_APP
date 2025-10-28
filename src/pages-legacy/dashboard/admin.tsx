"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import { mockApi } from "../../mocks/api"
import { useAuthStore } from "../../stores/auth-store"
import type { User, Practice, Application, Role } from "../../types"
import { Trash2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  
  const [operationInProgress, setOperationInProgress] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [usersPage, setUsersPage] = useState(1)
  const [practicesPage, setPracticesPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const refreshUser = useAuthStore((s) => s.refreshUser)
  const currentUser = useAuthStore((s) => s.user)

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
    } catch (err) {
      console.error(err)
      toast.error("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const handle = () => {
      loadData()
      refreshUser()
    }
    window.addEventListener('talentbridge-data-updated', handle)
    return () => window.removeEventListener('talentbridge-data-updated', handle)
  }, [])

  // small helpers
  const paginated = <T,>(items: T[], page: number) => {
    const start = (page - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  }

  const handleDeletePractice = async (id: string) => {
    if (!confirm('¿Eliminar oferta?')) return
    setOperationInProgress(true)
    try {
      await mockApi.deletePractice(id)
      toast.success('Oferta eliminada')
      loadData()
    } catch (e) {
      console.error(e)
      toast.error('Error al eliminar')
    } finally { setOperationInProgress(false) }
  }

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Eliminar usuario ${name}?`)) return
    setOperationInProgress(true)
    try {
      await mockApi.deleteUser(id)
      toast.success('Usuario eliminado')
      if (currentUser?.id === id) await refreshUser()
      loadData()
    } catch (e) {
      console.error(e)
      toast.error('Error al eliminar usuario')
    } finally { setOperationInProgress(false) }
  }

  if (loading) return <LoadingSkeleton />

  const filteredUsers = users.filter(u => roleFilter === 'all' || u.role === roleFilter)
  const usersTotalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const pagedUsers = paginated(filteredUsers, usersPage)

  const pagedPractices = paginated(practices, practicesPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="mt-1 text-sm text-zinc-600">Gestiona usuarios, ofertas y aplicaciones</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setLoading(true); loadData(); toast.success('Lista actualizada') }} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total usuarios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ofertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ofertas publicadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Solicitudes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationInProgress ? '...' : ''}</div>
            <p className="text-xs text-muted-foreground mt-1">Operaciones en curso</p>
          </CardContent>
        </Card>
      </div>

      {/* Users list */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as Role | 'all'); setUsersPage(1) }} className="px-2 py-1 border rounded">
                <option value="all">Todos</option>
                <option value="estudiante">Estudiantes</option>
                <option value="empresa">Empresas</option>
                <option value="admin">Administradores</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => { setLoading(true); loadData(); toast.success('Lista actualizada') }} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pagedUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-zinc-600">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{u.role}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(u.id, u.name)} disabled={operationInProgress}><Trash2 className="h-4 w-4" /></Button>
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

      {/* Practices list */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Ofertas ({practices.length})</CardTitle>
          <div className="flex items-center gap-2">
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPracticesPage(1) }} className="px-2 py-1 border rounded">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <Button onClick={() => loadData()}>Crear Nueva Oferta</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pagedPractices.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-zinc-600">{p.company?.name} • {p.city}, {p.country}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeletePractice(p.id)} disabled={operationInProgress}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
