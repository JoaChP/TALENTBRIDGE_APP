"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { AuthTestSuite } from "../../src/lib/auth-test-suite"
import { useAuthStore } from "../../src/stores/auth-store"

interface TestLog {
  message: string
  timestamp: Date
}

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [testLogs, setTestLogs] = useState<TestLog[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [lastTestSuccess, setLastTestSuccess] = useState<boolean | null>(null)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const handleTestLog = (event: CustomEvent) => {
      const { message, timestamp } = event.detail
      setTestLogs(prev => [...prev, { message, timestamp }])
    }

    window.addEventListener('auth-test-log', handleTestLog as EventListener)
    
    return () => {
      window.removeEventListener('auth-test-log', handleTestLog as EventListener)
    }
  }, [])

  const runComprehensiveTest = async () => {
    setIsRunning(true)
    setTestResults([])
    setTestLogs([])
    setLastTestSuccess(null)

    try {
      const testSuite = AuthTestSuite.getInstance()
      const { success, report } = await testSuite.runComprehensiveAuthTest()
      
      setTestResults(report)
      setLastTestSuccess(success)
    } catch (error: any) {
      setTestResults([`Error crítico: ${error.message}`])
      setLastTestSuccess(false)
    } finally {
      setIsRunning(false)
    }
  }

  const runQuickTest = async () => {
    setIsRunning(true)
    
    try {
      const testSuite = AuthTestSuite.getInstance()
      const success = await testSuite.runQuickLoginTest("empresa@demo.com")
      setLastTestSuccess(success)
    } catch (error: any) {
      console.error("Error en test rápido:", error)
      setLastTestSuccess(false)
    } finally {
      setIsRunning(false)
    }
  }

  const testCompanyAccess = async () => {
    setIsRunning(true)
    
    try {
      const testSuite = AuthTestSuite.getInstance()
      const canAccess = await testSuite.testCompanyApplicationsAccess()
      
      if (canAccess) {
        // Si puede acceder, intentar navegar
        window.location.href = "/company-applications"
      } else {
        setLastTestSuccess(false)
      }
    } catch (error: any) {
      console.error("Error en test de acceso:", error)
      setLastTestSuccess(false)
    } finally {
      setIsRunning(false)
    }
  }

  const clearLogs = () => {
    setTestLogs([])
    setTestResults([])
    setLastTestSuccess(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Test de Autenticación Integral</h1>
            <div className="flex gap-2">
              <Button onClick={clearLogs} variant="outline">
                Limpiar Logs
              </Button>
              {lastTestSuccess !== null && (
                <Badge variant={lastTestSuccess ? "default" : "destructive"}>
                  {lastTestSuccess ? "Éxito" : "Falló"}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
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

              <Card>
                <CardHeader>
                  <CardTitle>Acciones de Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={runComprehensiveTest} 
                      disabled={isRunning}
                      className="w-full"
                    >
                      {isRunning ? "Ejecutando..." : "Test Integral Completo"}
                    </Button>
                    
                    <Button 
                      onClick={runQuickTest} 
                      disabled={isRunning}
                      variant="outline"
                      className="w-full"
                    >
                      Test Rápido de Login
                    </Button>
                    
                    <Button 
                      onClick={testCompanyAccess} 
                      disabled={isRunning}
                      variant="outline"
                      className="w-full"
                    >
                      Test Acceso Company Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logs en Tiempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
                    {testLogs.length === 0 ? (
                      <p className="text-gray-500">Esperando logs...</p>
                    ) : (
                      testLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                          <span className="text-gray-400 text-xs">
                            [{log.timestamp.toLocaleTimeString()}]
                          </span>{" "}
                          {log.message}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                    {testResults.length === 0 ? (
                      <p className="text-gray-500">Ejecuta un test para ver los resultados...</p>
                    ) : (
                      testResults.map((result, index) => (
                        <div key={index} className="mb-1">
                          {result}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}