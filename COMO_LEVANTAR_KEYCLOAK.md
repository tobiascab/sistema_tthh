# 🚀 GUÍA RÁPIDA: Levantar Keycloak

## Problema Actual
Keycloak no está corriendo en http://localhost:8081, por lo que el login no funciona.

## Opción 1: Levantar Keycloak con Docker (RECOMENDADO)

### Paso 1: Verificar Docker
```powershell
docker --version
```

Si Docker no está instalado:
- Descargar Docker Desktop: https://www.docker.com/products/docker-desktop/

### Paso 2: Levantar la infraestructura
```powershell
cd c:\SISTEMA_TTHH_V2\infra
docker compose up -d
```

### Paso 3: Verificar que Keycloak esté corriendo
```powershell
docker compose ps
```

Deberías ver:
- `tthh-keycloak` - corriendo en puerto 8081
- `tthh-postgres` - corriendo en puerto 5432

### Paso 4: Acceder a Keycloak
1. Abrir navegador: http://localhost:8081
2. Click en "Administration Console"
3. Login: `admin` / `admin`
4. Seguir la guía en `KEYCLOAK_SETUP.md` para configurar

---

## Opción 2: Modo Desarrollo (SIN Keycloak)

Si no puedes instalar Docker ahora, puedes usar el modo desarrollo:

### Paso 1: Activar modo desarrollo
Crear archivo `c:\SISTEMA_TTHH_V2\frontend-next\.env.local`:
```env
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8081
NEXT_PUBLIC_KEYCLOAK_REALM=cooperativa-reducto
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=tthh-frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEV_MODE=true
```

### Paso 2: El sistema usará autenticación mock
- Usuario: cualquier username
- Contraseña: cualquier password
- Roles: se asignarán automáticamente según el username

---

## Opción 3: Keycloak Standalone (Sin Docker)

### Descargar Keycloak
1. Ir a: https://www.keycloak.org/downloads
2. Descargar Keycloak 23.0.0 (ZIP)
3. Extraer en `C:\keycloak`

### Ejecutar Keycloak
```powershell
cd C:\keycloak\bin
.\kc.bat start-dev --http-port=8081
```

### Configurar
Seguir `KEYCLOAK_SETUP.md` para crear realm, cliente y usuarios.

---

## Verificación

### Keycloak está corriendo cuando:
✅ http://localhost:8081 muestra la página de Keycloak
✅ http://localhost:8081/realms/cooperativa-reducto/.well-known/openid-configuration devuelve JSON

### Si sigue sin funcionar:
1. Verificar firewall de Windows
2. Verificar que el puerto 8081 no esté ocupado: `netstat -ano | findstr :8081`
3. Ver logs de Keycloak para errores

---

## Próximos Pasos

Una vez Keycloak esté corriendo:
1. Configurar realm según `KEYCLOAK_SETUP.md`
2. Crear usuarios de prueba
3. Intentar login nuevamente en http://localhost:3000/login
