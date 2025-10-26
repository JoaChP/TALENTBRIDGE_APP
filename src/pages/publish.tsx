"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { RoleGate } from "../components/role-gate"
import { useAuthStore } from "../stores/auth-store"
import { mockApi } from "../mocks/api"
import { toast } from "sonner"
import type { Skill, Modality, Practice } from "../types"
import { LoadingSkeleton } from "../components/loading-skeleton"

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

const step1Schema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  company: z.string().min(2, "El nombre de la empresa es requerido"),
  city: z.string().min(2, "La ciudad es requerida"),
  country: z.string().min(2, "El país es requerido"),
})

const step2Schema = z.object({
  modality: z.enum(["Remoto", "Híbrido", "Presencial"]),
  durationMonths: z.enum(["3", "4", "6"]),
  vacancies: z.string().min(1, "El número de vacantes es requerido"),
})

const step3Schema = z.object({
  description: z.string().min(50, "La descripción debe tener al menos 50 caracteres"),
  benefits: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

export function PublishPage() {
  return (
    <RoleGate allowedRoles={["empresa", "admin"]}>
      <PublishForm />
    </RoleGate>
  )
}

export default PublishPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}

function PublishForm() {
  const user = useAuthStore((s) => s.user)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)

  // Extract ID from URL path
  const pathname = typeof window !== "undefined" ? window.location.pathname : ""
  const practiceId = pathname.startsWith("/oferta/") && pathname.endsWith("/edit") 
    ? pathname.split("/")[2] 
    : undefined
  const isEditing = !!practiceId

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { title: "", company: "", city: "", country: "" },
  })

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { modality: "Remoto", durationMonths: "6", vacancies: "1" },
  })

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { description: "", benefits: "" },
  })

  // Load practice data if editing
  useEffect(() => {
    const loadPractice = async () => {
      if (!practiceId) {
        setLoading(false)
        return
      }

      try {
        const practice = await mockApi.getPractice(practiceId)
        setEditingPractice(practice)
        
        // Populate forms with existing data
        form1.reset({
          title: practice.title,
          company: practice.company.name,
          city: practice.city,
          country: practice.country,
        })
        
        form2.reset({
          modality: practice.modality,
          durationMonths: String(practice.durationMonths) as "3" | "4" | "6",
          vacancies: String(practice.vacancies || 1),
        })
        
        form3.reset({
          description: practice.description,
          benefits: practice.benefits || "",
        })
        
        setSelectedSkills(practice.skills)
        setLoading(false)
      } catch (error) {
        console.error("Error loading practice:", error)
        toast.error("Error al cargar la práctica")
        setLoading(false)
      }
    }

    loadPractice()
  }, [practiceId])

  if (loading && isEditing) {
    return <LoadingSkeleton />
  }

  const toggleSkill = (skill: Skill) => {
    setHasChanges(true)
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleNext = async () => {
    let isValid = false

    if (currentStep === 1) {
      isValid = await form1.trigger()
    } else if (currentStep === 2) {
      isValid = await form2.trigger()
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSaveDraft = async () => {
    try {
      const data1 = form1.getValues()
      const data2 = form2.getValues()
      const data3 = form3.getValues()

      if (!user) {
        toast.error("Debes iniciar sesión para publicar una oferta")
        return
      }

      if (isEditing && editingPractice) {
        // Update existing practice
        await mockApi.updatePractice(editingPractice.id, {
          title: data1.title,
          company: {
            ...editingPractice.company,
            name: data1.company,
          },
          city: data1.city,
          country: data1.country,
          modality: data2.modality as Modality,
          durationMonths: Number(data2.durationMonths) as 3 | 4 | 6,
          skills: selectedSkills,
          description: data3.description,
          status: "Borrador",
          vacancies: Number(data2.vacancies),
          benefits: data3.benefits,
        })
        toast.success("Cambios guardados como borrador")
      } else {
        // Create new practice
        await mockApi.createPractice({
          title: data1.title,
          company: {
            id: `c${user.id}`,
            name: data1.company,
            logoUrl: user.avatarUrl || "/generic-company-logo.png",
            isEmpresa: true,
            ownerUserId: user.id,
          },
          city: data1.city,
          country: data1.country,
          modality: data2.modality as Modality,
          durationMonths: Number(data2.durationMonths) as 3 | 4 | 6,
          skills: selectedSkills,
          description: data3.description,
          status: "Borrador",
          vacancies: Number(data2.vacancies),
          benefits: data3.benefits,
        })
        toast.success("Borrador guardado exitosamente")
      }

      setHasChanges(false)
      window.history.pushState({}, '', "/")
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (error) {
      console.error("[v0] Error al guardar el borrador", error)
      toast.error("Error al guardar el borrador")
    }
  }

  const handlePublish = async () => {
    const isValid = await form3.trigger()
    if (!isValid) return

    if (selectedSkills.length === 0) {
      toast.error("Debes seleccionar al menos una habilidad")
      return
    }

    try {
      const data1 = form1.getValues()
      const data2 = form2.getValues()
      const data3 = form3.getValues()

      if (!user) {
        toast.error("Debes iniciar sesión para publicar una oferta")
        return
      }

      if (isEditing && editingPractice) {
        // Update existing practice
        await mockApi.updatePractice(editingPractice.id, {
          title: data1.title,
          company: {
            ...editingPractice.company,
            name: data1.company,
          },
          city: data1.city,
          country: data1.country,
          modality: data2.modality as Modality,
          durationMonths: Number(data2.durationMonths) as 3 | 4 | 6,
          skills: selectedSkills,
          description: data3.description,
          status: "Publicada",
          vacancies: Number(data2.vacancies),
          benefits: data3.benefits,
        })
        toast.success("Cambios publicados exitosamente")
      } else {
        // Create new practice
        await mockApi.createPractice({
          title: data1.title,
          company: {
            id: `c${user.id}`,
            name: data1.company,
            logoUrl: user.avatarUrl || "/generic-company-logo.png",
            isEmpresa: true,
            ownerUserId: user.id,
          },
          city: data1.city,
          country: data1.country,
          modality: data2.modality as Modality,
          durationMonths: Number(data2.durationMonths) as 3 | 4 | 6,
          skills: selectedSkills,
          description: data3.description,
          status: "Publicada",
          vacancies: Number(data2.vacancies),
          benefits: data3.benefits,
        })
        toast.success("Práctica publicada exitosamente")
      }

      setHasChanges(false)
      window.history.pushState({}, '', "/")
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (error) {
      console.error("[v0] Error al publicar la práctica", error)
      toast.error("Error al publicar la práctica")
    }
  }

  const handleLeave = () => {
    if (hasChanges) {
      setShowConfirmDialog(true)
    } else {
      window.history.back()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLeave}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-balance">
            {isEditing ? "Editar Práctica" : "Publicar Práctica"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">Paso {currentStep} de 3</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full ${
              step <= currentStep ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"
            }`}
            aria-label={`Paso ${step}${step <= currentStep ? " completado" : ""}`}
          />
        ))}
      </div>

      {/* Step 1: Basic Data */}
      {currentStep === 1 && (
        <form className="space-y-4" onChange={() => setHasChanges(true)}>
          <div>
            <Label htmlFor="title">Tipo de puesto *</Label>
            <Input
              id="title"
              {...form1.register("title")}
              placeholder="Tipo de puesto"
              aria-invalid={!!form1.formState.errors.title}
            />
            {form1.formState.errors.title && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {form1.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Empresa *</Label>
            <Input
              id="company"
              {...form1.register("company")}
              placeholder="Nombre de la empresa"
              aria-invalid={!!form1.formState.errors.company}
            />
            {form1.formState.errors.company && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {form1.formState.errors.company.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                {...form1.register("city")}
                placeholder="Ciudad"
                aria-invalid={!!form1.formState.errors.city}
              />
              {form1.formState.errors.city && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {form1.formState.errors.city.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                {...form1.register("country")}
                placeholder="País"
                aria-invalid={!!form1.formState.errors.country}
              />
              {form1.formState.errors.country && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {form1.formState.errors.country.message}
                </p>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Step 2: Configuration */}
      {currentStep === 2 && (
        <form className="space-y-4" onChange={() => setHasChanges(true)}>
          <div>
            <Label htmlFor="modality">Modalidad *</Label>
            <Select id="modality" {...form2.register("modality")} aria-invalid={!!form2.formState.errors.modality}>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duración *</Label>
            <Select
              id="duration"
              {...form2.register("durationMonths")}
              aria-invalid={!!form2.formState.errors.durationMonths}
            >
              <option value="3">3 meses</option>
              <option value="4">4 meses</option>
              <option value="6">6 meses</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="vacancies">Número de vacantes *</Label>
            <Input
              id="vacancies"
              type="number"
              min="1"
              {...form2.register("vacancies")}
              placeholder="1"
              aria-invalid={!!form2.formState.errors.vacancies}
            />
            {form2.formState.errors.vacancies && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {form2.formState.errors.vacancies.message}
              </p>
            )}
          </div>
        </form>
      )}

      {/* Step 3: Description & Skills */}
      {currentStep === 3 && (
        <form className="space-y-4" onChange={() => setHasChanges(true)}>
          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...form3.register("description")}
              placeholder="Describe la práctica, responsabilidades y requisitos..."
              rows={6}
              aria-invalid={!!form3.formState.errors.description}
            />
            {form3.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {form3.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label>Habilidades requeridas *</Label>
            <div className="mt-2 flex flex-wrap gap-2">
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
            {selectedSkills.length === 0 && (
              <p className="mt-1 text-sm text-zinc-500">Selecciona al menos una habilidad</p>
            )}
          </div>

          <div>
            <Label htmlFor="benefits">Beneficios / Compensación</Label>
            <Textarea
              id="benefits"
              {...form3.register("benefits")}
              placeholder="ej. Mentoría personalizada, certificado, posibilidad de contratación..."
              rows={3}
            />
          </div>
        </form>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-3">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Atrás
          </Button>
        )}

        {currentStep < 3 && (
          <Button onClick={handleNext} className="flex-1">
            Siguiente
            <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
        )}

        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="mr-1 h-4 w-4" aria-hidden="true" />
          {isEditing ? "Guardar cambios" : "Guardar borrador"}
        </Button>

        {currentStep === 3 && (
          <Button onClick={handlePublish} className="flex-1">
            {isEditing ? "Actualizar práctica" : "Publicar práctica"}
          </Button>
        )}
      </div>

      {/* Confirm leave dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Salir sin guardar?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-pretty">
            Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setShowConfirmDialog(false)
                window.history.back()
              }}
              className="flex-1"
            >
              Salir sin guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
