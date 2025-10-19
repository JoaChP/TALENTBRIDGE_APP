import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "sonner"
import "../src/index.css"

export const metadata: Metadata = {
  title: "TalentBridge - Conectando Talento con Oportunidades",
  description: "Plataforma para conectar estudiantes con prácticas profesionales",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
