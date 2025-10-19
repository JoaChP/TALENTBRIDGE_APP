"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import { EmptyState } from "../../components/empty-state"
import { useAuthStore } from "../../stores/auth-store"
import { mockApi } from "../../mocks/api"
import type { Application, Practice } from "../../types"
import { MapPin, Clock, Briefcase } from "lucide-react"

export function StudentDashboard() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [practices, setPractices] = useState<Record<string, Practice>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return

      setLoading(true)
      try {
        const apps = await mockApi.listApplications(user.id)
        setApplications(apps)

        // Load practice details for each application
        const practicePromises = apps.map((app) => mockApi.getPractice(app.practiceId))
        const practiceResults = await Promise.all(practicePromises)

        const practicesMap: Record<string, Practice> = {}
        practiceResults.forEach((practice) => {
          practicesMap[practice.id] = practice
        })
        setPractices(practicesMap)
      } catch (error) {
        console.error("[v0] Error loading applications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "En revisión":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Aceptada":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Rechazada":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Mis Postulaciones</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Revisa el estado de tus solicitudes enviadas
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No has enviado postulaciones"
          description="Explora las prácticas disponibles y comienza a aplicar"
          action={{
            label: "Buscar Prácticas",
            onClick: () => navigate("/buscar"),
          }}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const practice = practices[application.practiceId]
            if (!practice) return null

            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={practice.company.logoUrl || "/placeholder.svg"}
                        alt={`Logo de ${practice.company.name}`}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <CardTitle className="text-xl">{practice.title}</CardTitle>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{practice.company.name}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {practice.city}, {practice.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" aria-hidden="true" />
                      <span>{practice.modality}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{practice.durationMonths} meses</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {practice.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Aplicado el {new Date(application.createdAt).toLocaleDateString("es-ES")}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/oferta/${practice.id}`)}>
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
