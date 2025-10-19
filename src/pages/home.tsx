"use client"

import { useEffect, useState } from "react"
import { PracticeCard } from "../components/practice-card"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Practice } from "../types"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { useRouter } from "next/navigation"

export function HomePage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPractices = async () => {
      try {
        const data = await mockApi.listPractices()
        setPractices(data.slice(0, 3)) // Show 3 most recent
      } catch (error) {
        console.error("[v0] Error loading practices:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPractices()
  }, [])

  const [counts, setCounts] = useState({ practices: 0, applications: 0, companies: 0 })

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [pr, ap, co] = await Promise.all([
          mockApi.countPractices(),
          mockApi.countApplications(),
          mockApi.countCompanies(),
        ])
        setCounts({ practices: pr, applications: ap, companies: co })
      } catch (e) {
        // ignore
      }
    }
    loadCounts()
  }, [])

  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-2xl font-semibold">Bienvenido a TalentBridge</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Conecta estudiantes con prácticas profesionales, postula y gestiona procesos de selección.</p>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-lg bg-indigo-50 px-4 py-3">
            <div className="text-sm text-zinc-600">Prácticas disponibles</div>
            <div className="text-2xl font-bold text-indigo-700">{counts.practices}</div>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <div className="text-sm text-zinc-600">Solicitudes</div>
            <div className="text-2xl font-bold">{counts.applications}</div>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <div className="text-sm text-zinc-600">Empresas</div>
            <div className="text-2xl font-bold">{counts.companies}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          {user?.role === "empresa" && (
            <button
              onClick={() => router.push("/publish")}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Publicar oferta
            </button>
          )}

          {user?.role === "estudiante" && (
            <button
              onClick={() => router.push("/profile")}
              className="rounded-md border border-zinc-200 px-4 py-2 hover:bg-zinc-100 dark:border-zinc-800"
            >
              Ver mis postulaciones
            </button>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-balance">Últimas Oportunidades</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">
          Descubre las prácticas profesionales más recientes
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-4">
          {practices.map((practice) => (
            <PracticeCard key={practice.id} practice={practice} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
