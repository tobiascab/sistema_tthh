# 🚀 Manual de Despliegue y Ejecución - SISTEMA TTHH V2

Este documento detalla los pasos para levantar el sistema completo (Frontend + Backend + Base de Datos).

## 📋 Requisitos Previos

1.  **Node.js** (v18 o superior)
2.  **Java JDK** (v21)
3.  **Maven** (v3.8 o superior)
4.  **PostgreSQL** (v14 o superior)
5.  **Docker** (Opcional, para Keycloak)

---

## 1️⃣ Base de Datos (PostgreSQL)

Asegúrate de que el servicio de PostgreSQL esté corriendo y crea la base de datos:

```sql
CREATE DATABASE sistema_tthh_v2;
```

El usuario y contraseña por defecto configurados en el backend son:
- **Usuario**: `postgres`
- **Contraseña**: `postgres` (o la que tengas configurada localmente)

Si necesitas cambiar esto, edita: `backend-java/src/main/resources/application.properties`.

---

## 2️⃣ Backend (Spring Boot)

El backend maneja la lógica de negocio y la conexión a la base de datos.

1.  Abre una terminal en la carpeta `backend-java`.
2.  Ejecuta el siguiente comando para iniciar el servidor:

```bash
mvn spring-boot:run
```

*Si no tienes Maven instalado globalmente pero tienes el wrapper (`mvnw`), usa `./mvnw spring-boot:run`.*

El servidor iniciará en: `http://localhost:8080`.

### Endpoints Principales:
- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html` (Documentación API)

---

## 3️⃣ Frontend (Next.js)

El frontend es la interfaz de usuario.

1.  Abre una terminal en la carpeta `frontend-next`.
2.  Instala las dependencias (si no lo has hecho):

```bash
npm install
```

3.  Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend iniciará en: `http://localhost:3000`.

---

## 4️⃣ Autenticación (Keycloak)

Para producción, el sistema usa Keycloak. Para desarrollo, puedes usar el modo "Dev" del frontend que simula la autenticación.

### Modo Desarrollo (Sin Keycloak)
Asegúrate de que en `frontend-next/.env.local` tengas:
```env
NEXT_PUBLIC_DEV_MODE=true
```
Esto te permitirá loguearte con cualquier usuario (ej: `admin` / `admin`) sin necesitar Keycloak corriendo.

### Modo Producción (Con Keycloak)
1.  Levanta Keycloak con Docker (ver `COMO_LEVANTAR_KEYCLOAK.md`).
2.  Cambia `NEXT_PUBLIC_DEV_MODE=false` en `.env.local`.

---

## ✅ Verificación

1.  Entra a `http://localhost:3000`.
2.  Deberías ver la pantalla de Login.
3.  Ingresa credenciales (si estás en modo dev: `admin` / `admin`).
4.  Deberías acceder al Dashboard.
5.  Navega a "Empleados" para verificar que carga la lista (requiere Backend corriendo).

---

## 🛠️ Solución de Problemas Comunes

- **Error de conexión al Backend**: Verifica que el backend esté corriendo en el puerto 8080 y que no haya errores de conexión a la base de datos en la consola de Java.
- **Error de CORS**: El backend está configurado para aceptar peticiones desde `http://localhost:3000`. Si cambias el puerto del frontend, actualiza la configuración CORS en el backend.
- **Errores de compilación Frontend**: Ejecuta `npm run lint` para ver detalles.

---

**¡Sistema Listo!** 🚀
