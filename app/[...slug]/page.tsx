import NextAppClient from "../../src/components/next-app-client"

// Catch-all server page: delegate rendering to the client SPA so direct visits
// to client-side routes (e.g. /mensajes/t1) don't return 404 on the server.
export default function CatchAllPage() {
  return <NextAppClient />
}
