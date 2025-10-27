"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Thread } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"

export default function MessagesPage() {
  const user = useAuthStore((state) => state.user)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingThread, setDeletingThread] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleDeleteThread = async (threadId: string, threadName: string) => {
    if (!confirm(`¿Estás seguro de eliminar la conversación con ${threadName}?`)) return

    setDeletingThread(threadId)
    try {
      await mockApi.deleteThread(threadId)
      toast.success("Conversación eliminada")
      setThreads(prev => prev.filter(t => t.id !== threadId))
    } catch (error) {
      console.error("Error deleting thread:", error)
      toast.error("Error al eliminar la conversación")
    } finally {
      setDeletingThread(null)
    }
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

  // Pagination
  const totalPages = Math.ceil(threads.length / itemsPerPage)
  const paginatedThreads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return threads.slice(startIndex, endIndex)
  }, [threads, currentPage, itemsPerPage])

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Mensajes</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tus conversaciones con empresas y candidatos
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          {threads.length > 0 && (
            <>
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
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const confirmText = user.role === "admin" 
                    ? "¿Estás seguro de eliminar TODOS los mensajes y conversaciones del sistema?"
                    : "¿Estás seguro de eliminar TODAS tus conversaciones?"
                  
                  if (confirm(confirmText)) {
                    if (user.role === "admin") {
                      // Admin deletes ALL threads
                      await mockApi.clearAllThreadsAndMessages()
                      toast.success("Todos los mensajes han sido eliminados")
                    } else {
                      // Users delete only their own threads
                      const userThreadIds = threads.map(t => t.id)
                      for (const threadId of userThreadIds) {
                        await mockApi.deleteThread(threadId)
                      }
                      toast.success("Todas tus conversaciones han sido eliminadas")
                    }
                    setThreads([])
                  }
                }}
                className="text-red-600 hover:text-red-700 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Todos
              </Button>
            </>
          )}
        </div>
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
        <>
          <div className="space-y-3">
            {paginatedThreads.map((thread) => (
              <Card key={thread.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleNavigation(`/messages/${thread.id}`)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
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
                  </button>
                  
                  {/* Delete button (visible for all users) */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteThread(thread.id, thread.partnerName || 'esta conversación')}
                    disabled={deletingThread === thread.id}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                    title="Eliminar conversación"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline mr-1">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
