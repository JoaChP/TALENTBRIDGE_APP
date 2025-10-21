"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Select } from "../components/ui/select"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"
import type { Role } from "../types"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["estudiante", "empresa", "admin"]),
})

type RegisterData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [loading, setLoading] = useState(false)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "estudiante" },
  })

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    try {
      await register(data.name, data.email, data.password, data.role as Role)
      toast.success("¡Cuenta creada exitosamente!")
      navigate("/")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al crear la cuenta"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            TB
          </div>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Únete a TalentBridge</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" {...registerField("name")} placeholder="Tu nombre" aria-invalid={!!errors.name} />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                {...registerField("email")}
                placeholder="tu@email.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                {...registerField("password")}
                placeholder="••••••"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Tipo de cuenta</Label>
              <Select id="role" {...registerField("role")} aria-invalid={!!errors.role}>
                <option value="estudiante">Estudiante</option>
                <option value="empresa">Empresa</option>
                <option value="admin">Administrador</option>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>Al crear tu cuenta seleccionarás el rol que te identifica (estudiante, empresa o administrador).</p>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
