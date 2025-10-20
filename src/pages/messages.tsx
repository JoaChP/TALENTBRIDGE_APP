"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  // Extract thread id from the path when present (client-side). This avoids depending on react-router during prerender.
  let id: string | undefined = undefined
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean)
    // expected path /mensajes/:id
    if (parts[0] === "mensajes" && parts.length > 1) {
      id = parts[1]
    }
  }
  const router = useRouter()
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const data = await mockApi.listThreads()
        setThreads(data)
      } catch (error) {
        console.error("[v0] Error loading threads:", error)
      } finally {
        setLoading(false)
      }
    }

    loadThreads()
  }, [])

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
              onClick={() => router.push(`/mensajes/${thread.id}`)}
            >
              <div className="flex items-start gap-3">
                <img src="/diverse-avatars.png" alt="" className="h-12 w-12 rounded-full" />
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

function ConversationView({ threadId }: { threadId: string }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const [threadData, messagesData] = await Promise.all([
          mockApi.getThread(threadId),
          mockApi.listMessages(threadId),
        ])
        setThread(threadData)
        setMessages(messagesData)
      } catch (error) {
        console.error("[v0] Error loading conversation:", error)
        toast.error("Error al cargar la conversación")
      } finally {
        setLoading(false)
      }
    }

    loadConversation()
  }, [threadId])

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return

    try {
      const message = await mockApi.sendMessage(threadId, user.id, newMessage)
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    } catch (error) {
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
          <p className="text-sm text-zinc-600">Si crees que debería haber mensajes, es posible que los datos locales estén corruptos.</p>
          <div className="mt-2 flex gap-2">
            <Button
              onClick={() => {
                mockApi.repairStorage()
                // reload the conversation
                window.location.reload()
              }}
            >
              Reparar datos
            </Button>
            <Button variant="ghost" onClick={() => router.push('/mensajes')}>
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
  <Button variant="ghost" size="icon" onClick={() => router.push("/mensajes")} aria-label="Volver a mensajes">
          <ChevronLeft className="h-5 w-5" />
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
