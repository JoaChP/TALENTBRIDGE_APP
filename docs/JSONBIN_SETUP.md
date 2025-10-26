# Configuración de JSONBin para Sincronización de Usuarios

## ¿Qué es JSONBin?

JSONBin es un servicio de almacenamiento en la nube que permite compartir datos JSON entre diferentes usuarios y dispositivos. Al configurarlo, todos los usuarios registrados se guardarán en la nube y serán visibles para todos los administradores.

## ¿Por qué usar JSONBin?

**Sin JSONBin:**
- Cada navegador tiene su propia base de datos local (localStorage)
- Los usuarios registrados solo aparecen en el navegador donde se registraron
- No hay sincronización entre dispositivos

**Con JSONBin:**
- ✅ Base de datos compartida en la nube
- ✅ Todos los usuarios registrados son visibles para todos
- ✅ Sincronización automática entre navegadores y dispositivos
- ✅ Persistencia de datos incluso si se borra el caché

## Configuración Paso a Paso

### 1. Crear cuenta en JSONBin

1. Ve a [https://jsonbin.io](https://jsonbin.io)
2. Haz clic en "Sign Up" o "Get Started"
3. Crea tu cuenta (es gratis)

### 2. Crear un Bin

1. Una vez dentro, haz clic en "Create Bin"
2. Nombra tu bin (ejemplo: "talentbridge-data")
3. Pega esta estructura inicial:

```json
{
  "users": [
    {
      "id": "1",
      "name": "Admin Sistema",
      "email": "admin@demo.com",
      "role": "admin"
    }
  ],
  "practices": [],
  "applications": [],
  "threads": [],
  "messages": []
}
```

4. Haz clic en "Create"

### 3. Obtener credenciales

1. **Bin ID**: En la URL verás algo como `jsonbin.io/app/bins/6xxxxx...` - ese ID es tu `JSONBIN_BIN_ID`
2. **API Key**: 
   - Ve a "API Keys" en el menú
   - Copia tu "Master Key" (o crea una nueva)
   - Este es tu `JSONBIN_API_KEY`

### 4. Configurar variables de entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega estas variables:

```env
NEXT_PUBLIC_USE_JSONBIN=true
NEXT_PUBLIC_JSONBIN_BIN_ID=tu_bin_id_aqui
NEXT_PUBLIC_JSONBIN_API_KEY=$2b$10$tu_api_key_aqui
```

### 5. Reiniciar servidor

```bash
pnpm dev
```

## Verificar que funciona

1. Abre la consola del navegador (F12)
2. Deberías ver mensajes como:
   ```
   [TalentBridge] Data loaded from JSONBin successfully
   ```
3. Registra un nuevo usuario
4. Verifica en la consola:
   ```
   [mockApi] Syncing new user to JSONBin: nombre_usuario
   [mockApi] User synced to JSONBin successfully
   ```
5. Abre el sitio en otro navegador o dispositivo
6. El nuevo usuario debería aparecer en la lista de administración

## Límites del Plan Gratuito

- 10,000 requests por mes
- Suficiente para desarrollo y pruebas
- Para producción considera el plan de pago

## Solución de Problemas

### "JSONBin sync skipped (not enabled)"
- Verifica que `NEXT_PUBLIC_USE_JSONBIN=true`
- Reinicia el servidor de desarrollo

### "Failed to sync user to JSONBin"
- Verifica que el API Key sea correcto
- Asegúrate de usar el "Master Key"
- Verifica que el Bin ID sea correcto

### No veo usuarios de otros navegadores
- Espera unos segundos y recarga la página
- Verifica que JSONBin esté habilitado en ambos navegadores
- Revisa la consola del navegador para errores

## Alternativas a JSONBin

Si prefieres otra opción:

- **Firebase Realtime Database**: Google, tiempo real
- **Supabase**: PostgreSQL, open source
- **MongoDB Atlas**: Base de datos NoSQL
- **PlanetScale**: MySQL serverless

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca compartas tu API Key públicamente
- No subas el archivo `.env.local` a Git
- El `.env.example` está incluido como plantilla
- En producción, usa variables de entorno del hosting

## Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica que las credenciales sean correctas
3. Asegúrate de que JSONBin esté accesible desde tu red
