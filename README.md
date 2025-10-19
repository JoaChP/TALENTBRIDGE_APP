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
    return response.json();
  },
  // ... más métodos
};
\`\`\`

2. **Actualiza el store de auth** para usar la nueva API

3. **Configura variables de entorno** para la URL del backend

### Backend Sugerido

Puedes usar cualquier stack backend. Ejemplo con Node.js + Express:

\`\`\`javascript
// Node.js + Express + PostgreSQL/MongoDB/MariaDB
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Validar credenciales
  // Generar JWT
  // Retornar usuario y token
});
\`\`\`

## 🎨 Personalización

### Colores
Edita `src/index.css` para cambiar el tema:

\`\`\`css
@theme inline {
  --color-primary: #4f46e5; /* Cambia el color primario */
  /* ... más colores */
}
\`\`\`

### Componentes
Todos los componentes UI están en `src/components/ui/` y pueden personalizarse.

## ♿ Accesibilidad

- Navegación por teclado completa
- ARIA labels y roles
- Contraste AA
- Focus visible
- Screen reader friendly

## 📱 Responsive

- Mobile-first design
- Tab bar en móvil
- Sidebar en desktop
- Breakpoints: sm (640px), md (768px), lg (1024px)

## 🧪 Testing (Opcional)

Para agregar tests:

\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
\`\`\`

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir los cambios.
