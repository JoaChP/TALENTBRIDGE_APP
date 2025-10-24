"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { 
  Filter, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  Building2,
  MessageSquare
} from "lucide-react"
import { mockApi } from "../../../src/mocks/api"
import { cleanSystemData, analyzeUserValidity } from "../../../src/services/data-filter"
import { toast } from "sonner"
import type { Practice, User, Application, Thread, Message } from "../../../src/types"

interface SystemData {
  practices: Practice[]
  users: User[]
  applications: Application[]
  threads: Thread[]
  messages: Message[]
}

export default function DataCleanupPage() {
  const [systemData, setSystemData] = useState<SystemData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(true)

  const loadSystemData = async () => {
    setIsLoading(true)
    try {
      mockApi.reloadFromStorage()
      
      const practices = await mockApi.listPractices()
      const users = await mockApi.listUsers()
      const applications = await mockApi.listApplications()
      const threads = await mockApi.listThreads()
      const messages: Message[] = [] // Messages are handled differently
      
      const data = { practices, users, applications, threads, messages }
      setSystemData(data)
      
      // Ejecutar análisis inmediatamente
      const analysis = cleanSystemData(data)
      setAnalysisResult(analysis)
      
      toast.success("Datos cargados y analizados correctamente")
    } catch (error: any) {
      toast.error(`Error cargando datos: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const executeCleanup = async () => {
    if (!analysisResult || !systemData) return
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar ${analysisResult.removed.practices.length} ofertas demo y ${analysisResult.removed.users.length} usuarios demo? Esta acción no se puede deshacer.`
    )
    
    if (!confirmed) return
    
    setIsLoading(true)
    try {
      // Actualizar mockData con datos limpios
      const cleanedData = analysisResult.cleaned
      
      // Guardar datos limpios
      if (typeof window !== "undefined") {
        localStorage.setItem('talentbridge-data', JSON.stringify(cleanedData))
        mockApi.reloadFromStorage()
      }
      
      toast.success(`Sistema limpiado: ${analysisResult.removed.practices.length} ofertas demo eliminadas`)
      
      // Recargar datos para mostrar el resultado
      await loadSystemData()
      setPreviewMode(false)
    } catch (error: any) {
      toast.error(`Error ejecutando limpieza: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSystemData()
  }, [])

  if (!systemData || !analysisResult) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Analizando datos del sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Limpieza de Datos del Sistema</h1>
          <p className="text-muted-foreground">
            Filtra y elimina ofertas quemadas para mostrar solo datos reales de la base de datos
          </p>
        </div>

        {/* Resumen del Análisis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Resumen del Análisis
              <Button
                variant="outline"
                size="sm"
                onClick={loadSystemData}
                disabled={isLoading}
                className="ml-auto"
              >
                Reanalizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisResult.analysis.summary.totalPractices}
                </div>
                <div className="text-sm text-blue-700">Ofertas Totales</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analysisResult.analysis.summary.realPractices}
                </div>
                <div className="text-sm text-green-700">Ofertas Reales</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {analysisResult.analysis.summary.demoPractices}
                </div>
                <div className="text-sm text-red-700">Ofertas Demo</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analysisResult.analysis.summary.demoUsers}
                </div>
                <div className="text-sm text-orange-700">Usuarios Demo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        {previewMode && analysisResult.analysis.summary.demoPractices > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                Limpieza Requerida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                Se detectaron {analysisResult.analysis.summary.demoPractices} ofertas demo y {analysisResult.analysis.summary.demoUsers} usuarios demo. 
                Se recomienda limpiar estos datos para mostrar solo ofertas reales.
              </p>
              <Button 
                onClick={executeCleanup}
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ejecutar Limpieza del Sistema
              </Button>
            </CardContent>
          </Card>
        )}

        {!previewMode && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Sistema Limpiado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                ✅ Sistema limpiado exitosamente. Ahora solo se muestran ofertas reales de la base de datos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Detalles del Análisis */}
        <Tabs defaultValue="offers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="offers">Ofertas</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="relations">Relaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="offers">
            <div className="grid gap-4">
              {/* Ofertas Reales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Ofertas Reales ({analysisResult.cleaned.practices.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult.cleaned.practices.length === 0 ? (
                    <p className="text-muted-foreground">No se encontraron ofertas reales.</p>
                  ) : (
                    <div className="space-y-2">
                      {analysisResult.cleaned.practices.map((practice: Practice) => (
                        <div key={practice.id} className="flex items-center gap-2 p-2 border rounded">
                          <Building2 className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <div className="font-medium">{practice.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {practice.company?.name} • {practice.city}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600">Real</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ofertas Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Ofertas Demo/Quemadas ({analysisResult.removed.practices.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult.removed.practices.length === 0 ? (
                    <p className="text-muted-foreground">No se encontraron ofertas demo.</p>
                  ) : (
                    <div className="space-y-2">
                      {analysisResult.removed.practices.map((practice: Practice) => {
                        const analysis = analysisResult.analysis.practices.find(
                          (a: any) => a.practice.id === practice.id
                        )
                        return (
                          <div key={practice.id} className="p-3 border rounded bg-red-50">
                            <div className="flex items-center gap-2 mb-2">
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <div className="flex-1">
                                <div className="font-medium">{practice.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {practice.company?.name} • {practice.city}
                                </div>
                              </div>
                              <Badge variant="destructive">Demo</Badge>
                              <Badge variant="outline">Score: {analysis?.validity.score}</Badge>
                            </div>
                            {analysis?.validity.reasons && (
                              <div className="text-xs text-red-600 ml-6">
                                <strong>Razones:</strong> {analysis.validity.reasons.join(", ")}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Análisis de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemData.users.map((user) => {
                      const validity = analyzeUserValidity(user)
                      return (
                        <div key={user.id} className={`p-3 border rounded ${validity.isReal ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className="flex items-center gap-2">
                            {validity.isReal ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email} • {user.role}</div>
                            </div>
                            <Badge variant={validity.isReal ? "default" : "destructive"}>
                              {validity.isReal ? "Real" : "Demo"}
                            </Badge>
                            <Badge variant="outline">Score: {validity.score}</Badge>
                          </div>
                          {validity.reasons.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-2 ml-6">
                              <strong>Razones:</strong> {validity.reasons.join(", ")}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relations">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Impacto en Relaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.removed.applications}
                      </div>
                      <div className="text-sm text-muted-foreground">Aplicaciones a eliminar</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.removed.threads}
                      </div>
                      <div className="text-sm text-muted-foreground">Hilos a eliminar</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.removed.messages}
                      </div>
                      <div className="text-sm text-muted-foreground">Mensajes a eliminar</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Al eliminar ofertas y usuarios demo, también se eliminarán automáticamente 
                      todas las aplicaciones, hilos de conversación y mensajes relacionados para 
                      mantener la integridad de los datos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}