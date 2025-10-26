# 🗃️ JSONBin Integration Guide

## ¿Qué es JSONBin?

JSONBin es un servicio en la nube que permite almacenar datos JSON de forma simple y gratuita. Hemos integrado JSONBin en TalentBridge para proporcionar persistencia de datos real en lugar de depender únicamente del localStorage del navegador.

## 🚀 Configuración Rápida

### 1. Crear cuenta en JSONBin
1. Ve a [jsonbin.io](https://jsonbin.io)
2. Crea una cuenta gratuita
3. Ve a tu dashboard

### 2. Crear un Bin
1. En el dashboard, haz clic en "Create Bin"
2. Nombra tu bin (ej: "TalentBridge Data")
3. Pega el siguiente JSON inicial:

```json
{
  "users": [
    {
      "id": "1",
      "name": "Ana García",
      "email": "estudiante@demo.com",
      "role": "estudiante",
      "phone": "+52 55 1234 5678",
      "about": "Estudiante de Ingeniería en Sistemas apasionada por el desarrollo web.",
      "avatarUrl": "/estudiante-mujer-profesional.jpg"
    },
    {
      "id": "2",
      "name": "TechCorp SA",
      "email": "empresa@demo.com",
      "role": "empresa",
      "avatarUrl": "/technology-company-logo.jpg"
    },
    {
      "id": "3",
      "name": "Admin Sistema",
      "email": "admin@demo.com",
      "role": "admin",
      "avatarUrl": "/admin-icon.jpg"
    }
  ],
  "practices": [],
  "applications": [],
  "threads": [],
  "messages": []
}
```

4. Guarda el bin y copia el **Bin ID**

### 3. Obtener tu Secret Key
1. Ve a "Account Settings" en JSONBin
2. Encuentra tu **Secret Key** en la sección "API Keys"
3. Cópiala (mantén esto seguro)

### 4. Configurar Variables de Entorno
Edita el archivo `.env.local` en la raíz del proyecto:

```bash
# JSONBin Configuration
NEXT_PUBLIC_JSONBIN_BIN_ID=tu_bin_id_aqui
JSONBIN_SECRET_KEY=tu_secret_key_aqui

# Set to 'true' to use JSONBin, 'false' to use localStorage only
NEXT_PUBLIC_USE_JSONBIN=true
```

### 5. Reiniciar el Servidor
```bash
npm run dev
```

## 🔧 Características del Sistema Híbrido

### Modo localStorage (Por defecto)
- **NEXT_PUBLIC_USE_JSONBIN=false**
- Los datos se almacenan solo en el navegador
- Perfecto para desarrollo y pruebas
- No requiere configuración externa

### Modo JSONBin 
- **NEXT_PUBLIC_USE_JSONBIN=true**
- Los datos se sincronizan con JSONBin
- localStorage actúa como cache local
- Datos persistentes entre dispositivos y sesiones

### Funcionamiento Híbrido
1. **Lectura**: Primero busca en cache local, luego en JSONBin
2. **Escritura**: Guarda inmediatamente en localStorage, luego sincroniza con JSONBin
3. **Cache**: 30 segundos de validez para reducir llamadas a la API
4. **Fallback**: Si JSONBin falla, continúa funcionando con localStorage

## 🎛️ Panel de Administración

Accede a `/jsonbin-admin` (solo administradores) para:

- **Monitorear estado** de la conexión
- **Migrar datos** de localStorage a JSONBin
- **Sincronizar** manualmente los datos
- **Ver preview** de datos locales y remotos
- **Probar conexión** con JSONBin

## 🧪 Testing

### Probar la Integración
1. Ve a `/jsonbin-admin`
2. Haz clic en "Test Connection"
3. Si todo está bien, debería mostrar "Connection successful!"

### Migrar Datos Existentes
1. Si ya tienes datos en localStorage, usa "Migrate to JSONBin"
2. Esto subirá todos tus datos actuales a JSONBin

### Forzar Sincronización
- Usa "Force Sync" para sincronizar datos manualmente
- Útil para resolver conflictos o verificar consistencia

## 🔍 Debugging

### Logs del Sistema
El sistema JSONBin genera logs detallados en la consola:
- `[JSONBin]` - Operaciones del servicio JSONBin
- `[HybridApi]` - Operaciones del sistema híbrido
- `[JSONBinMockApi]` - Operaciones del adaptador

### Problemas Comunes

**"Connection failed"**
- Verifica que el Bin ID y Secret Key sean correctos
- Asegúrate de que el bin existe en tu cuenta
- Revisa tu conexión a internet

**"Migration failed"**
- Verifica que JSONBin esté habilitado
- Asegúrate de tener datos en localStorage para migrar
- Revisa los logs en la consola

**Datos no se sincronizan**
- Verifica que NEXT_PUBLIC_USE_JSONBIN=true
- Usa "Force Sync" en el panel de administración
- Revisa los logs para errores de red

## 📊 Beneficios

### Para Desarrollo
- **Flexibilidad**: Alterna entre local y remoto fácilmente
- **Performance**: Cache local para respuestas rápidas
- **Offline**: Funciona sin conexión usando localStorage

### Para Producción
- **Persistencia**: Datos permanentes entre sesiones
- **Multi-dispositivo**: Accede a tus datos desde cualquier lugar
- **Backup**: Los datos están seguros en la nube
- **Escalabilidad**: Fácil transición a base de datos real

## 🔒 Seguridad

- **Secret Key**: Nunca expongas tu secret key en el frontend
- **Validation**: JSONBin valida automáticamente el formato JSON
- **Rate Limiting**: JSONBin tiene límites de API (100 requests/min gratis)
- **Privacy**: Tus datos están privados en tu bin personal

## 📈 Próximos Pasos

Una vez que JSONBin esté funcionando, podrás:
1. **Monitorear uso** en el dashboard de JSONBin
2. **Expandir a múltiples bins** para diferentes tipos de datos
3. **Implementar webhooks** para notificaciones en tiempo real
4. **Migrar a base de datos** real cuando sea necesario

El sistema híbrido te permite una transición suave desde localStorage hacia una solución completa de persistencia.

---

¿Necesitas ayuda? Ve al panel de administración en `/jsonbin-admin` para herramientas de diagnóstico.