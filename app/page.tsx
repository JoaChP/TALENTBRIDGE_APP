import NextAppClient from "../src/components/next-app-client"

export default function Page() {
  return (
    <>
      {/* Server-rendered hero/fallback so the Home content is visible even before the SPA mounts */}
      <main className="py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h1 className="text-2xl font-semibold">Bienvenido a TalentBridge</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Conecta estudiantes con prácticas profesionales. Explora oportunidades, postula y gestiona procesos de selección.
            </p>
            {/* El hero server-rendered no muestra CTAs de búsqueda o login para evitar duplicación con la SPA cliente */}
          </div>
        </div>
      </main>

      {/* Client SPA mounts below (dynamic import, ssr: false) */}
      <NextAppClient />
    </>
  )
}
