# Backend Java - Spring Boot 3

Backend de gestión de talento humano desarrollado con Spring Boot 3 y Java 21.

## 🚀 Tecnologías

- **Java**: 21
- **Framework**: Spring Boot 3.2.0
- **Seguridad**: Spring Security + OAuth2 Resource Server
- **Base de Datos**: PostgreSQL 15
- **ORM**: Spring Data JPA + Hibernate
- **Build Tool**: Maven
- **Autenticación**: Keycloak (JWT)

## 📦 Dependencias Principales

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter OAuth2 Resource Server
- PostgreSQL Driver
- Lombok
- MapStruct
- AWS SDK S3

## 🔧 Configuración

### Variables de Entorno

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/tthh_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Keycloak
SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=http://localhost:8081/realms/cooperativa-reducto

# AWS S3
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
AWS_S3_BUCKET_NAME=cooperativa-reducto-tthh
AWS_S3_REGION=us-east-1
```

## 🏗️ Estructura del Proyecto

```
backend-java/
├── src/main/java/com/coopreducto/tthh/
│   ├── config/           # Configuraciones (Security, AWS, etc.)
│   ├── controller/       # REST Controllers
│   ├── service/          # Interfaces de servicios
│   │   └── impl/         # Implementaciones de servicios
│   ├── repository/       # Spring Data JPA Repositories
│   ├── entity/           # Entidades JPA
│   ├── dto/              # Data Transfer Objects
│   └── audit/            # Servicios de auditoría
└── src/main/resources/
    └── application.yml   # Configuración de Spring Boot
```

## 🚀 Ejecución

### Prerrequisitos

1. Java 21 instalado
2. Maven instalado
3. PostgreSQL corriendo (via Docker Compose en `/infra`)
4. Keycloak configurado

### Compilar el proyecto

```bash
./mvnw clean install
```

### Ejecutar en desarrollo

```bash
./mvnw spring-boot:run
```

### Ejecutar con perfil específico

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 📡 API Endpoints

### Empleados

- `GET /api/v1/empleados` - Listar empleados (paginado)
- `GET /api/v1/empleados/{id}` - Obtener empleado por ID
- `GET /api/v1/empleados/documento/{numeroDocumento}` - Buscar por documento
- `POST /api/v1/empleados` - Crear empleado
- `PUT /api/v1/empleados/{id}` - Actualizar empleado
- `DELETE /api/v1/empleados/{id}` - Eliminar empleado

### Ausencias

- `GET /api/v1/ausencias` - Listar ausencias (paginado)
- `GET /api/v1/ausencias/{id}` - Obtener ausencia por ID
- `GET /api/v1/ausencias/empleado/{empleadoId}` - Ausencias por empleado
- `POST /api/v1/ausencias` - Crear solicitud de ausencia
- `PUT /api/v1/ausencias/{id}` - Actualizar ausencia
- `PATCH /api/v1/ausencias/{id}/aprobar` - Aprobar ausencia
- `PATCH /api/v1/ausencias/{id}/rechazar` - Rechazar ausencia
- `DELETE /api/v1/ausencias/{id}` - Eliminar ausencia

## 🔐 Seguridad

### Roles del Sistema

- **ROLE_TTHH**: Acceso completo a todas las funcionalidades
- **ROLE_GERENCIA**: Visualización y aprobaciones
- **ROLE_AUDITORIA**: Solo lectura
- **ROLE_COLABORADOR**: Autogestión limitada

### Autenticación

El sistema utiliza JWT tokens emitidos por Keycloak. Cada request debe incluir el header:

```
Authorization: Bearer <jwt-token>
```

## 📊 Base de Datos

### Entidades Principales

- **Empleado**: Información del empleado
- **Ausencia**: Solicitudes de permisos/vacaciones
- **Auditoria**: Registro de todas las acciones críticas

### Migraciones

El sistema usa Hibernate con `ddl-auto: update` para desarrollo.
Para producción, se recomienda usar Flyway o Liquibase.

## 🧪 Testing

```bash
./mvnw test
```

## 📝 Auditoría

Todas las operaciones críticas se registran automáticamente en la tabla `auditoria` con:
- Usuario que realizó la acción
- Tipo de acción (CREATE, UPDATE, DELETE, READ)
- Entidad afectada
- Timestamp
- IP y User Agent

## 🐳 Docker

Para crear una imagen Docker:

```bash
./mvnw spring-boot:build-image
```

## 📄 Licencia

Propiedad de Cooperativa Reducto - Todos los derechos reservados
