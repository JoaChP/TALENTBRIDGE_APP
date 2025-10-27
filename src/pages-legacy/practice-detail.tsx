"use client"

import { useEffect, useState } from "react"
import { MapPin, Clock, Briefcase, Users, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"
import Image from "next/image"

export function PracticeDetailPage() {
  const user = useAuthStore((state) => state.user)
  const [practice, setPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  
  // Extract ID from URL path
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const id = pathname.startsWith("/oferta/") ? pathname.split("/").pop() : undefined

  useEffect(() => {
    let cancelled = false

    const loadPractice = async () => {
      if (!id) {
        setPractice(null)
        setLoading(false)
        return
      }

      // Reset state immediately when id changes
      setPractice(null)
      setLoading(true)

      try {
        const res = await fetch(`/api/practices?id=${encodeURIComponent(id)}`, { cache: "no-store" })
        if (!cancelled && res.ok) {
          const data: Practice = await res.json()
          setPractice(data)
          setLoading(false)
          return
        }
      } catch (error) {
        console.error("[v0] Error calling /api/practices:", error)
      }

      try {
        const fallback = await mockApi.getPractice(id)
        if (!cancelled) {
          setPractice(fallback)
        }
      } catch (error) {
        console.error("[v0] Error loading practice:", error)
        if (!cancelled) {
          toast.error("Error al cargar la práctica")
          setPractice(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPractice()

    return () => {
      cancelled = true
    }
  }, [id])

  // Check if user has already applied
  useEffect(() => {
    const checkApplication = async () => {
      if (!user || !id) return
      
      try {
        const applications = await mockApi.listApplications(user.id)
        const applied = applications.some((app) => app.practiceId === id)
        setHasApplied(applied)
      } catch (error) {
        console.error("Error checking application:", error)
      }
    }

    checkApplication()
  }, [user, id])

  const handleApply = async () => {
    if (!user || !practice) return

    setApplying(true)
    try {
      await mockApi.applyToPractice(practice.id, user.id)
      toast.success("¡Aplicación enviada exitosamente!")
      setHasApplied(true)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al aplicar"
      toast.error(message)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!practice) {
    return (
      <div className="text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Práctica no encontrada</p>
        <Button className="mt-4" onClick={() => window.location.href = "/search"}>
          Volver a búsqueda
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-balance">{practice.title}</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Image
              src={practice.company.logoUrl || "/placeholder.svg"}
              alt={`Logo de ${practice.company.name}`}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold">{practice.company.name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {practice.city}, {practice.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {practice.postedAgo}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Briefcase className="mr-1 h-3 w-3" aria-hidden="true" />
                  {practice.modality}
                </Badge>
                <Badge variant="secondary">{practice.durationMonths} meses</Badge>
                {practice.vacancies && (
                  <Badge variant="secondary">
                    <Users className="mr-1 h-3 w-3" aria-hidden="true" />
                    {practice.vacancies} {practice.vacancies === 1 ? "vacante" : "vacantes"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">{practice.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habilidades requeridas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {practice.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {practice.benefits && (
        <Card>
          <CardHeader>
            <CardTitle>Beneficios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-pretty">{practice.benefits}</p>
          </CardContent>
        </Card>
      )}

      {user?.role === "estudiante" && (
        <div className="sticky bottom-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:shadow-none">
          {hasApplied ? (
            <div className="text-center space-y-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-sm py-2 px-4">
                ✓ Ya te postulaste a esta oferta
              </Badge>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Puedes ver el estado de tu postulación en{" "}
                <button
                  onClick={() => window.location.href = "/postulaciones"}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Mis Postulaciones
                </button>
              </p>
            </div>
          ) : (
            <Button className="w-full" size="lg" onClick={handleApply} disabled={applying}>
              {applying ? "Enviando..." : "Postularme"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default PracticeDetailPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
