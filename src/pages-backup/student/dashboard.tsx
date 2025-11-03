/*
  Archivo: src/pages-backup/student/dashboard.tsx
  Propósito:
    - Página wrapper que carga dinámicamente el cliente del dashboard de estudiante.
    - Usa carga dinámica (`next/dynamic`) para evitar SSR del cliente que depende de hooks/estado.
*/

import dynamic from "next/dynamic"

const StudentDashboardClient = dynamic(() => import("../../components/student-dashboard-client"), {
  ssr: false,
})

export default function Page() {
  // Componente wrapper: Page
  // - Solo renderiza el componente cliente dentro de un contenedor con padding.
  return (
    <div className="px-4 py-6">
      <StudentDashboardClient />
    </div>
  )
}
 
