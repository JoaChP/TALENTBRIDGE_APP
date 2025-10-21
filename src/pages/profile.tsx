"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Phone, Edit, LogOut, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { useAuthStore } from "../stores/auth-store"
import Image from "next/image"
import { toast } from "sonner"

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    about: user?.about || "",
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB")
      return
    }

    // Crear URL temporal para previsualización
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result as string
      if (user) {
        updateProfile({ ...user, avatarUrl: imageUrl })
        toast.success("Foto de perfil actualizada")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSaveProfile = () => {
    if (!user) return
    
    updateProfile(formData)
    
    setIsEditing(false)
    toast.success("Perfil actualizado correctamente")
  }

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      about: user?.about || "",
    })
    setIsEditing(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mi Perfil</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Gestiona tu información personal</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative group">
              <Image
                src={user?.avatarUrl || "/placeholder.svg"}
                alt={`Foto de perfil de ${user?.name}`}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-6 w-6 text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleOpenEdit}>
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
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
          {user?.phone && (
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

      {user?.about && (
        <Card>
          <CardHeader>
            <CardTitle>Acerca de mí</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">{user.about}</p>
          </CardContent>
        </Card>
      )}

      {user?.role === "estudiante" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => navigate("/search")}>
            Buscar Prácticas
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => navigate("/postulaciones")}>
            Ver Mis Postulaciones
          </Button>
        </div>
      )}

      <Card className="border-red-200 dark:border-red-900">
        <CardContent className="p-6">
          <Button className="w-full gap-2" variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

      {/* Dialog para editar perfil */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold">Editar Perfil</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Actualiza tu información personal</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="about">Acerca de mí</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProfilePage
