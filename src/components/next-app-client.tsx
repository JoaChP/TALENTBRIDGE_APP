"use client"

import dynamic from "next/dynamic"

// Dynamically import the SPA entry and disable SSR so it only runs in the browser
const App = dynamic(() => import("../App"), { ssr: false })

export default function NextAppClient() {
  return <App />
}
