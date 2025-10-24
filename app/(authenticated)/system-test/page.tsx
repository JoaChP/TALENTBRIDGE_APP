"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, Database } from "lucide-react"
import { mockApi } from "../../../src/mocks/api"
import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"
import { toast } from "sonner"

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'pending'
  message: string
  data?: any
}

export default function SystemTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [summary, setSummary] = useState({ total: 0, pass: 0, fail: 0 })

  const runTest = async (name: string, testFn: () => Promise<any>): Promise<TestResult> => {
    try {
      const data = await testFn()
      return { name, status: 'pass', message: 'Test passed successfully', data }
    } catch (error: any) {
      return { name, status: 'fail', message: error.message }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    const testResults: TestResult[] = []

    // Test 1: JSONBin Connection
    testResults.push(await runTest(
      "JSONBin Cloud Connection",
      async () => {
        const data = await vercelJsonBinService.fetchInitialData()
        if (!data) throw new Error("No data received from JSONBin")
        return { records: Object.keys(data).length }
      }
    ))

    // Test 2: mockApi Integration
    testResults.push(await runTest(
      "MockApi Integration",
      async () => {
        mockApi.reloadFromStorage()
        const practices = await mockApi.listPractices()
        const users = await mockApi.listUsers()
        return { practices: practices.length, users: users.length }
      }
    ))

    // Test 3: API Data Endpoint
    testResults.push(await runTest(
      "API /data Endpoint",
      async () => {
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error(`API failed: ${response.status}`)
        const data = await response.json()
        return { 
          practices: data.practices?.length || 0,
          users: data.users?.length || 0,
          applications: data.applications?.length || 0
        }
      }
    ))

    // Test 4: API Practices Endpoint
    testResults.push(await runTest(
      "API /practices Endpoint",
      async () => {
        const response = await fetch('/api/practices')
        if (!response.ok) throw new Error(`API failed: ${response.status}`)
        const practices = await response.json()
        return { practices: practices.length, hasRealData: practices.length > 0 }
      }
    ))

    // Test 5: System Health Check
    testResults.push(await runTest(
      "System Health Check",
      async () => {
        const jsonBinEnabled = process.env.NEXT_PUBLIC_USE_JSONBIN === 'true'
        const binId = process.env.NEXT_PUBLIC_JSONBIN_BIN_ID
        return {
          jsonBinEnabled,
          binIdConfigured: !!binId,
          environment: 'production-ready'
        }
      }
    ))

    setTests(testResults)
    
    const summary = testResults.reduce(
      (acc, test) => ({
        total: acc.total + 1,
        pass: acc.pass + (test.status === 'pass' ? 1 : 0),
        fail: acc.fail + (test.status === 'fail' ? 1 : 0)
      }),
      { total: 0, pass: 0, fail: 0 }
    )
    
    setSummary(summary)
    setIsRunning(false)

    if (summary.fail === 0) {
      toast.success(`All ${summary.total} tests passed! System is ready`)
    } else {
      toast.error(`${summary.fail} out of ${summary.total} tests failed`)
    }
  }

  useEffect(() => {
    runAllTests()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sistema de Testing Integral</h1>
          <p className="text-muted-foreground">
            Validación completa del sistema antes de implementar filtros de ofertas
          </p>
        </div>

        {/* Test Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Resumen de Pruebas
              <Button
                variant="outline"
                size="sm"
                onClick={runAllTests}
                disabled={isRunning}
                className="ml-auto"
              >
                {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isRunning ? 'Ejecutando...' : 'Ejecutar Pruebas'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.pass}</div>
                <div className="text-sm text-muted-foreground">Exitosas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.fail}</div>
                <div className="text-sm text-muted-foreground">Fallidas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {test.status === 'pass' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : test.status === 'fail' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                  {test.name}
                  <Badge variant={test.status === 'pass' ? 'default' : test.status === 'fail' ? 'destructive' : 'secondary'}>
                    {test.status === 'pass' ? 'EXITOSO' : test.status === 'fail' ? 'FALLIDO' : 'EJECUTANDO'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{test.message}</p>
                {test.data && (
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        {summary.total > 0 && summary.fail === 0 && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Sistema Validado - Listo para Implementación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                ✅ Todas las pruebas han pasado exitosamente. El sistema está listo para implementar 
                el filtro de ofertas que solo muestre las ofertas de la base de datos real.
              </p>
              <div className="text-sm text-green-600">
                <strong>Próximos pasos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Implementar filtro para mostrar solo ofertas reales de la base de datos</li>
                  <li>Eliminar ofertas quemadas/de prueba del sistema</li>
                  <li>Validar que el sistema de postulaciones funciona correctamente</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}