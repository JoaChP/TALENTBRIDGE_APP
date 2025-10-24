"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useAuthStore } from "../../src/stores/auth-store"
import { toast } from "sonner"

export default function TestLoginPage() {
  const [email, setEmail] = useState("empresa@demo.com")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  const handleLogin = async () => {
    setLoading(true)
    try {
      console.log("[TestLogin] Attempting login with:", email)
      await login(email, password)
      toast.success("Login exitoso!")
      console.log("[TestLogin] Login completed, user:", useAuthStore.getState().user)
    } catch (error: any) {
      console.error("[TestLogin] Login error:", error)
      toast.error(error.message || "Error en el login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logout exitoso")
  }

  const goToCompanyApplications = () => {
    window.location.href = "/company-applications"
  }

  const goToLogin = () => {
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Test de Login</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Usuario:</strong> {user ? user.name : "No autenticado"}</p>
                <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                <p><strong>Rol:</strong> {user?.role || "N/A"}</p>
                <p><strong>ID:</strong> {user?.id || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {!user ? (
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleLogin} 
                      disabled={loading}
                    >
                      {loading ? "Iniciando sesión..." : "Login"}
                    </Button>
                    <Button onClick={goToLogin} variant="outline">
                      Página de Login
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setEmail("estudiante@demo.com")
                        setPassword("123456")
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Demo Estudiante
                    </Button>
                    <Button 
                      onClick={() => {
                        setEmail("empresa@demo.com")
                        setPassword("123456")
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Demo Empresa
                    </Button>
                    <Button 
                      onClick={() => {
                        setEmail("admin@demo.com")
                        setPassword("123456")
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Demo Admin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={goToCompanyApplications}>
                    Ir a Company Applications
                  </Button>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}