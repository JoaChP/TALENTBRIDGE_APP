import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../../app/globals.css'
import { mockApi } from '../mocks/api'

export default function MyApp({ Component, pageProps }: AppProps) {
  // Reload data from localStorage after client-side hydration
  useEffect(() => {
    mockApi.reloadFromStorage()
  }, [])

  return <Component {...pageProps} />
}
