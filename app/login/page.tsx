"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { useAuthStore } from "../../src/stores/auth-store"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    console.log("Iniciando login:", data.email)
    
    try {
      await login(data.email, data.password)
      toast.success("¡Bienvenido de nuevo!")
      console.log("Login exitoso")
      
      // Redireccionar a la página principal
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
      
    } catch (error: any) {
      console.error("Error en login:", error)
      toast.error(error?.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email: string) => {
    setValue("email", email)
    setValue("password", "123456")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-zinc-50 px-4 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg ring-1 ring-zinc-100 dark:ring-zinc-800">
          <CardHeader className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-extrabold text-white">
              TB
            </div>
            <CardTitle className="text-3xl">Bienvenido a TalentBridge</CardTitle>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Inicia sesión para continuar</p>
          </CardHeader>

          <CardContent>
            <div className="px-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="tu@ejemplo.com"
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                    className="mt-2"
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
                    {...register("password")}
                    placeholder="Ingresa tu contraseña"
                    aria-invalid={!!errors.password}
                    autoComplete="current-password"
                    className="mt-2"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>

              <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Usuarios demo</p>
                <ul className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>
                    <button
                      type="button"
                      onClick={() => fillDemo('estudiante@demo.com')}
                      className="text-left w-full hover:text-indigo-600 underline"
                    >
                      <strong>Estudiante:</strong> estudiante@demo.com / 123456
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => fillDemo('empresa@demo.com')}
                      className="text-left w-full hover:text-indigo-600 underline"
                    >
                      <strong>Empresa:</strong> empresa@demo.com / 123456
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => fillDemo('admin@demo.com')}
                      className="text-left w-full hover:text-indigo-600 underline"
                    >
                      <strong>Admin:</strong> admin@demo.com / 123456
                    </button>
                  </li>
                </ul>

                <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/registro"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Regístrate
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}