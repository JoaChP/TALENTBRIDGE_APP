"use client"

import { useEffect, useState } from "react"
import { PracticeCard } from "../components/practice-card"
import { LoadingSkeleton } from "../components/loading-skeleton"
import type { Practice } from "../types"
import { mockApi } from "../mocks/api"

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

  return (
    <div className="space-y-6">
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
