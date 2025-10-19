"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom"

export function CompanyDashboard() {
  const navigate = useNavigate()

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
          <Button onClick={() => navigate("/publicar")}>Publicar Nueva Práctica</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidatos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No hay candidatos aún</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompanyDashboard
