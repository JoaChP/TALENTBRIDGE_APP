"use client"

import { useEffect, useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Thread, Message } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { ArrowLeft, Send } from "lucide-react"
import { toast } from "sonner"

export default function MessageDetailPage() {
  const user = useAuthStore((state) => state.user)
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const threadId = window.location.pathname.split("/messages/")[1]

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  useEffect(() => {
    const loadThreadData = async () => {
      if (!user || !threadId) return

      try {
        // Load thread
        const threads = await mockApi.listThreads()
        const currentThread = threads.find(t => t.id === threadId)
        
        if (!currentThread) {
          toast.error("Conversación no encontrada")
          handleNavigation("/messages")
          return
        }

        setThread(currentThread)

        // Load messages
        const threadMessages = await mockApi.listMessages(threadId)
        setMessages(threadMessages)
      } catch (error) {
        console.error("Error loading thread:", error)
        toast.error("Error al cargar los mensajes")
      } finally {
        setLoading(false)
      }
    }

    loadThreadData()
  }, [user, threadId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user || !threadId) return

    setSending(true)
    try {
      const message = await mockApi.sendMessage(threadId, user.id, newMessage.trim())
      setMessages([...messages, message])
      setNewMessage("")
      
      // Scroll to bottom
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error al enviar el mensaje")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!thread) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">Conversación no encontrada</p>
          <Button onClick={() => handleNavigation("/messages")} className="mt-4">
            Volver a Mensajes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigation("/messages")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">{thread.partnerName}</h2>
          <p className="text-xs text-zinc-500">
            {thread.partnerIsEmpresa ? "Empresa" : "Candidato"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No hay mensajes aún. ¡Inicia la conversación!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.fromUserId === user?.id
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] sm:max-w-[60%] p-3 ${
                    isOwn
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn
                        ? "text-indigo-200"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString("es-CL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={sending}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !newMessage.trim()}>
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Enviar</span>
        </Button>
      </form>
    </div>
  )
}
