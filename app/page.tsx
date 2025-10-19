import NextAppClient from "../src/components/next-app-client"

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-2xl font-semibold">Bienvenido a TalentBridge</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Conecta estudiantes con prácticas profesionales. Aquí podrás buscar oportunidades, postularte y
            gestionar procesos de selección. (Las métricas se cargarán al iniciar la aplicación en el cliente.)
          </p>
        </div>
      </div>

      <NextAppClient />
    </>
  )
}
