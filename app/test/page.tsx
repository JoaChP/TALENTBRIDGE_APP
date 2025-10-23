"use client"

import { Button } from "../../src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card"
import { ApplicationTestSuite } from "../../src/lib/test-suite"
import { useState } from "react"
import { toast } from "sonner"

export default function TestPage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const runTest = async () => {
    setRunning(true)
    setResults([])
    
    try {
      toast.info("Iniciando prueba del sistema...")
      const tester = new ApplicationTestSuite()
      const testResults = await tester.runCompleteTest()
      setResults(testResults)
      
      const successCount = testResults.filter(r => r.status === 'success').length
      const errorCount = testResults.filter(r => r.status === 'error').length
      
      if (successCount >= 4) {
        toast.success(`¡Prueba exitosa! ${successCount}/${testResults.length} pasos completados`)
      } else {
        toast.error(`Prueba con errores: ${errorCount} errores encontrados`)
      }
      
    } catch (error) {
      toast.error(`Error ejecutando prueba: ${error}`)
    } finally {
      setRunning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'success' ? '✅' : '❌'
  }

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Sistema de Pruebas - Accept/Reject</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Esta página ejecuta una prueba automatizada completa del sistema de aceptar/rechazar aplicaciones.
          Simula el flujo desde la perspectiva del estudiante y la empresa.
        </p>
        
        <Button 
          onClick={runTest} 
          disabled={running}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {running ? "🔄 Ejecutando Prueba..." : "🧪 Ejecutar Prueba Completa"}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de la Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <span className="text-lg">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.step.replace(/_/g, ' ')}</span>
                      <span className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">Ver datos</summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">¿Qué hace esta prueba?</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ol className="list-decimal list-inside space-y-2">
            <li>📋 Revisa las aplicaciones iniciales del estudiante Ana García</li>
            <li>🏢 Obtiene las aplicaciones que puede gestionar la empresa TechCorp</li>
            <li>✅ Acepta una aplicación en estado "Enviada"</li>
            <li>❌ Rechaza una aplicación en estado "Revisando"</li>
            <li>🔍 Verifica que el estudiante vea los cambios en sus aplicaciones</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <h4 className="font-semibold mb-2">💡 Instrucciones manuales:</h4>
            <p className="text-sm">
              También puedes probar manualmente: Inicia sesión como empresa (empresa@demo.com) → 
              Ve a /company-applications → Acepta/Rechaza aplicaciones → 
              Inicia sesión como estudiante (estudiante@demo.com) → 
              Ve a /applications para ver los cambios
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}