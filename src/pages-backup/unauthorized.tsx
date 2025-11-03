"use client"

// Página que muestra mensaje de acceso no autorizado
import { useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { Button } from "../components/ui/button"

export function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 dark:bg-red-900/20">
        <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-400" aria-hidden="true" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Acceso No Autorizado</h1>
      <p className="mb-6 max-w-md text-zinc-600 dark:text-zinc-400 text-pretty">
        No tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un
        error.
      </p>
      <Button onClick={() => router.push("/")}>Volver al Inicio</Button>
    </div>
  )
}

export default UnauthorizedPage
