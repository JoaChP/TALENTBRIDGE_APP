"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { 
  Database, 
  Filter, 
  TestTube, 
  Settings,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Herramientas para gestionar y mantener el sistema TalentBridge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sistema de Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-500" />
                Sistema de Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ejecuta pruebas integrales del sistema para verificar que todas las funcionalidades están operando correctamente.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Conexión JSONBin
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  APIs del sistema
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Integridad de datos
                </div>
              </div>
              <Link href="/system-test">
                <Button className="w-full">
                  <TestTube className="h-4 w-4 mr-2" />
                  Ir al Testing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Limpieza de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-500" />
                Limpieza de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Identifica y elimina ofertas quemadas/demo para mostrar únicamente datos reales de la base de datos.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Detecta ofertas de demo
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Filtra usuarios de prueba
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Limpia relaciones
                </div>
              </div>
              <Link href="/data-cleanup">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Ir a Limpieza
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estado del Sistema */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-500" />
                Estado Actual del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm font-medium">JSONBin Integrado</div>
                  <div className="text-xs text-muted-foreground">Datos en la nube</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">🔄</div>
                  <div className="text-sm font-medium">APIs Funcionando</div>
                  <div className="text-xs text-muted-foreground">Endpoints operativos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">⚠️</div>
                  <div className="text-sm font-medium">Limpieza Pendiente</div>
                  <div className="text-xs text-muted-foreground">Filtrar ofertas demo</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Próximos Pasos Recomendados:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Ejecutar testing completo del sistema</li>
                  <li>2. Analizar y limpiar ofertas quemadas</li>
                  <li>3. Validar que solo se muestran ofertas reales</li>
                  <li>4. Probar el sistema de postulaciones</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/system-test">
                <Button size="sm" variant="outline">
                  <TestTube className="h-3 w-3 mr-1" />
                  Test Rápido
                </Button>
              </Link>
              <Link href="/data-cleanup">
                <Button size="sm" variant="outline">
                  <Filter className="h-3 w-3 mr-1" />
                  Ver Análisis
                </Button>
              </Link>
              <Link href="/">
                <Button size="sm" variant="outline">
                  <Database className="h-3 w-3 mr-1" />
                  Ver Sistema
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
