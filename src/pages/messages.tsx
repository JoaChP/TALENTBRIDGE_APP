"use client"

import { useState, useEffect } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Thread } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export default function MessagesPage() {
  const user = useAuthStore((state) => state.user)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  useEffect(() => {
    const loadThreads = async () => {
      if (!user) return
      
      try {
        const data = await mockApi.listThreads()
        
        let userThreads: Thread[] = []
        
        if (user.role === "admin") {
          // Admins see ALL threads
          userThreads = data
          console.log("Admin viewing all threads:", data.length)
        } else if (user.role === "empresa") {
          // Companies: filter by threads related to their practices only
          const practices = await mockApi.listPractices()
          const myPracticeIds = practices
            .filter(p => p.company.ownerUserId === user.id)
            .map(p => p.id)
          
          userThreads = data.filter(thread => 
            thread.practiceId && myPracticeIds.includes(thread.practiceId)
          )
          console.log("Company viewing their threads:", userThreads.length)
        } else {
          // Students: filter by their own threads
          userThreads = data.filter(thread => 
            thread.userId === user.id
          )
          console.log("Student viewing their threads:", userThreads.length)
        }
        
        setThreads(userThreads)
      } catch (error) {
        console.error("Error loading threads:", error)
        toast.error("Error al cargar los mensajes")
      } finally {
        setLoading(false)
      }
    }

    loadThreads()
    
    // Escuchar TODOS los eventos de cambios en threads/mensajes
    const handleDataUpdate = () => {
      console.log("[MessagesPage] Data updated, reloading threads...")
      loadThreads()
    }
    
    window.addEventListener("talentbridge-data-updated", handleDataUpdate)
    window.addEventListener("thread-created", handleDataUpdate)
    window.addEventListener("message-sent", handleDataUpdate)
    
    return () => {
      window.removeEventListener("talentbridge-data-updated", handleDataUpdate)
      window.removeEventListener("thread-created", handleDataUpdate)
      window.removeEventListener("message-sent", handleDataUpdate)
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  // Show threads list
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mensajes</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tus conversaciones con empresas y candidatos
          </p>
        </div>
        {user.role === "admin" && threads.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (confirm("¿Estás seguro de eliminar TODOS los mensajes y conversaciones?")) {
                await mockApi.clearAllThreadsAndMessages()
                toast.success("Todos los mensajes han sido eliminados")
                setThreads([])
              }
            }}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Todos
          </Button>
        )}
      </div>

      {threads.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-2">
            <p className="text-lg font-medium">No tienes mensajes</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Los mensajes aparecerán aquí cuando tengas conversaciones activas
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card key={thread.id} className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <button
                onClick={() => handleNavigation(`/messages/${thread.id}`)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {thread.partnerName?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {thread.partnerName || 'Empresa'}
                      </h3>
                      <span className="text-xs text-zinc-500">
                        Reciente
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                      {thread.lastSnippet || 'Práctica profesional'}
                    </p>
                  </div>
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
