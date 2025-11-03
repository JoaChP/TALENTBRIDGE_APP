"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import IconButton from "../components/ui/icon-button"
import { Badge } from "../components/ui/badge"
import { LoadingSkeleton } from "../components/loading-skeleton"
import { mockApi } from "../mocks/api"
import { useAuthStore } from "../stores/auth-store"
import type { Application, Practice, User } from "../types"
import { RefreshCw, Trash2, Check, X, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

export default function CompanyApplicationsPage() {
	const [loading, setLoading] = useState(true)
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
	const [applications, setApplications] = useState<Application[]>([])
	const [practices, setPractices] = useState<Practice[]>([])
	const [users, setUsers] = useState<User[]>([])
		const itemsPerPage = 8
	const [page, setPage] = useState(1)
	const [operationInProgress, setOperationInProgress] = useState(false)

	const currentUser = useAuthStore((s) => s.user)

	const loadData = async () => {
		setLoading(true)
		try {
			const [apps, allPractices, allUsers] = await Promise.all([
				mockApi.listApplications("all"),
				mockApi.listPractices(),
				mockApi.listUsers(),
			])

			setApplications(apps)
			setPractices(allPractices)
			setUsers(allUsers)
			setLastUpdate(new Date())
		} catch (err) {
			console.error(err)
			toast.error("Error al cargar postulaciones")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()

		// Auto-refresh every 30s
		const interval = setInterval(() => loadData(), 30_000)

		// Listen to global updates
		const handle = () => loadData()
		window.addEventListener("talentbridge-data-updated", handle)

		return () => {
			clearInterval(interval)
			window.removeEventListener("talentbridge-data-updated", handle)
		}
	}, [])

	const ownedPracticeIds = useMemo(() => {
		if (!currentUser) return []
		if (currentUser.role === "admin") return practices.map((p) => p.id)
		return practices.filter((p) => p.company.ownerUserId === currentUser.id).map((p) => p.id)
	}, [practices, currentUser])

	// Filter applications to show only those relevant to this company (or all for admin)
	const visibleApplications = useMemo(() => {
		if (!currentUser) return []
		if (currentUser.role === "admin") return applications
		return applications.filter((a) => ownedPracticeIds.includes(a.practiceId))
	}, [applications, ownedPracticeIds, currentUser])

	const totalPages = Math.max(1, Math.ceil(visibleApplications.length / itemsPerPage))
	const paginated = visibleApplications.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)

	const findPractice = (id: string) => practices.find((p) => p.id === id)
	const findUser = (id: string) => users.find((u) => u.id === id)

	const handleChangeStatus = async (applicationId: string, action: "accept" | "reject" | "review") => {
		if (!currentUser) return
		if (!confirm("¿Confirmar acción?")) return
		setOperationInProgress(true)
		try {
			if (action === "accept") await mockApi.acceptApplication(applicationId)
			if (action === "reject") await mockApi.rejectApplication(applicationId)
			if (action === "review") await mockApi.reviewApplication(applicationId)
			toast.success("Acción realizada")
			await loadData()
		} catch (e) {
			console.error(e)
			toast.error("Error al actualizar estado")
		} finally {
			setOperationInProgress(false)
		}
	}

	const handleDelete = async (applicationId: string) => {
		if (!confirm("¿Eliminar postulación? (No se puede eliminar una aceptada)")) return
		setOperationInProgress(true)
		try {
			await mockApi.deleteApplication(applicationId)
			toast.success("Postulación eliminada")
			await loadData()
		} catch (e: any) {
			console.error(e)
			toast.error(e?.message || "Error al eliminar")
		} finally {
			setOperationInProgress(false)
		}
	}

	const handleCreateThread = async (practiceId: string, userId: string) => {
		setOperationInProgress(true)
		try {
			await mockApi.createThreadForApplication(practiceId, userId)
			toast.success("Conversación creada")
		} catch (e) {
			console.error(e)
			toast.error("Error al crear conversación")
		} finally {
			setOperationInProgress(false)
		}
	}

	if (loading) return <LoadingSkeleton />

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">Gestión de Postulaciones</h1>
					<p className="text-sm text-zinc-600">Revisa y gestiona las postulaciones recibidas</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => { setLoading(true); loadData(); toast.success('Lista actualizada') }} disabled={loading}>
						<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Postulaciones ({visibleApplications.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{paginated.length === 0 ? (
							<p className="text-sm text-zinc-600">No hay postulaciones para mostrar</p>
						) : (
							paginated.map((app) => {
								const practice = findPractice(app.practiceId)
								const applicant = findUser(app.userId)
								return (
									<div key={app.id} className="flex items-center justify-between p-3 border rounded">
										<div>
											<div className="font-medium">{applicant?.name || app.userId} <span className="text-xs text-zinc-500">· {practice?.title}</span></div>
											<div className="text-xs text-zinc-600">{new Date(app.createdAt).toLocaleString()}</div>
										</div>
										<div className="flex items-center gap-2">
																						<Badge variant="secondary">{app.status}</Badge>
																						<IconButton color="blue" variant="default" label="Mensaje" onClick={() => handleCreateThread(app.practiceId, app.userId)} disabled={operationInProgress} icon={<MessageSquare className="h-4 w-4" />} />
																						{app.status !== "Aceptada" && (
																								<IconButton color="rose" variant="default" label="Eliminar" onClick={() => handleDelete(app.id)} disabled={operationInProgress} icon={<Trash2 className="h-4 w-4" />} />
																						)}
																							<IconButton color="slate" variant="outline" label="Revisando" onClick={() => handleChangeStatus(app.id, 'review')} disabled={operationInProgress} icon={<ChevronRight className="h-4 w-4" />} />
																						<IconButton color="teal" variant="default" label="Aceptar" onClick={() => handleChangeStatus(app.id, 'accept')} disabled={operationInProgress} icon={<Check className="h-4 w-4" />} />
																						<IconButton color="rose" variant="default" label="Rechazar" onClick={() => handleChangeStatus(app.id, 'reject')} disabled={operationInProgress} icon={<X className="h-4 w-4" />} />
										</div>
									</div>
								)
							})
						)}

						{/* Pagination controls */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between pt-4">
								<p className="text-sm">Página {page} de {totalPages}</p>
								<div className="flex gap-2">
									<Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
									<Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<p className="text-xs text-muted-foreground">Última actualización: {lastUpdate.toLocaleTimeString()}</p>
		</div>
	)
}

