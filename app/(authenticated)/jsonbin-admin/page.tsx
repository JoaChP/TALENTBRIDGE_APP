"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"
import { toast } from "sonner"
import { RefreshCw, Download, Database, Cloud, CheckCircle } from "lucide-react"

export default function JSONBinAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [remoteData, setRemoteData] = useState<any>(null)
  const [lastSync, setLastSync] = useState<string>("")

  const loadRemoteData = async () => {
    setIsLoading(true)
    try {
      const data = await vercelJsonBinService.fetchInitialData()
      setRemoteData(data)
      setLastSync(new Date().toLocaleString())
      toast.success("Datos cargados desde JSONBin")
    } catch (error) {
      console.error("Error loading remote data:", error)
      toast.error("Error al cargar datos de JSONBin")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRemoteData()
  }, [])

  const downloadData = () => {
    if (!remoteData) return
    const dataStr = JSON.stringify(remoteData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `jsonbin-backup-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success("Datos descargados")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            Administración JSONBin
          </h1>
          <p className="text-muted-foreground">
            Gestiona y monitorea los datos almacenados en JSONBin
          </p>
        </div>

        {/* Estado de Conexión */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado de Conexión
              </span>
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                Conectado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {remoteData?.users?.length || 0}
                </div>
                <div className="text-sm font-medium">Usuarios</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {remoteData?.practices?.length || 0}
                </div>
                <div className="text-sm font-medium">Prácticas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {remoteData?.applications?.length || 0}
                </div>
                <div className="text-sm font-medium">Aplicaciones</div>
              </div>
            </div>
            {lastSync && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Última sincronización: {lastSync}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button onClick={loadRemoteData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Recargar Datos
              </Button>
              <Button onClick={downloadData} variant="outline" disabled={!remoteData}>
                <Download className="h-4 w-4 mr-2" />
                Descargar Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vista Previa de Datos */}
        {remoteData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vista Previa de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(remoteData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
