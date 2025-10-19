# TalentBridge

Plataforma para conectar estudiantes con prácticas profesionales.

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:5173`

## 👥 Usuarios Demo

Puedes iniciar sesión con las siguientes credenciales:

- **Estudiante**: `estudiante@demo.com` / `123456`
- **Empresa**: `empresa@demo.com` / `123456`
- **Admin**: `admin@demo.com` / `123456`

## 🏗️ Tecnologías

- **React 18** + **Vite** + **TypeScript**
- **TailwindCSS v4** para estilos
- **shadcn/ui** para componentes
- **react-router-dom v6** para navegación
- **react-hook-form** + **zod** para formularios
- **zustand** para gestión de estado
- **sonner** para notificaciones

## 📁 Estructura del Proyecto

\`\`\`
src/
├── components/       # Componentes reutilizables
│   ├── layout/      # AppShell, TopBar, TabBar, Sidebar
│   └── ui/          # Componentes base (Button, Input, etc.)
├── pages/           # Páginas de la aplicación
│   └── dashboard/   # Dashboards por rol
├── stores/          # Estado global (Zustand)
├── mocks/           # API mock con localStorage
├── types/           # Tipos TypeScript
└── lib/             # Utilidades
\`\`\`

## 🎯 Características

### Roles y Permisos
- **Estudiante**: Buscar y aplicar a prácticas
- **Empresa**: Publicar ofertas y gestionar candidatos
- **Admin**: Moderar contenido y usuarios

### Funcionalidades Principales
- ✅ Autenticación con roles
- ✅ Búsqueda avanzada con filtros
- ✅ Paginación
- ✅ Sistema de mensajería
- ✅ Wizard multi-paso para publicar ofertas
- ✅ Dashboards personalizados por rol
- ✅ Responsive (mobile-first)
- ✅ Accesibilidad (WCAG AA)
- ✅ Dark mode

## 🔄 Migración a API Real

Actualmente la aplicación usa un mock API con localStorage. Para conectar con un backend real:

1. **Reemplaza `src/mocks/api.ts`** con llamadas HTTP reales:

\`\`\`typescript
// Ejemplo con fetch
export const api = {
  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    # TalentBridge

    Plataforma para conectar estudiantes con prácticas profesionales.

    ## Estado del proyecto
    Este repo usa Next.js (app + pages hybrid) con TypeScript y TailwindCSS. El proyecto contiene una SPA interna (en `src/App.tsx`) que usa `react-router-dom` y varios componentes adaptados para ejecutarse en el cliente.

    > Nota: la versión actual ya pasa la compilación local (`pnpm run build`) en mi entorno.

    ## Requisitos locales
    - Node.js >= 18 (recomendado)
    - pnpm (usa `pnpm install` y `pnpm run ...`)

    ## Comandos útiles
    ```powershell
    pnpm install
    pnpm dev      # iniciar dev server (next dev)
    pnpm run build
    pnpm start    # iniciar servidor de producción (next start)
    pnpm tsc --noEmit
    ```

    ## Variables de entorno
    Si conectas la app a un backend real, añade variables en `.env` o en Vercel (Settings > Environment Variables).
    - `NEXT_PUBLIC_API_URL` — URL pública del API (opcional)
    - `API_KEY` / otros secretos — configúralos en Vercel como variables de entorno no públicas

    ## Notas sobre la arquitectura
    - Next.js maneja las rutas principales. Algunas partes internas (la SPA bajo `src/App.tsx`) se cargan únicamente en el cliente mediante un wrapper (`src/components/next-app-client.tsx`) que usa `dynamic(..., { ssr: false })`.
    - Evita importar módulos que accedan a `window`/`document` desde componentes server-rendered. Los componentes que usan APIs de navegador deben ser "client components" (añadir `"use client"` arriba) o importados dinámicamente con `ssr: false`.

    ## Despliegue en Vercel (guía rápida)
    1. Conecta tu repositorio a Vercel (Import Project).
    2. Ajustes de Build:
       - Install Command: `pnpm install`
       - Build Command: `pnpm run build`
       - Output Directory: dejar vacío (Next.js detectado automáticamente)
    3. En Settings -> General, fija la versión de Node si deseas (por ejemplo `18` o `20`).
    4. Environment Variables: añade las variables necesarias (por ejemplo `NEXT_PUBLIC_API_URL`).
    5. Asegúrate de haber commiteado el `pnpm-lock.yaml` y cualquier archivo de aprobaciones (`pnpm-workspace.yaml` si aplica) para que Vercel use pnpm sin interacción.
    6. Despliega y revisa los Build Logs. Si aparece un error de prerender relacionado con `useNavigate` o `document is not defined`, copia la traza y corrige las importaciones que ejecutan código cliente en el servidor.

    ## Verificación post-deploy
    - Revisa la URL de despliegue en Vercel.
    - Comprueba la consola del navegador para errores JS.
    - En Vercel, revisa `Functions` / `Serverless` logs o Logs de despliegue si hay errores.

    ## Qué hice para ayudar al despliegue
    - Aprobé y commité cambios relacionados con `pnpm approve-builds` para evitar prompts en CI.
    - Reemplacé varias importaciones de `react-router-dom` en componentes de layout por `next/link` y `next/navigation` para evitar errores de prerender.
    - Añadí un wrapper cliente para cargar la SPA interna sin SSR.

    ## Próximos pasos sugeridos
    - Revisar y migrar más partes que dependan de `react-router-dom` si prefieres usar exclusivamente Next routing.
    - Arrancar `pnpm start` y probar la build localmente antes de hacer deploy en Vercel.

    ## Contribuir
    Las contribuciones son bienvenidas. Abre un issue para discutir cambios mayores.

    ---

    MIT
## 📄 Licencia
