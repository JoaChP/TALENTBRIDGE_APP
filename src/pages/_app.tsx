import type { AppProps } from 'next/app'
import '../../app/globals.css'
import { AppShell } from '../components/layout/app-shell'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  )
}
