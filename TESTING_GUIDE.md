# 🧪 GUÍA DE TESTING - Sistema TTHH

Esta guía proporciona instrucciones detalladas para probar todas las funcionalidades implementadas.

---

## 📋 Prerrequisitos

- Sistema completamente iniciado (frontend, backend, infraestructura)
- Keycloak configurado según `KEYCLOAK_SETUP.md`
- Usuarios de prueba creados

---

## 🔐 TESTING DE AUTENTICACIÓN

### Test 1: Login Exitoso

**Objetivo**: Verificar que el login funciona correctamente

**Pasos**:
1. Abrir http://localhost:3000
2. Deberías ser redirigido a `/login`
3. Ingresar credenciales:
   - Usuario: `admin.tthh`
   - Contraseña: `admin123`
4. Click en "Iniciar Sesión"

**Resultado Esperado**:
- ✅ Redirección al dashboard (`/`)
- ✅ Sidebar visible con navegación
- ✅ Topbar muestra nombre de usuario y rol
- ✅ Dashboard muestra estadísticas

**Verificar en Backend**:
```bash
# Ver logs de auditoría
curl -X GET "http://localhost:8080/api/v1/auditoria?size=10&sort=createdAt,desc" \
  -H "Authorization: Bearer <token>"
```
Debería mostrar un registro de LOGIN

---

### Test 2: Login con Credenciales Inválidas

**Pasos**:
1. Ir a `/login`
2. Ingresar credenciales incorrectas:
   - Usuario: `usuario.falso`
   - Contraseña: `password123`
3. Click en "Iniciar Sesión"

**Resultado Esperado**:
- ✅ Mensaje de error: "Error al iniciar sesión. Verifique sus credenciales."
- ✅ No hay redirección
- ✅ Formulario permanece visible

---

### Test 3: Protección de Rutas

**Pasos**:
1. Abrir navegador en modo incógnito
2. Intentar acceder directamente a http://localhost:3000/tthh

**Resultado Esperado**:
- ✅ Redirección automática a `/login?callbackUrl=/tthh`
- ✅ Después de login exitoso, redirección a `/tthh`

---

### Test 4: Logout

**Pasos**:
1. Estando autenticado, click en el botón de logout (icono en topbar)
2. Confirmar logout

**Resultado Esperado**:
- ✅ Redirección a `/login`
- ✅ Tokens eliminados de localStorage
- ✅ Cookies eliminadas
- ✅ Registro de LOGOUT en auditoría

---

### Test 5: Refresh Token

**Pasos**:
1. Login exitoso
2. Esperar 30 minutos (o modificar token lifespan en Keycloak a 1 minuto)
3. Hacer una acción que requiera API call

**Resultado Esperado**:
- ✅ Token se refresca automáticamente
- ✅ Operación continúa sin interrupciones
- ✅ No hay logout forzado

---

## 🛡️ TESTING DE AUTORIZACIÓN POR ROL

### Test 6: Acceso por Rol TTHH

**Pasos**:
1. Login como `admin.tthh` / `admin123`
2. Navegar a diferentes secciones:
   - Dashboard (`/`)
   - Gestión TTHH (`/tthh`)
   - Legajos (`/tthh/legajos`)
   - Permisos y Vacaciones (`/tthh/permiso-vacaciones`)
   - Reportes (`/reportes`)

**Resultado Esperado**:
- ✅ Acceso a todas las secciones
- ✅ Todas las opciones del sidebar visibles

---

### Test 7: Acceso por Rol GERENCIA

**Pasos**:
1. Logout
2. Login como `gerente.test` / `gerente123`
3. Intentar acceder a:
   - Dashboard (`/`) - Debería funcionar
   - Gestión TTHH (`/tthh`) - Debería funcionar
   - Reportes (`/reportes`) - Debería funcionar

**Resultado Esperado**:
- ✅ Acceso a visualización
- ✅ Sin opciones de edición/eliminación (cuando se implementen)

---

### Test 8: Acceso por Rol AUDITORIA

**Pasos**:
1. Logout
2. Login como `auditor.test` / `auditor123`
3. Intentar acceder a diferentes secciones

**Resultado Esperado**:
- ✅ Acceso de solo lectura
- ✅ Acceso a logs de auditoría
- ❌ Sin opciones de modificación

---

### Test 9: Acceso por Rol COLABORADOR

**Pasos**:
1. Logout
2. Login como `colaborador.test` / `colaborador123`
3. Intentar acceder a `/tthh`

**Resultado Esperado**:
- ✅ Redirección a `/403` (Acceso Denegado)
- ✅ Mensaje claro de permisos insuficientes

---

## 🔍 TESTING DE API BACKEND

### Test 10: Obtener Token de Keycloak

```bash
curl -X POST http://localhost:8081/realms/cooperativa-reducto/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=tthh-frontend" \
  -d "username=admin.tthh" \
  -d "password=admin123" \
  -d "grant_type=password"
```

**Resultado Esperado**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI...",
  "expires_in": 1800,
  "refresh_expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "Bearer"
}
```

---

### Test 11: Listar Empleados (con token)

```bash
# Reemplazar <TOKEN> con el access_token obtenido
curl -X GET "http://localhost:8080/api/v1/empleados?page=0&size=10" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

**Resultado Esperado**:
```json
{
  "content": [],
  "totalElements": 0,
  "totalPages": 0,
  "size": 10,
  "number": 0
}
```

---

### Test 12: Crear Empleado

```bash
curl -X POST "http://localhost:8080/api/v1/empleados" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroDocumento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "email": "juan.perez@coopreducto.com",
    "telefono": "0981123456",
    "fechaNacimiento": "1990-01-15",
    "fechaIngreso": "2024-01-01",
    "cargo": "Desarrollador",
    "departamento": "TI",
    "estado": "ACTIVO",
    "direccion": "Calle Principal 123",
    "ciudad": "Asunción",
    "salario": 5000000
  }'
```

**Resultado Esperado**:
- ✅ Status 201 Created
- ✅ JSON con el empleado creado (incluyendo ID)
- ✅ Registro en tabla `empleados` de PostgreSQL
- ✅ Registro en tabla `auditoria` con acción CREATE

---

### Test 13: Acceso sin Token (401)

```bash
curl -X GET "http://localhost:8080/api/v1/empleados" \
  -H "Content-Type: application/json"
```

**Resultado Esperado**:
- ✅ Status 401 Unauthorized
- ✅ Mensaje de error de autenticación

---

### Test 14: Acceso con Rol Insuficiente (403)

```bash
# Obtener token de colaborador
curl -X POST http://localhost:8081/realms/cooperativa-reducto/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=tthh-frontend" \
  -d "username=colaborador.test" \
  -d "password=colaborador123" \
  -d "grant_type=password"

# Intentar crear empleado con token de colaborador
curl -X POST "http://localhost:8080/api/v1/empleados" \
  -H "Authorization: Bearer <COLABORADOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**Resultado Esperado**:
- ✅ Status 403 Forbidden
- ✅ Mensaje de acceso denegado

---

## 🚦 TESTING DE RATE LIMITING

### Test 15: Exceder Límite de Requests

```bash
# Hacer 101 requests rápidos
for i in {1..101}; do
  echo "Request $i"
  curl -X GET "http://localhost:8080/api/v1/empleados" \
    -H "Authorization: Bearer <TOKEN>"
done
```

**Resultado Esperado**:
- ✅ Primeros 100 requests: Status 200 OK
- ✅ Request 101: Status 429 Too Many Requests
- ✅ Mensaje: "Too many requests. Please try again later."

---

## 📊 TESTING DE AUDITORÍA

### Test 16: Verificar Logs de Auditoría

```bash
# Listar todos los logs de auditoría
curl -X GET "http://localhost:8080/api/v1/auditoria?size=20&sort=createdAt,desc" \
  -H "Authorization: Bearer <TOKEN>"
```

**Resultado Esperado**:
- ✅ Lista de registros de auditoría
- ✅ Cada registro incluye:
  - usuario
  - accion (LOGIN, CREATE, UPDATE, etc.)
  - entidad
  - entidadId
  - detalles
  - ipAddress
  - userAgent
  - createdAt

---

### Test 17: Filtrar Auditoría por Usuario

```bash
curl -X GET "http://localhost:8080/api/v1/auditoria/usuario/admin.tthh?size=10" \
  -H "Authorization: Bearer <TOKEN>"
```

**Resultado Esperado**:
- ✅ Solo registros del usuario `admin.tthh`

---

### Test 18: Filtrar Auditoría por Entidad

```bash
curl -X GET "http://localhost:8080/api/v1/auditoria/entidad/EMPLEADO?size=10" \
  -H "Authorization: Bearer <TOKEN>"
```

**Resultado Esperado**:
- ✅ Solo registros relacionados con la entidad EMPLEADO

---

## 🗄️ TESTING DE BASE DE DATOS

### Test 19: Verificar Tablas en PostgreSQL

**Usando pgAdmin** (http://localhost:5050):

1. Login con `admin@coopreducto.com` / `admin`
2. Conectar al servidor PostgreSQL
3. Navegar a `tthh_db` → `Schemas` → `public` → `Tables`

**Resultado Esperado**:
- ✅ Tabla `empleados` existe
- ✅ Tabla `ausencias` existe
- ✅ Tabla `auditoria` existe

---

### Test 20: Verificar Datos en Auditoría

**SQL Query en pgAdmin**:

```sql
SELECT * FROM auditoria 
ORDER BY created_at DESC 
LIMIT 10;
```

**Resultado Esperado**:
- ✅ Registros de LOGIN
- ✅ Registros de CREATE (si se crearon empleados)
- ✅ IP addresses capturadas
- ✅ User agents capturados

---

## 🌐 TESTING DE FRONTEND

### Test 21: Responsive Design

**Pasos**:
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Probar diferentes tamaños:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Resultado Esperado**:
- ✅ Sidebar se colapsa en mobile
- ✅ Topbar se adapta
- ✅ Cards se reorganizan
- ✅ Texto legible en todos los tamaños

---

### Test 22: Navegación

**Pasos**:
1. Login exitoso
2. Click en cada opción del sidebar
3. Verificar que cada ruta carga correctamente

**Resultado Esperado**:
- ✅ Todas las rutas cargan sin errores
- ✅ Active state en sidebar correcto
- ✅ Breadcrumbs actualizados (si aplica)

---

### Test 23: Validación de Formularios

**Pasos**:
1. Ir a `/login`
2. Intentar submit sin llenar campos
3. Llenar solo usuario
4. Llenar solo contraseña

**Resultado Esperado**:
- ✅ Mensajes de validación claros
- ✅ Campos marcados en rojo
- ✅ Submit bloqueado hasta que sea válido

---

## 📝 CHECKLIST DE TESTING

### Autenticación
- [ ] Login exitoso
- [ ] Login fallido
- [ ] Logout
- [ ] Protección de rutas
- [ ] Refresh token

### Autorización
- [ ] Acceso con rol TTHH
- [ ] Acceso con rol GERENCIA
- [ ] Acceso con rol AUDITORIA
- [ ] Acceso con rol COLABORADOR
- [ ] Página 403 para acceso denegado

### API Backend
- [ ] Obtener token de Keycloak
- [ ] Listar empleados
- [ ] Crear empleado
- [ ] Actualizar empleado
- [ ] Eliminar empleado
- [ ] 401 sin token
- [ ] 403 con rol insuficiente

### Rate Limiting
- [ ] Límite de requests funciona
- [ ] Response 429 correcto

### Auditoría
- [ ] Logs de LOGIN/LOGOUT
- [ ] Logs de CREATE/UPDATE/DELETE
- [ ] Captura de IP
- [ ] Captura de User-Agent
- [ ] Filtros funcionan

### Base de Datos
- [ ] Tablas creadas correctamente
- [ ] Datos se persisten
- [ ] Relaciones funcionan

### Frontend
- [ ] Responsive design
- [ ] Navegación funciona
- [ ] Validación de formularios
- [ ] Estados de loading
- [ ] Manejo de errores

---

## 🐛 Troubleshooting

### Error: "CORS policy"

**Solución**: Verificar que `http://localhost:3000` esté en `allowed-origins` en `application.yml`

### Error: "Invalid token"

**Solución**: 
1. Verificar que Keycloak esté corriendo
2. Verificar `issuer-uri` en `application.yml`
3. Obtener nuevo token

### Error: "Connection refused"

**Solución**:
1. Verificar que todos los servicios estén corriendo
2. `docker-compose ps` para ver estado
3. Reiniciar servicios si es necesario

---

## ✅ Resultado Final

Si todos los tests pasan:
- ✅ Sistema de autenticación funcional
- ✅ Autorización por roles operativa
- ✅ Auditoría completa
- ✅ Rate limiting activo
- ✅ API REST funcional
- ✅ Frontend responsive

**Estado**: 🟢 LISTO PARA PRODUCCIÓN (Fases 0 y 1)

---

**Última actualización**: 2025-12-03
