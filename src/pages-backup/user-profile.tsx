"use client"

// Página: User Profile (backup)
// Carga y muestra el perfil público de un usuario por ID en la URL.
import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { User } from "../types"
import { mockApi } from "../mocks/api"
import { Mail, Phone, ChevronLeft, MessageSquare } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useAuthStore } from "../stores/auth-store"

export function UserProfilePage() {
  const currentUser = useAuthStore((state) => state.user)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Extract userId from URL
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const userId = pathname.startsWith("/user/") ? pathname.split("/").pop() : undefined

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        console.log("No userId found in URL:", pathname)
        setLoading(false)
        return
      }

      console.log("Loading user with ID:", userId)
      console.log("Full pathname:", pathname)

      try {
        mockApi.reloadFromStorage()
        const users = await mockApi.listUsers()
        console.log("All users:", users)
        const foundUser = users.find((u) => u.id === userId)
        
        console.log("Found user:", foundUser)
        
        if (foundUser) {
          setUser(foundUser)
        } else {
          console.error("User not found with ID:", userId)
          toast.error("Usuario no encontrado")
        }
      } catch (error) {
        console.error("Error loading user:", error)
        toast.error("Error al cargar el perfil")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [userId, pathname])

  const handleStartChat = async () => {
    if (!user || !currentUser) return

    try {
      // Find an application to get the practice
      const applications = await mockApi.listApplications("all")
      const userApplication = applications.find((app) => app.userId === user.id)
      
      if (!userApplication) {
        toast.error("No se encontró una aplicación para iniciar el chat")
        return
      }

      const thread = await mockApi.createThreadForApplication(
        userApplication.practiceId,
        user.id
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

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            aria-label="Volver"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Atrás</span>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Usuario no encontrado</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            El usuario que buscas no existe o ha sido eliminado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          aria-label="Volver"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Atrás</span>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-balance">Perfil de Usuario</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Información del candidato
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Image
              src={user.avatarUrl || "/placeholder.svg"}
              alt={`Foto de perfil de ${user.name}`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">
                {user.role}
              </p>
            </div>
            {currentUser && currentUser.id !== user.id && user.role === "estudiante" && (
              <Button className="gap-2" onClick={handleStartChat}>
                <MessageSquare className="h-4 w-4" />
                Enviar mensaje
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Información de Contacto</h3>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-zinc-500" aria-hidden="true" />
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Correo electrónico
              </p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Teléfono
                </p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user.about && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Acerca de mí</h3>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">
              {user.about}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserProfilePage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
