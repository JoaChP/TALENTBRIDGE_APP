"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAuthStore } from "../../src/stores/auth-store"
import { mockApi } from "../../src/mocks/api"
import { toast } from "sonner"

interface DiagnosticInfo {
  userInStore: any
  userInLocalStorage: any
  dataInLocalStorage: any
  isAuthenticated: boolean
  error: string | null
}

export default function DebugPage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo | null>(null)

  const runDiagnostic = () => {
    try {
      const userInStore = user
      const authData = localStorage.getItem('auth-storage')
      const userInLocalStorage = authData ? JSON.parse(authData) : null
      const talentBridgeData = localStorage.getItem('talentbridge_data')
      const dataInLocalStorage = talentBridgeData ? JSON.parse(talentBridgeData) : null
      
      setDiagnostic({
        userInStore,
        userInLocalStorage,
        dataInLocalStorage,
        isAuthenticated: !!user,
        error: null
      })
    } catch (error: any) {
      setDiagnostic({
        userInStore: null,
        userInLocalStorage: null,
        dataInLocalStorage: null,
        isAuthenticated: false,
        error: error.message
      })
    }
  }

  const testCompanyLogin = async () => {
    try {
      const result = await mockApi.login("empresa@demo.com", "123456")
      toast.success("Login de empresa exitoso en API")
      console.log("API Login result:", result)
    } catch (error: any) {
      toast.error(`Error en login de empresa: ${error.message}`)
      console.error("API Login error:", error)
    }
  }

  const testStoreLogin = async () => {
    const { login } = useAuthStore.getState()
    try {
      await login("empresa@demo.com", "123456")
      toast.success("Login de empresa exitoso en Store")
      setTimeout(runDiagnostic, 100) // Actualizar diagnóstico después del login
    } catch (error: any) {
      toast.error(`Error en login de empresa en Store: ${error.message}`)
      console.error("Store Login error:", error)
    }
  }

  const clearStorage = () => {
    localStorage.clear()
    toast.success("Storage limpiado")
    // Force Zustand to reinitialize
    useAuthStore.getState().logout()
    setTimeout(runDiagnostic, 100)
  }

  const goToCompanyApplications = () => {
    window.location.href = "/company-applications"
  }

  useEffect(() => {
    runDiagnostic()
  }, [user, token])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Diagnóstico de Autenticación</h1>
          <div className="flex gap-2">
            <Button onClick={runDiagnostic} variant="outline">
              Actualizar
            </Button>
            <Button onClick={clearStorage} variant="destructive">
              Limpiar Storage
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Estado de Autenticación
                <Badge variant={diagnostic?.isAuthenticated ? "default" : "destructive"}>
                  {diagnostic?.isAuthenticated ? "Autenticado" : "No autenticado"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Usuario en Store:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(diagnostic?.userInStore, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-semibold">Usuario en localStorage:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(diagnostic?.userInLocalStorage, null, 2)}
                  </pre>
                </div>

                {diagnostic?.error && (
                  <div>
                    <h4 className="font-semibold text-red-600">Error:</h4>
                    <p className="text-red-600">{diagnostic.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tests de Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={testCompanyLogin}>
                  Test API Login (Empresa)
                </Button>
                <Button onClick={testStoreLogin}>
                  Test Store Login (Empresa)
                </Button>
                <Button onClick={goToCompanyApplications} variant="outline">
                  Ir a Company Applications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos en LocalStorage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(diagnostic?.dataInLocalStorage, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}