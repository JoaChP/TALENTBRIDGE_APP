"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { PracticeCard } from "../../components/practice-card"
import { LoadingSkeleton } from "../../components/loading-skeleton"
import type { Application, Practice } from "../../types"
import { mockApi } from "../../mocks/api"
import { useAuthStore } from "../../stores/auth-store"

export function StudentDashboard() {
  const user = useAuthStore((state) => state.user)
  const [applications, setApplications] = useState<Application[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const [appsData, practicesData] = await Promise.all([
          mockApi.listApplications(user.id),
          mockApi.listPractices(),
        ])
        setApplications(appsData)
        setPractices(practicesData.slice(0, 3))
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard Estudiante</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Gestiona tus aplicaciones y descubre nuevas oportunidades
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Aplicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Aún no has aplicado a ninguna práctica</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-2 text-left font-medium">Práctica</th>
                    <th className="pb-2 text-left font-medium">Estado</th>
                    <th className="pb-2 text-left font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-zinc-100 dark:border-zinc-900">
                      <td className="py-3">{app.practiceId}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{app.status}</Badge>
                      </td>
                      <td className="py-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(app.createdAt).toLocaleDateString("es")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Recomendaciones para ti</h2>
        <div className="space-y-4">
          {practices.map((practice) => (
            <PracticeCard key={practice.id} practice={practice} />
          ))}
        </div>
      </div>
    </div>
  )
}
