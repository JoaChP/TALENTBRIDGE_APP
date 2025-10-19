"use client"

import { Mail, Phone, Edit, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { useAuthStore } from "../stores/auth-store"
import { useNavigate } from "react-router-dom"
import Hello from "../components/hello"

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mi Perfil</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Gestiona tu información personal</p>
        <div className="mt-3">
          <Hello name={user.name} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={user.avatarUrl || "/placeholder.svg"}
              alt={`Foto de perfil de ${user.name}`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{user.role}</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" aria-hidden="true" />
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-zinc-500" aria-hidden="true" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Correo electrónico</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Teléfono</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user.about && (
        <Card>
          <CardHeader>
            <CardTitle>Acerca de mí</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">{user.about}</p>
          </CardContent>
        </Card>
      )}

      {user.role === "estudiante" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => navigate("/buscar")}>
            Buscar Prácticas
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => navigate("/dashboard/estudiante")}>
            Ver Mis Postulaciones
          </Button>
        </div>
      )}

      <Card className="border-red-200 dark:border-red-900">
        <CardContent className="p-6">
          <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
