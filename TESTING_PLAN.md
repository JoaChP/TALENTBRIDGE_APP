# 🧪 Plan de Pruebas - JSONBin Only Mode

## ✅ Pruebas Realizadas Automáticamente

### 1. Verificación de Código
- ✅ No hay errores de compilación en archivos principales
- ✅ `auth-store.ts` - Sin localStorage
- ✅ `api.ts` - Sin localStorage  
- ✅ `vercel-jsonbin.ts` - Sin localStorage
- ✅ `jsonbin.config.ts` - Configuración forzada
- ✅ `performance.ts` - Sin OptimizedStorage

### 2. Búsqueda de localStorage Residual
Se encontraron referencias a localStorage en:
- 📄 Archivos de documentación (esperado)
- 📄 Archivos de prueba antiguos (debug, auto-test)
- 📄 Archivos de backup/páginas viejas
- 📄 Servicios híbridos antiguos (jsonbin.ts, hybrid-api.ts)

**Acción**: Estos archivos son legacy o de prueba, no afectan la funcionalidad principal.

## 🎯 Pruebas Manuales Requeridas

### Prueba 1: Login y Sesión
```
1. Abrir http://localhost:5173/login
2. Login con: estudiante@demo.com / 123456
3. ✓ Verificar que se carga el dashboard
4. ✓ Abrir DevTools > Application > Storage
5. ✓ Confirmar que NO hay "talentbridge_data" en localStorage
6. ✓ Confirmar que SÍ hay "auth-storage" en sessionStorage
7. Cerrar navegador y reabrir
8. ✓ Verificar que la sesión NO persiste (correcto)
```

### Prueba 2: Registro de Usuario
```
1. Ir a /registro
2. Registrar nuevo usuario:
   - Nombre: Test User
   - Email: test@test.com
   - Rol: Estudiante
3. ✓ Verificar que el registro es exitoso
4. ✓ Abrir Red en DevTools
5. ✓ Verificar que se hace PUT a api.jsonbin.io
6. Login con el nuevo usuario
7. ✓ Verificar que funciona
```

### Prueba 3: Crear Práctica (como Empresa)
```
1. Login como: empresa@demo.com / 123456
2. Ir a dashboard > Nueva Práctica
3. Crear práctica de prueba
4. ✓ Verificar que se guarda
5. ✓ Verificar llamada a JSONBin en Network
6. Recargar página (F5)
7. ✓ Verificar que la práctica persiste
```

### Prueba 4: Aplicar a Práctica (como Estudiante)
```
1. Login como: estudiante@demo.com / 123456
2. Buscar prácticas
3. Aplicar a una práctica
4. ✓ Verificar que la aplicación se registra
5. ✓ Verificar guardado en JSONBin
6. Como empresa, ver aplicaciones recibidas
7. ✓ Verificar que aparece la nueva aplicación
```

### Prueba 5: Mensajería
```
1. Como estudiante, enviar mensaje a empresa
2. ✓ Verificar que se crea el thread
3. ✓ Verificar guardado en JSONBin
4. Como empresa, responder mensaje
5. ✓ Verificar que ambos ven la conversación
6. Recargar ambas páginas
7. ✓ Verificar que los mensajes persisten
```

### Prueba 6: Admin - Gestión de Usuarios
```
1. Login como: admin@demo.com / 123456
2. Ir a panel de admin
3. Ver lista de usuarios
4. ✓ Editar un usuario
5. ✓ Verificar guardado en JSONBin
6. ✓ Eliminar un usuario de prueba
7. ✓ Verificar que se eliminó de JSONBin
```

### Prueba 7: Persistencia Entre Dispositivos
```
1. Login en navegador Chrome
2. Crear una práctica
3. Abrir navegador Firefox (o Edge)
4. Login con la misma cuenta
5. ✓ Verificar que la práctica creada en Chrome aparece en Firefox
6. ✓ Esto confirma que JSONBin es la única fuente de verdad
```

### Prueba 8: Modo Offline
```
1. Con la app cargada, desconectar internet
2. Intentar crear una práctica
3. ✓ Verificar error apropiado
4. ✓ Verificar que no se pierde el estado actual
5. Reconectar internet
6. Recargar página
7. ✓ Verificar que los datos se cargan desde JSONBin
```

### Prueba 9: Cache de 30 segundos
```
1. Abrir Network en DevTools
2. Cargar dashboard (hace llamada a JSONBin)
3. Recargar inmediatamente (F5)
4. ✓ Verificar que NO se hace nueva llamada (usa cache)
5. Esperar 35 segundos
6. Recargar (F5)
7. ✓ Verificar que SÍ se hace nueva llamada a JSONBin
```

### Prueba 10: Error Handling
```
1. En jsonbin.config.ts, cambiar temporalmente el binId a uno inválido
2. Recargar app
3. ✓ Verificar que muestra error apropiado
4. ✓ Verificar que usa datos por defecto
5. Restaurar binId correcto
6. Recargar
7. ✓ Verificar que todo funciona normalmente
```

## 📊 Checklist de Funcionalidades

### Autenticación
- [ ] Login estudiante
- [ ] Login empresa
- [ ] Login admin
- [ ] Registro nuevo usuario
- [ ] Logout
- [ ] Sesión NO persiste al cerrar navegador

### Estudiante
- [ ] Buscar prácticas
- [ ] Aplicar a práctica
- [ ] Ver mis aplicaciones
- [ ] Enviar mensajes
- [ ] Ver perfil

### Empresa
- [ ] Crear práctica
- [ ] Ver mis prácticas
- [ ] Ver aplicaciones recibidas
- [ ] Aceptar/Rechazar aplicaciones
- [ ] Responder mensajes

### Admin
- [ ] Ver todos los usuarios
- [ ] Editar usuarios
- [ ] Eliminar usuarios
- [ ] Ver todas las prácticas
- [ ] Ver todas las aplicaciones
- [ ] Estadísticas del sistema

### Persistencia
- [ ] Datos persisten al recargar página
- [ ] Datos persisten entre navegadores
- [ ] Datos persisten entre sesiones
- [ ] NO hay datos en localStorage
- [ ] Sesión en sessionStorage (temporal)
- [ ] Cache de 30 segundos funciona

## 🚀 Comandos de Prueba

### En el navegador (Consola de DevTools)
```javascript
// Verificar configuración JSONBin
import { JSONBIN_CONFIG } from './src/config/jsonbin.config'
console.log(JSONBIN_CONFIG)

// Verificar servicio
import { vercelJsonBinService } from './src/services/vercel-jsonbin'
await vercelJsonBinService.getStatus()

// Cargar datos
await vercelJsonBinService.fetchInitialData()

// Verificar localStorage (debe estar vacío de datos de app)
Object.keys(localStorage).filter(k => k.includes('talentbridge'))
// Resultado esperado: []

// Verificar sessionStorage (debe tener solo auth-storage)
Object.keys(sessionStorage)
// Resultado esperado: ['auth-storage']
```

### En terminal
```bash
# Iniciar servidor
pnpm dev

# En otra terminal: verificar logs
# Buscar mensajes de JSONBin en consola:
# "[JSONBin] ✅ Initialized..."
# "[JSONBin] 🌐 Fetching data from cloud..."
# "[JSONBin] ✅ Data fetched successfully..."
```

## 📝 Registro de Pruebas

**Fecha**: 26 de octubre de 2025  
**Versión**: Post-migración JSONBin-only  
**Tester**: [Tu nombre]

### Resultados
| Prueba | Estado | Notas |
|--------|--------|-------|
| Prueba 1 - Login | ⏳ Pendiente | |
| Prueba 2 - Registro | ⏳ Pendiente | |
| Prueba 3 - Crear Práctica | ⏳ Pendiente | |
| Prueba 4 - Aplicar | ⏳ Pendiente | |
| Prueba 5 - Mensajería | ⏳ Pendiente | |
| Prueba 6 - Admin | ⏳ Pendiente | |
| Prueba 7 - Multi-dispositivo | ⏳ Pendiente | |
| Prueba 8 - Offline | ⏳ Pendiente | |
| Prueba 9 - Cache | ⏳ Pendiente | |
| Prueba 10 - Error Handling | ⏳ Pendiente | |

## ⚠️ Problemas Encontrados

(Registrar aquí cualquier problema durante las pruebas)

## ✅ Conclusión

Estado general: ⏳ EN PRUEBAS

Próximo paso: Ejecutar pruebas manuales siguiendo este documento
