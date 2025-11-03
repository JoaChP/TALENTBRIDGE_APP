/*
  Archivo: src/pages-backup/dashboard/admin.tsx
  Propósito:
    - Dashboard sencillo para administradores donde se muestran métricas rápidas y opciones de moderación.
    - Es estático en esta copia de respaldo; reemplazar por datos reales cuando el API esté disponible.
*/

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"

export function AdminDashboard() {
  // Componente: AdminDashboard
  // - Presenta métricas resumidas (usuarios, prácticas, aplicaciones) y panel de moderación.
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard Administrador</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-pretty">Modera ofertas y gestiona usuarios</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prácticas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">6</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aplicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderación de Ofertas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No hay ofertas pendientes de moderación</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
