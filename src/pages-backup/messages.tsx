"use client"

/*
  Archivo: src/pages-backup/messages.tsx
  Propósito:
    - Implementa la UI de mensajería (backup) usada para listar hilos y ver conversaciones.
    - Mantiene dos responsabilidades principales: (1) listar threads y navegar a una conversación;
      y (2) mostrar la conversación seleccionada, permitir envío de mensajes y restauración de datos.

  Componentes exportados:
    - MessagesPage: lista hilos disponibles para el usuario actual y permite navegar a /messages/:id.
    - ConversationView: vista de un hilo (mensajes, envío, permisos y reparación automática de datos).

  Entradas/Dependencias:
    - Usa `useAuthStore` para obtener `user` (shape esperado: { id, role }).
    - Usa `mockApi` para operar sobre threads y messages (listThreads, getThread, listMessages, sendMessage).
    - Muestra notificaciones via `sonner` (toast) y usa navegación con `window.location`/`history`.

  Efectos secundarios y consideraciones:
    - Verifica permisos según `user.role` (admin, empresa, estudiante) antes de exponer datos.
    - Si no hay datos locales en el cliente, intenta restaurar desde `/api/data` y guarda en localStorage.
    - Este archivo es una copia de respaldo; si se migra el backend a JSONBin, actualizar las llamadas a `mockApi` y la lógica de "tryRepair".

  Notas de mantenimiento:
    - Mantener la separación entre la lista de hilos y la vista de conversación facilita migraciones.
    - Para cambios grandes, prefiera extraer la lógica de permisos a helpers reutilizables.
*/
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Send, ChevronLeft } from "lucide-react"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Thread, Message } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"

export function MessagesPage() {
  // Componente: MessagesPage
  // - Renderiza la lista de hilos (threads) a los que el usuario tiene acceso.
  // - No recibe props; depende del estado global de `useAuthStore`.
  const user = useAuthStore((state) => state.user)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  
  // Extract ID from URL path
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const id = pathname.startsWith("/messages/") || pathname.startsWith("/mensajes/") 
    ? pathname.split("/").pop() 
    : undefined

  const handleNavigation = (path: string) => {
    window.location.href = path
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
          
          // Get threads related to my practices
          userThreads = data.filter((t) => 
            t.practiceId && myPracticeIds.includes(t.practiceId)
          )
          console.log("Company viewing their threads:", userThreads.length, "out of", data.length)
        } else {
          // Students: filter by userId
          userThreads = data.filter((t) => t.userId === user.id)
          console.log("Student viewing their threads:", userThreads.length)
        }
        
        setThreads(userThreads)
      } catch (error) {
        console.error("[v0] Error loading threads:", error)
      } finally {
        setLoading(false)
      }
    }

    loadThreads()
  }, [user])

  if (id) {
    return <ConversationView threadId={id} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mensajes</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Tus conversaciones con empresas y candidatos
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Card
              key={thread.id}
              className="cursor-pointer p-4 transition-shadow hover:shadow-md"
              onClick={() => handleNavigation(`/messages/${thread.id}`)}
            >
              <div className="flex items-start gap-3">
                <Image
                  src="/diverse-avatars.png"
                  alt={`Avatar de ${thread.partnerName}`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{thread.partnerName}</h3>
                    {thread.partnerIsEmpresa && (
                      <Badge variant="secondary" className="text-xs">
                        Empresa
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">{thread.lastSnippet}</p>
                </div>
                {thread.unread && <div className="h-2 w-2 rounded-full bg-indigo-600" aria-label="Mensaje no leído" />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessagesPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}

function ConversationView({ threadId }: { threadId: string }) {
  // Componente: ConversationView
  // - Carga thread y mensajes para `threadId`.
  // - Verifica permisos (admin/empresa/estudiante) antes de exponer contenido.
  // - Permite enviar mensajes usando `mockApi.sendMessage` y reintenta restaurar datos desde /api/data si falta información.
  const user = useAuthStore((state) => state.user)
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const attemptedRepairRef = useRef(false)

  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return
      
      try {
        const [threadData, messagesData] = await Promise.all([
          mockApi.getThread(threadId),
          mockApi.listMessages(threadId),
        ])
        
        // Validate access permissions
        if (user.role === "admin") {
          // Admins can see all conversations
          setThread(threadData)
          setMessages(messagesData)
        } else if (user.role === "empresa") {
          // Companies can only see conversations for their practices
          const practices = await mockApi.listPractices()
          const myPracticeIds = practices
            .filter(p => p.company.ownerUserId === user.id)
            .map(p => p.id)
          
          if (threadData.practiceId && myPracticeIds.includes(threadData.practiceId)) {
            setThread(threadData)
            setMessages(messagesData)
          } else {
            toast.error("No tienes permiso para ver esta conversación")
            window.history.back()
          }
        } else {
          // Students can only see their own conversations
          if (threadData.userId === user.id) {
            setThread(threadData)
            setMessages(messagesData)
          } else {
            toast.error("No tienes permiso para ver esta conversación")
            window.history.back()
          }
        }
      } catch (error) {
        console.error("[v0] Error loading conversation:", error)
        toast.error("Error al cargar la conversación")
      } finally {
        setLoading(false)
      }
    }

    void loadConversation()
  }, [threadId, user])

  useEffect(() => {
    if (loading || thread || attemptedRepairRef.current) {
      return
    }

    attemptedRepairRef.current = true

    const tryRepair = async () => {
      try {
        const res = await fetch("/api/data")
        if (!res.ok) throw new Error("No server data")
        const json = await res.json()
        if (typeof window !== "undefined") {
          localStorage.setItem("talentbridge_data", JSON.stringify(json))
        }
        toast.success("Datos restaurados. Recargando conversación...")
        setTimeout(() => window.location.reload(), 700)
      } catch (error) {
        console.error("[v0] No fue posible restaurar los datos automáticamente", error)
        toast.error("No fue posible restaurar los datos automáticamente")
      }
    }

    void tryRepair()
  }, [loading, thread])

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return

    try {
      const message = await mockApi.sendMessage(threadId, user.id, newMessage)
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("[v0] Error sending message", error)
      toast.error("Error al enviar el mensaje")
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!thread) {
    return (
      <div className="space-y-4">
        <div>Conversación no encontrada</div>
        <div>
          <p className="text-sm text-zinc-600">
            Si crees que debería haber mensajes, intentamos restaurar los datos automáticamente.
          </p>
          <div className="mt-2">
            <Button variant="ghost" onClick={() => handleNavigation("/messages")}>
              Volver a conversaciones
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" onClick={() => handleNavigation("/messages")} className="gap-2">
          <ChevronLeft className="h-5 w-5" />
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{thread.partnerName}</h1>
          {thread.partnerIsEmpresa && (
            <Badge variant="secondary" className="text-xs">
              Empresa
            </Badge>
          )}
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => {
            const isOwn = message.fromUserId === user?.id
            return (
              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  }`}
                >
                  <p className="text-sm text-pretty">{message.text}</p>
                  <p className={`mt-1 text-xs ${isOwn ? "text-indigo-200" : "text-zinc-500"}`}>
                    {new Date(message.createdAt).toLocaleTimeString("es", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              aria-label="Mensaje"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()} aria-label="Enviar mensaje">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
