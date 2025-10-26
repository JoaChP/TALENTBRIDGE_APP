"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import type { Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { Edit, Trash2, Eye, Building2, MapPin, Clock } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"

const STATUS_COLORS = {
  Publicada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Borrador: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

export default function MyPracticesPage() {
  const user = useAuthStore((state) => state.user)
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [practiceToDelete, setPracticeToDelete] = useState<string | null>(null)

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const loadMyPractices = async () => {
    if (!user) return

    try {
      const allPractices = await mockApi.listPractices()
      
      // Filter only practices owned by this user
      const myPractices = allPractices.filter(
        p => p.company.ownerUserId === user.id
      )
      
      setPractices(myPractices)
      console.log(`[MyPractices] User ${user.id} has ${myPractices.length} practices`)
    } catch (error) {
      console.error("Error loading practices:", error)
      toast.error("Error al cargar tus ofertas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMyPractices()
  }, [user])

  const handleDelete = async (practiceId: string) => {
    try {
      await mockApi.deletePractice(practiceId)
      setPractices(practices.filter(p => p.id !== practiceId))
      toast.success("Oferta eliminada correctamente")
      setPracticeToDelete(null)
    } catch (error) {
      console.error("Error deleting practice:", error)
      toast.error("Error al eliminar la oferta")
    }
  }

  const handleEdit = (practiceId: string) => {
    handleNavigation(`/edit-practice/${practiceId}`)
  }

  const handleView = (practiceId: string) => {
    handleNavigation(`/oferta/${practiceId}`)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mis Ofertas</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Gestiona tus prácticas publicadas ({practices.length})
          </p>
        </div>
        <Button onClick={() => handleNavigation("/publish")}>
          + Nueva Oferta
        </Button>
      </div>

      {practices.length === 0 ? (
        <EmptyState
          title="No tienes ofertas publicadas"
          description="Comienza a atraer talento publicando tu primera práctica profesional."
          action={{
            label: "Publicar oferta",
            onClick: () => handleNavigation("/publish")
          }}
        />
      ) : (
        <div className="grid gap-4">
          {practices.map((practice) => (
            <Card key={practice.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg truncate">
                        {practice.title}
                      </CardTitle>
                      <Badge className={STATUS_COLORS[practice.status]}>
                        {practice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{practice.company.name}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{practice.city}, {practice.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span>{practice.durationMonths} meses • {practice.modality}</span>
                  </div>
                  {practice.vacancies && (
                    <div className="text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">{practice.vacancies}</span> {practice.vacancies === 1 ? 'vacante' : 'vacantes'}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(practice.id)}
                    className="flex-1"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(practice.id)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPracticeToDelete(practice.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!practiceToDelete} onOpenChange={() => setPracticeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La oferta será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => practiceToDelete && handleDelete(practiceToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
