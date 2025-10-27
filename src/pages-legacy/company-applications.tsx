"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import { RefreshCw } from "lucide-react"

export default function CompanyApplicationsPage() {
	const [loading, setLoading] = useState(true)
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

	const user = useAuthStore((s) => s.user)

	useEffect(() => {
		// lightweight placeholder load
		const load = async () => {
			setLoading(true)
			try {
				await mockApi.listApplications("all")
			} catch (e) {
				// ignore
			} finally {
				setLoading(false)
				setLastUpdate(new Date())
			}
		}
		load()
	}, [user])

	if (loading) return <LoadingSkeleton />

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">Gestión Empresarial</h1>
					<p className="text-sm text-zinc-600">Listado de postulaciones (placeholder)</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => setLoading(true)}>
						<RefreshCw className="h-4 w-4" />
						<span className="ml-2">Actualizar</span>
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Postulaciones (placeholder)</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-zinc-600">Esta vista fue reducida temporalmente para restaurar la compilación. Reimplementaré la versión completa después.</p>
					<p className="text-xs text-muted-foreground mt-4">Última actualización: {lastUpdate.toLocaleTimeString()}</p>
				</CardContent>
			</Card>
		</div>
	)
}

