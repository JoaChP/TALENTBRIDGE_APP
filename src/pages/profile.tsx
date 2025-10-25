"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, Edit, LogOut, Camera, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { useAuthStore } from "../stores/auth-store"
import { mockApi } from "../mocks/api"
import type { Practice, Application } from "../types"
import Image from "next/image"
import { toast } from "sonner"

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    about: user?.about || "",
  })
  
  // Estado para empresas
  const [myPractices, setMyPractices] = useState<Practice[]>([])
  const [applicationsToMyPractices, setApplicationsToMyPractices] = useState<Application[]>([])
  const [loadingCompanyData, setLoadingCompanyData] = useState(false)

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
  
  // Cargar datos de la empresa
  useEffect(() => {
    if (user?.role === "empresa") {
      loadCompanyData()
    }
    
    // Escuchar cambios en los datos
    const handleDataUpdate = () => {
      if (user?.role === "empresa") {
        console.log("[ProfilePage] Data updated, reloading company data...")
        loadCompanyData()
      }
    }
    
    window.addEventListener("talentbridge-data-updated", handleDataUpdate)
    
    return () => {
      window.removeEventListener("talentbridge-data-updated", handleDataUpdate)
    }
  }, [user])
  
  const loadCompanyData = async () => {
    if (!user) return
    
    setLoadingCompanyData(true)
    try {
      // Obtener todas las prácticas
      const allPractices = await mockApi.listPractices()
      console.log("[ProfilePage] All practices:", allPractices.length)
      console.log("[ProfilePage] Current user ID:", user.id)
      
      // Filtrar solo las de esta empresa
      const companyPractices = allPractices.filter(p => {
        console.log(`[ProfilePage] Practice "${p.title}" ownerUserId: ${p.company.ownerUserId}`)
        return p.company.ownerUserId === user.id
      })
      console.log("[ProfilePage] Company practices filtered:", companyPractices.length)
      setMyPractices(companyPractices)
      
      // Obtener todas las aplicaciones a mis prácticas
      const allApplications = await mockApi.listApplications("all")
      const myPracticeIds = companyPractices.map(p => p.id)
      const applicationsToMe = allApplications.filter(app => myPracticeIds.includes(app.practiceId))
      console.log("[ProfilePage] Applications to my practices:", applicationsToMe.length)
      setApplicationsToMyPractices(applicationsToMe)
    } catch (error) {
      console.error("Error loading company data:", error)
    } finally {
      setLoadingCompanyData(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
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
            <CardTitle>Acerca de {user.role === "empresa" ? "la empresa" : "mí"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">{user.about}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Sección especial para empresas */}
      {user?.role === "empresa" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Estadísticas de mi empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{myPractices.length}</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Ofertas publicadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{applicationsToMyPractices.length}</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Postulaciones recibidas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {applicationsToMyPractices.filter(a => a.status === "Aceptada").length}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Candidatos aceptados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Mis Ofertas Publicadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myPractices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    {loadingCompanyData ? "Cargando ofertas..." : "Aún no has publicado ninguna oferta"}
                  </p>
                  {!loadingCompanyData && (
                    <>
                      <Button onClick={() => {
                        window.history.pushState({}, '', "/publish")
                        window.dispatchEvent(new PopStateEvent('popstate'))
                      }}>
                        Publicar primera oferta
                      </Button>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            if (!user) return
                            const count = await mockApi.migratePracticesToUser("2", user.id)
                            if (count > 0) {
                              toast.success(`Se migraron ${count} ofertas a tu cuenta`)
                              loadCompanyData()
                            } else {
                              toast.info("No hay ofertas para migrar")
                            }
                          }}
                        >
                          🔄 Migrar ofertas antiguas
                        </Button>
                        <p className="text-xs text-zinc-500 mt-2">
                          Si creaste ofertas antes, haz clic para asignarlas a tu cuenta
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {myPractices.map((practice) => {
                    const practiceApplications = applicationsToMyPractices.filter(a => a.practiceId === practice.id)
                    return (
                      <div key={practice.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{practice.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{practice.status}</Badge>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {practiceApplications.length} postulaciones
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.history.pushState({}, '', `/oferta/${practice.id}`)
                            window.dispatchEvent(new PopStateEvent('popstate'))
                          }}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={() => {
              window.history.pushState({}, '', "/publish")
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}>
              Publicar Nueva Oferta
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
              window.history.pushState({}, '', "/company-applications")
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}>
              Ver Postulaciones Recibidas
            </Button>
          </div>
        </>
      )}

      {user?.role === "estudiante" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => {
            window.history.pushState({}, '', "/search")
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}>
            Buscar Prácticas
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
            window.history.pushState({}, '', "/postulaciones")
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}>
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

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
