"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { useAuthStore } from "../stores/auth-store"
import { toast } from "sonner"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

type LoginData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success("¡Bienvenido de nuevo!")
      navigate("/")
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
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
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Ingresa a tu cuenta de TalentBridge</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
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
                {...register("password")}
                placeholder="••••••"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950">Usuarios demo</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                <strong>Estudiante:</strong> estudiante@demo.com / 123456
              </p>
              <p>
                <strong>Empresa:</strong> empresa@demo.com / 123456
              </p>
              <p>
                <strong>Admin:</strong> admin@demo.com / 123456
              </p>
            </div>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="font-medium text-indigo-600 hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
