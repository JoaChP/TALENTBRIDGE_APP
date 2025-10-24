"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAuthStore } from "../../src/stores/auth-store"
import { mockApi } from "../../src/mocks/api"
import { toast } from "sonner"

interface TestResult {
  name: string
  success: boolean
  message: string
  timestamp: Date
}

export default function AutoTestPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const user = useAuthStore((state) => state.user)

  const addResult = (name: string, success: boolean, message: string) => {
    setResults(prev => [...prev, {
      name,
      success,
      message,
      timestamp: new Date()
    }])
  }

  const runFullTest = async () => {
    setIsRunning(true)
    setResults([])

    try {
      // Test 1: Limpiar estado
      addResult("Cleanup", true, "Limpiando estado inicial...")
      localStorage.clear()
      useAuthStore.getState().logout()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Test 2: Verificar API
      addResult("API Test", true, "Probando login directo con API...")
      try {
        const apiResult = await mockApi.login("empresa@demo.com", "123456")
        addResult("API Login", true, `API login exitoso: ${apiResult.user.name}`)
      } catch (error: any) {
        addResult("API Login", false, `API login falló: ${error.message}`)
        return
      }

      // Test 3: Login con Store
      addResult("Store Test", true, "Probando login con Zustand...")
      try {
        await useAuthStore.getState().login("empresa@demo.com", "123456")
        await new Promise(resolve => setTimeout(resolve, 500)) // Esperar hidratación
        
        const storeUser = useAuthStore.getState().user
        if (storeUser?.email === "empresa@demo.com") {
          addResult("Store Login", true, `Store login exitoso: ${storeUser.name}`)
        } else {
          addResult("Store Login", false, "Store no persistió el usuario")
          return
        }
      } catch (error: any) {
        addResult("Store Login", false, `Store login falló: ${error.message}`)
        return
      }

      // Test 4: Verificar localStorage
      addResult("Storage Test", true, "Verificando persistencia...")
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          if (parsed.state?.user?.email === "empresa@demo.com") {
            addResult("LocalStorage", true, "Datos persistidos correctamente")
          } else {
            addResult("LocalStorage", false, "Datos incorrectos en localStorage")
          }
        } catch {
          addResult("LocalStorage", false, "Error al parsear localStorage")
        }
      } else {
        addResult("LocalStorage", false, "No hay datos en localStorage")
      }

      // Test 5: Simular navegación
      addResult("Navigation Test", true, "Probando acceso a páginas protegidas...")
      const currentUser = useAuthStore.getState().user
      if (currentUser?.role === "empresa" || currentUser?.role === "admin") {
        addResult("Access Check", true, "Usuario autorizado para company-applications")
        
        // Test de navegación real
        setTimeout(() => {
          window.location.href = "/company-applications"
        }, 2000)
      } else {
        addResult("Access Check", false, "Usuario no autorizado")
      }

    } catch (error: any) {
      addResult("Critical Error", false, `Error crítico: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const testDirectNavigation = () => {
    window.location.href = "/company-applications"
  }

  const quickLogin = async () => {
    try {
      await useAuthStore.getState().login("empresa@demo.com", "123456")
      toast.success("Login exitoso")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Auto Test - Diagnóstico Completo</h1>
            <div className="flex gap-2">
              <Button onClick={runFullTest} disabled={isRunning}>
                {isRunning ? "Ejecutando..." : "Ejecutar Test Completo"}
              </Button>
              <Button onClick={quickLogin} variant="outline">
                Login Rápido
              </Button>
              <Button onClick={testDirectNavigation} variant="outline">
                Ir a Company Apps
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Estado Actual
                <Badge variant={user ? "default" : "destructive"}>
                  {user ? `${user.name} (${user.role})` : "No autenticado"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Usuario:</strong> {user?.name || "N/A"}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || "N/A"}
                </div>
                <div>
                  <strong>Rol:</strong> {user?.role || "N/A"}
                </div>
                <div>
                  <strong>ID:</strong> {user?.id || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados del Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Ejecuta el test para ver los resultados
                  </p>
                ) : (
                  results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded border ${
                        result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "✅" : "❌"}
                        </Badge>
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{result.message}</p>
                        <p className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de debugging */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">LocalStorage auth-storage:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
                    {typeof window !== 'undefined' ? localStorage.getItem('auth-storage') || 'No data' : 'SSR Mode'}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">URL Actual:</h4>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                    {typeof window !== 'undefined' ? window.location.href : 'SSR'}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}