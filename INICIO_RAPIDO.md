# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a poner en marcha el Sistema de Gestión de Talento Humano en pocos minutos.

## ⚡ Inicio Rápido (Windows)

### Opción 1: Script Automático

```bash
# Ejecutar el script de inicio
start.bat
```

Este script iniciará automáticamente:
- PostgreSQL y Keycloak (Docker)
- Backend Java
- Frontend Next.js

### Opción 2: Manual

#### 1. Iniciar Infraestructura

```bash
cd infra
docker-compose up -d
```

#### 2. Iniciar Backend

```bash
cd backend-java
mvnw.cmd spring-boot:run
```

#### 3. Iniciar Frontend

```bash
cd frontend-next
npm install
npm run dev
```

## 🔧 Configuración Inicial de Keycloak

Después de iniciar la infraestructura, configura Keycloak:

### 1. Acceder a Keycloak

- URL: http://localhost:8081
- Usuario: `admin`
- Contraseña: `admin`

### 2. Crear Realm

1. Click en el dropdown del realm (arriba izquierda)
2. Click en "Create Realm"
3. Nombre: `cooperativa-reducto`
4. Click en "Create"

### 3. Crear Cliente

1. En el realm `cooperativa-reducto`, ir a "Clients"
2. Click en "Create client"
3. Configurar:
   - **Client ID**: `tthh-frontend`
   - **Client Protocol**: `openid-connect`
   - **Root URL**: `http://localhost:3000`
4. En la pestaña "Settings":
   - **Access Type**: `public`
   - **Valid Redirect URIs**: `http://localhost:3000/*`
   - **Web Origins**: `http://localhost:3000`
5. Guardar

### 4. Crear Roles

1. Ir a "Realm roles"
2. Crear los siguientes roles:
   - `TTHH`
   - `GERENCIA`
   - `AUDITORIA`
   - `COLABORADOR`

### 5. Crear Usuario de Prueba

1. Ir a "Users"
2. Click en "Add user"
3. Configurar:
   - **Username**: `admin.tthh`
   - **Email**: `admin@coopreducto.com`
   - **First Name**: `Admin`
   - **Last Name**: `TTHH`
4. Guardar
5. En la pestaña "Credentials":
   - Establecer contraseña: `admin123`
   - Desmarcar "Temporary"
6. En la pestaña "Role Mappings":
   - Asignar rol `TTHH`

## 📍 URLs del Sistema

Una vez todo esté corriendo:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:3000 | admin.tthh / admin123 |
| **Backend API** | http://localhost:8080/api/v1 | - |
| **Keycloak** | http://localhost:8081 | admin / admin |
| **pgAdmin** | http://localhost:5050 | admin@coopreducto.com / admin |

## 🧪 Probar el Sistema

### 1. Acceder al Frontend

1. Abrir http://localhost:3000
2. Serás redirigido a `/login`
3. Ingresar credenciales: `admin.tthh` / `admin123`
4. Deberías ver el dashboard

### 2. Probar la API

```bash
# Obtener token de Keycloak (reemplazar con tus credenciales)
curl -X POST http://localhost:8081/realms/cooperativa-reducto/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=tthh-frontend" \
  -d "username=admin.tthh" \
  -d "password=admin123" \
  -d "grant_type=password"

# Usar el token para llamar a la API
curl -X GET http://localhost:8080/api/v1/empleados \
  -H "Authorization: Bearer <tu-token-aqui>"
```

## 🐛 Solución de Problemas

### Puerto ya en uso

Si algún puerto está ocupado:

```bash
# Windows - Ver qué proceso usa el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Matar proceso por PID
taskkill /PID <PID> /F
```

### Docker no inicia

```bash
# Verificar Docker
docker --version

# Reiniciar Docker Desktop
# O desde servicios de Windows
```

### Backend no compila

```bash
# Limpiar y recompilar
cd backend-java
mvnw.cmd clean install
```

### Frontend no inicia

```bash
# Limpiar node_modules y reinstalar
cd frontend-next
rmdir /s /q node_modules
rmdir /s /q .next
npm install
npm run dev
```

## 📚 Siguientes Pasos

1. ✅ Configurar Keycloak (completado arriba)
2. 📖 Leer `FASE_0_COMPLETADA.md` para ver qué está implementado
3. 🔍 Explorar el código en `frontend-next/` y `backend-java/`
4. 🚀 Comenzar a desarrollar las siguientes fases

## 💡 Tips

- **Hot Reload**: Tanto frontend como backend tienen hot reload activado
- **Logs**: Revisa las consolas para ver errores
- **Base de Datos**: Usa pgAdmin para ver las tablas creadas
- **API Docs**: Los endpoints están documentados en `backend-java/README.md`

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs de cada servicio
2. Verifica que todos los puertos estén libres
3. Asegúrate de tener las versiones correctas:
   - Node.js 18+
   - Java 21
   - Docker Desktop corriendo

---

**¡Listo para desarrollar! 🎉**
