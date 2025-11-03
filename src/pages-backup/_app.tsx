// App custom para el backup: recarga datos desde localStorage tras hidratar
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import '../../app/globals.css'
import { mockApi } from '../mocks/api'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isReady, setIsReady] = useState(false)

  // Reload data from localStorage after client-side hydration
  useEffect(() => {
    // Force reload immediately
    const reloaded = mockApi.reloadFromStorage()
    console.log('[_app] Data reloaded from storage:', reloaded)
    
    // Mark as ready after a small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Show nothing until data is ready to prevent flash of wrong data
  if (!isReady) {
    return null
  }

  return <Component {...pageProps} />
}
