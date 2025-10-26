"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import "../styles/phone-input.css"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().min(1, "El número de teléfono es requerido").refine(
    (value) => isValidPhoneNumber(value),
    "Número de teléfono inválido"
  ),
  role: z.enum(["estudiante", "empresa", "admin"]),
})

type RegisterData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const register = useAuthStore((state) => state.register)
  const [loading, setLoading] = useState(false)

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "estudiante", phone: "" },
  })

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    try {
      await register(data.name, data.email, data.password, data.role as Role, data.phone)
      toast.success("¡Cuenta creada exitosamente!")
      console.log("Usuario registrado con rol:", data.role)
      // Usar location.href para forzar recarga y que App.tsx detecte el usuario
      window.location.href = "/"
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
              <Label htmlFor="phone">Número de teléfono</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    id="phone"
                    defaultCountry="CL"
                    international
                    countryCallingCodeEditable={false}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                    placeholder="Ingresa tu número de teléfono"
                  />
                )}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone.message}
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
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, "", "/login")
                window.dispatchEvent(new Event("popstate"))
              }}
              className="font-medium text-indigo-600 hover:underline cursor-pointer"
            >
              Inicia sesión
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage

// Force SSR to avoid static generation issues with client-side routing
export async function getServerSideProps() {
  return { props: {} }
}
