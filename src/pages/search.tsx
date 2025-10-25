"use client"

import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { PracticeCard } from "../components/practice-card"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { EmptyState } from "../components/empty-state"
import { Pagination } from "../components/pagination"
import { Input } from "../components/ui/input"
import { Select } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../components/ui/sheet"
import { Badge } from "../components/ui/badge"
import type { Practice, Modality, Skill } from "../types"
import { mockApi } from "../mocks/api"

const ITEMS_PER_PAGE = 3

const SKILLS: Skill[] = [
  "React",
  "JavaScript",
  "CSS",
  "Git",
  "Social Media",
  "Analytics",
  "Creatividad",
  "Comunicación",
  "Node.js",
  "Python",
  "Diseño",
  "Marketing",
]

export function SearchPage() {
  const [practices, setPractices] = useState<Practice[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [modality, setModality] = useState<Modality | "">("")
  const [duration, setDuration] = useState<number | "">("")
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])

  useEffect(() => {
    const loadPractices = async () => {
      setLoading(true)

      // Force reload from localStorage to get latest data
      if (typeof window !== "undefined") {
        mockApi.reloadFromStorage()
      }

      const applyFilters = (list: Practice[]): Practice[] => {
        let filtered = [...list]

        if (search) {
          const term = search.toLowerCase()
          filtered = filtered.filter(
            (practice) =>
              practice.title.toLowerCase().includes(term) ||
              practice.company.name.toLowerCase().includes(term) ||
              practice.description.toLowerCase().includes(term) ||
              practice.skills.some((skill) => skill.toLowerCase().includes(term)),
          )
        }

        if (location) {
          const place = location.toLowerCase()
          filtered = filtered.filter(
            (practice) =>
              practice.city.toLowerCase().includes(place) || practice.country.toLowerCase().includes(place),
          )
        }

        if (modality) {
          filtered = filtered.filter((practice) => practice.modality === modality)
        }

        if (duration) {
          filtered = filtered.filter((practice) => practice.durationMonths === duration)
        }

        if (selectedSkills.length > 0) {
          filtered = filtered.filter((practice) => selectedSkills.some((skill) => practice.skills.includes(skill)))
        }

        return filtered
      }

      // SIEMPRE usar mockApi para obtener los datos más recientes
      try {
        const fallback = await mockApi.listPractices({
          search: search || undefined,
          location: location || undefined,
          modality: modality || undefined,
          duration: duration || undefined,
          skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        })
        console.log("[SearchPage] Loaded practices:", fallback.length)
        setPractices(fallback)
        setCurrentPage(1)
      } catch (error) {
        console.error("[SearchPage] Error loading practices:", error)
      }

      setLoading(false)
    }

    loadPractices()
    
    // Escuchar TODOS los eventos de cambios en los datos
    const handleDataUpdate = () => {
      console.log("[SearchPage] Data updated, reloading practices...")
      loadPractices()
    }
    
    window.addEventListener("talentbridge-data-updated", handleDataUpdate)
    window.addEventListener("application-created", handleDataUpdate)
    window.addEventListener("application-status-changed", handleDataUpdate)
    window.addEventListener("practice-deleted", handleDataUpdate)
    window.addEventListener("practices-migrated", handleDataUpdate)
    
    return () => {
      window.removeEventListener("talentbridge-data-updated", handleDataUpdate)
      window.removeEventListener("application-created", handleDataUpdate)
      window.removeEventListener("application-status-changed", handleDataUpdate)
      window.removeEventListener("practice-deleted", handleDataUpdate)
      window.removeEventListener("practices-migrated", handleDataUpdate)
    }
  }, [search, location, modality, duration, selectedSkills])

  const totalPages = Math.ceil(practices.length / ITEMS_PER_PAGE)
  const paginatedPractices = practices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const clearFilters = () => {
    setSearch("")
    setLocation("")
    setModality("")
    setDuration("")
    setSelectedSkills([])
  }

  const hasFilters = search || location || modality || duration || selectedSkills.length > 0

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Buscar Prácticas</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Encuentra la oportunidad perfecta para ti</p>
      </div>

      {/* Filters Bar */}
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Buscar por título, empresa o habilidad"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar prácticas"
          />
          <Input
            placeholder="Ciudad o país"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Ubicación"
          />
          <Select
            value={modality}
            onChange={(e) => setModality(e.target.value as Modality | "")}
            aria-label="Modalidad"
          >
            <option value="">Todas las modalidades</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </Select>
          <Button variant="outline" onClick={() => setFiltersOpen(true)} className="gap-2">
            <Filter className="h-4 w-4" aria-hidden="true" />
            Más filtros
            {(duration || selectedSkills.length > 0) && (
              <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {(duration ? 1 : 0) + selectedSkills.length}
              </Badge>
            )}
          </Button>
        </div>

        {(selectedSkills.length > 0 || duration) && (
          <div className="flex flex-wrap gap-2">
            {duration && (
              <Badge variant="secondary" className="gap-1">
                {duration} meses
                <button
                  onClick={() => setDuration("")}
                  className="ml-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  aria-label="Quitar filtro de duración"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button
                  onClick={() => toggleSkill(skill)}
                  className="ml-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  aria-label={`Quitar filtro ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {practices.length} {practices.length === 1 ? "resultado" : "resultados"}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSkeleton />
      ) : practices.length === 0 ? (
        <EmptyState
          title="No se encontraron resultados"
          description="Intenta ajustar tus filtros o busca con otros términos"
          action={{
            label: "Limpiar filtros",
            onClick: clearFilters,
          }}
        />
      ) : (
        <>
          <div className="space-y-4">
            {paginatedPractices.map((practice) => (
              <PracticeCard key={practice.id} practice={practice} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showNumbers={false}
            />
          )}
        </>
      )}

      {/* Filters Sheet */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen} side="bottom">
        <SheetContent>
          <SheetClose onClick={() => setFiltersOpen(false)} />
          <SheetHeader>
            <SheetTitle>Filtros avanzados</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Duración</label>
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
                aria-label="Duración"
              >
                <option value="">Todas las duraciones</option>
                <option value="3">3 meses</option>
                <option value="4">4 meses</option>
                <option value="6">6 meses</option>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Habilidades</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={clearFilters}>
                Limpiar
              </Button>
              <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default SearchPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
