# 🔐 GUÍA DE CONFIGURACIÓN DE KEYCLOAK

Esta guía te ayudará a configurar Keycloak para el Sistema de Gestión de Talento Humano.

## 📋 Prerrequisitos

- Docker y Docker Compose instalados
- Infraestructura levantada (`cd infra && docker-compose up -d`)
- Keycloak corriendo en http://localhost:8081

---

## 🚀 Configuración Paso a Paso

### 1. Acceder a Keycloak Admin Console

1. Abrir navegador en: **http://localhost:8081**
2. Click en "Administration Console"
3. Iniciar sesión:
   - **Usuario**: `admin`
   - **Contraseña**: `admin`

---

### 2. Crear Realm

1. En el dropdown superior izquierdo (donde dice "master"), click en **"Create Realm"**
2. Configurar:
   - **Realm name**: `cooperativa-reducto`
   - **Enabled**: ON
3. Click en **"Create"**

---

### 3. Crear Cliente (Frontend)

1. En el menú lateral, ir a **"Clients"**
2. Click en **"Create client"**

#### Step 1: General Settings
- **Client type**: `OpenID Connect`
- **Client ID**: `tthh-frontend`
3. Click **"Next"**

#### Step 2: Capability config
- **Client authentication**: OFF (public client)
- **Authorization**: OFF
- **Authentication flow**:
  - ✅ Standard flow
  - ✅ Direct access grants
  - ❌ Implicit flow
  - ❌ Service accounts roles
4. Click **"Next"**

#### Step 3: Login settings
- **Root URL**: `http://localhost:3000`
- **Home URL**: `http://localhost:3000`
- **Valid redirect URIs**: 
  - `http://localhost:3000/*`
- **Valid post logout redirect URIs**:
  - `http://localhost:3000/*`
- **Web origins**: 
  - `http://localhost:3000`
5. Click **"Save"**

---

### 4. Configurar Roles del Realm

1. En el menú lateral, ir a **"Realm roles"**
2. Click en **"Create role"**

Crear los siguientes roles (uno por uno):

#### Rol 1: TTHH
- **Role name**: `TTHH`
- **Description**: `Personal de Talento Humano - Acceso completo`
- Click **"Save"**

#### Rol 2: GERENCIA
- **Role name**: `GERENCIA`
- **Description**: `Gerencia - Visualización y aprobaciones`
- Click **"Save"**

#### Rol 3: AUDITORIA
- **Role name**: `AUDITORIA`
- **Description**: `Auditoría - Solo lectura y logs`
- Click **"Save"**

#### Rol 4: COLABORADOR
- **Role name**: `COLABORADOR`
- **Description**: `Empleado - Autogestión limitada`
- Click **"Save"**

---

### 5. Crear Usuarios de Prueba

#### Usuario 1: Admin TTHH

1. En el menú lateral, ir a **"Users"**
2. Click en **"Add user"**
3. Configurar:
   - **Username**: `admin.tthh`
   - **Email**: `admin.tthh@coopreducto.com`
   - **First name**: `Admin`
   - **Last name**: `TTHH`
   - **Email verified**: ON
   - **Enabled**: ON
4. Click **"Create"**

5. Ir a la pestaña **"Credentials"**:
   - Click **"Set password"**
   - **Password**: `admin123`
   - **Password confirmation**: `admin123`
   - **Temporary**: OFF
   - Click **"Save"**
   - Confirmar en el modal

6. Ir a la pestaña **"Role mappings"**:
   - Click **"Assign role"**
   - Filtrar por "Filter by realm roles"
   - Seleccionar **"TTHH"**
   - Click **"Assign"**

#### Usuario 2: Gerente

1. Repetir el proceso para crear usuario:
   - **Username**: `gerente.test`
   - **Email**: `gerente@coopreducto.com`
   - **First name**: `Gerente`
   - **Last name**: `Test`
   - **Password**: `gerente123`
   - **Rol**: `GERENCIA`

#### Usuario 3: Auditor

1. Repetir el proceso para crear usuario:
   - **Username**: `auditor.test`
   - **Email**: `auditor@coopreducto.com`
   - **First name**: `Auditor`
   - **Last name**: `Test`
   - **Password**: `auditor123`
   - **Rol**: `AUDITORIA`

#### Usuario 4: Colaborador

1. Repetir el proceso para crear usuario:
   - **Username**: `colaborador.test`
   - **Email**: `colaborador@coopreducto.com`
   - **First name**: `Colaborador`
   - **Last name**: `Test`
   - **Password**: `colaborador123`
   - **Rol**: `COLABORADOR`

---

### 6. Configurar Token Settings (Opcional pero Recomendado)

1. Ir a **"Realm settings"**
2. Ir a la pestaña **"Tokens"**
3. Configurar:
   - **Access Token Lifespan**: `30 Minutes` (o según necesidad)
   - **Refresh Token Max Reuse**: `0`
   - **SSO Session Idle**: `30 Minutes`
   - **SSO Session Max**: `10 Hours`
4. Click **"Save"**

---

### 7. Verificar Configuración

#### Verificar Endpoints

1. Ir a **"Realm settings"**
2. Click en **"OpenID Endpoint Configuration"** (al final de la página)
3. Deberías ver un JSON con los endpoints. Verificar:
   - `issuer`: `http://localhost:8081/realms/cooperativa-reducto`
   - `authorization_endpoint`
   - `token_endpoint`
   - `jwks_uri`

#### Probar Obtención de Token

```bash
curl -X POST http://localhost:8081/realms/cooperativa-reducto/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=tthh-frontend" \
  -d "username=admin.tthh" \
  -d "password=admin123" \
  -d "grant_type=password"
```

Deberías recibir un JSON con:
- `access_token`
- `refresh_token`
- `expires_in`
- `token_type`: `Bearer`

---

## ✅ Verificación Final

### Checklist de Configuración

- [ ] Realm `cooperativa-reducto` creado
- [ ] Cliente `tthh-frontend` configurado
- [ ] 4 roles creados (TTHH, GERENCIA, AUDITORIA, COLABORADOR)
- [ ] 4 usuarios de prueba creados con contraseñas
- [ ] Cada usuario tiene su rol asignado
- [ ] Prueba de obtención de token exitosa

---

## 🧪 Probar el Sistema

### 1. Iniciar Frontend

```bash
cd frontend-next
npm run dev
```

### 2. Acceder a la Aplicación

1. Abrir http://localhost:3000
2. Deberías ser redirigido a `/login`
3. Ingresar credenciales:
   - Usuario: `admin.tthh`
   - Contraseña: `admin123`
4. Deberías ser redirigido al dashboard

### 3. Verificar Roles

- Iniciar sesión con diferentes usuarios
- Verificar que cada uno tenga acceso según su rol
- Intentar acceder a secciones restringidas (debería mostrar 403)

---

## 🔧 Troubleshooting

### Error: "Invalid client credentials"

- Verificar que el Client ID sea exactamente `tthh-frontend`
- Verificar que Client authentication esté en OFF

### Error: "Invalid redirect URI"

- Verificar que `http://localhost:3000/*` esté en Valid Redirect URIs
- Verificar que no haya espacios en blanco

### Error: "User not found"

- Verificar que el usuario esté habilitado (Enabled: ON)
- Verificar que Email verified esté en ON
- Verificar que la contraseña no sea temporal

### Token no válido en Backend

- Verificar que el `issuer-uri` en `application.yml` sea correcto
- Verificar que Keycloak esté accesible desde el backend
- Verificar que el realm sea `cooperativa-reducto`

---

## 📚 Recursos Adicionales

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OAuth 2.0 Password Grant](https://oauth.net/2/grant-types/password/)
- [JWT Tokens](https://jwt.io/)

---

## 🎉 ¡Listo!

Tu Keycloak está configurado y listo para usar con el Sistema de Gestión de Talento Humano.

**Usuarios disponibles:**
- `admin.tthh` / `admin123` (TTHH)
- `gerente.test` / `gerente123` (GERENCIA)
- `auditor.test` / `auditor123` (AUDITORIA)
- `colaborador.test` / `colaborador123` (COLABORADOR)
