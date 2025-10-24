"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { ExternalLink, Database, Cloud, Lock, Zap } from "lucide-react"

export default function JSONBinDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Database className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold">JSONBin Integration</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Persistencia de datos en la nube para TalentBridge
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline">Opcional</Badge>
              <Badge variant="outline">Fácil Configuración</Badge>
              <Badge variant="outline">Gratis</Badge>
            </div>
          </div>

          {/* What is JSONBin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                ¿Qué es JSONBin?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                JSONBin es un servicio en la nube que permite almacenar datos JSON de forma simple y gratuita. 
                Hemos integrado JSONBin en TalentBridge para proporcionar persistencia de datos real en lugar 
                de depender únicamente del localStorage del navegador.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✅ Con JSONBin
                  </h4>
                  <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                    <li>• Datos persistentes entre dispositivos</li>
                    <li>• Backup automático en la nube</li>
                    <li>• Sincronización en tiempo real</li>
                    <li>• Acceso desde cualquier navegador</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    ⚠️ Solo localStorage
                  </h4>
                  <ul className="text-sm space-y-1 text-amber-700 dark:text-amber-300">
                    <li>• Datos solo en este navegador</li>
                    <li>• Se pierden al limpiar cache</li>
                    <li>• No hay backup</li>
                    <li>• Limitado a un dispositivo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuración Rápida (5 minutos)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Crear cuenta en JSONBin</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Ve a jsonbin.io y crea una cuenta gratuita
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer">
                        Ir a JSONBin <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Crear un Bin</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      En tu dashboard, crea un nuevo bin llamado "TalentBridge Data" con estructura JSON básica
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Obtener credenciales</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Copia tu Bin ID y Secret Key desde tu dashboard
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Configurar variables de entorno</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Edita el archivo .env.local con tus credenciales
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs">
                      NEXT_PUBLIC_JSONBIN_BIN_ID=tu_bin_id_aqui<br/>
                      JSONBIN_SECRET_KEY=tu_secret_key_aqui<br/>
                      NEXT_PUBLIC_USE_JSONBIN=true
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-green-600 dark:text-green-300">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">¡Listo!</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reinicia el servidor y ve al panel de administración para probar la conexión
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Características del Sistema Híbrido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="font-semibold mb-2">Persistencia Real</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tus datos se guardan en la nube y están disponibles desde cualquier dispositivo
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <h4 className="font-semibold mb-2">Cache Local</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Respuestas instantáneas gracias al cache en localStorage
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <h4 className="font-semibold mb-2">Fallback Seguro</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Si JSONBin falla, la app continúa funcionando con localStorage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado Actual de JSONBin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {process.env.NEXT_PUBLIC_USE_JSONBIN === 'true' ? 'HABILITADO' : 'DESHABILITADO'}
                </Badge>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {process.env.NEXT_PUBLIC_USE_JSONBIN === 'true' 
                    ? 'JSONBin está activo. Los datos se sincronizan con la nube.'
                    : 'JSONBin está deshabilitado. Solo se usa localStorage.'
                  }
                </p>
                
                <div className="mt-6 flex gap-2 justify-center">
                  <Button asChild>
                    <a href="/jsonbin-admin">
                      Panel de Administración
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/JSONBIN_SETUP.md" target="_blank">
                      Guía Completa
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">¿Es gratis JSONBin?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sí, JSONBin ofrece un plan gratuito con 100,000 requests/mes, más que suficiente para TalentBridge.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">¿Qué pasa si no configuro JSONBin?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  La aplicación funciona perfectamente solo con localStorage. JSONBin es completamente opcional.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">¿Puedo migrar mis datos existentes?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sí, el panel de administración incluye una función para migrar automáticamente tus datos actuales a JSONBin.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">¿Es seguro JSONBin?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  JSONBin es un servicio confiable usado por miles de desarrolladores. Tus datos están privados en tu bin personal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}