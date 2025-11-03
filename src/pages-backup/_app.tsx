/*
  Archivo: src/pages-backup/_app.tsx
  Propósito:
    - Wrapper de la aplicación para la copia de respaldo. Se encarga de recargar datos desde
      `localStorage` al inicializar el cliente para asegurar que los componentes consuman el estado local.

  Notas:
    - Usa `mockApi.reloadFromStorage()` para restaurar el estado de prueba.
    - Muestra nada hasta que la re-carga se completa para evitar flashes con datos incorrectos.
*/

import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../../app/globals.css'
import { mockApi } from '../mocks/api'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isReady, setIsReady] = useState(false)

  // Recargar datos desde storage tras hidratar el cliente
  useEffect(() => {
    const reloaded = mockApi.reloadFromStorage()
    console.log('[_app] Data reloaded from storage:', reloaded)

    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Evitar renderizar hasta que los datos estén preparados
  if (!isReady) {
    return null
  }

  return <Component {...pageProps} />
}
