"use client"

/*
  Archivo: src/pages-backup/dashboard/company.tsx
  Propósito:
    - Dashboard de empresa: acciones y accesos rápidos para publicar ofertas y revisar candidatos.
    - Mantiene enlaces internos (pushState) para navegación SPA.
*/

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export function CompanyDashboard() {
  // Componente: CompanyDashboard
  // - Interfaz mínima para empresas; conectar con `mockApi` para obtener datos reales cuando sea necesario.
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard Empresa</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Gestiona tus ofertas y candidatos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Ofertas Publicadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">Aún no has publicado ninguna práctica</p>
          <Button onClick={() => {
            window.history.pushState({}, '', "/publish")
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}>Publicar Nueva Práctica</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidatos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Revisa las aplicaciones que has recibido
          </p>
          <Button
            variant="outline"
            onClick={() => {
              window.history.pushState({}, "", "/company-applications")
              window.dispatchEvent(new PopStateEvent("popstate"))
            }}
          >
            Ver Aplicaciones
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyDashboard
