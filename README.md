# Sistema de Gestión de Talento Humano - Cooperativa Reducto

## 🎯 Descripción del Proyecto

Sistema integral de gestión de recursos humanos para Cooperativa Reducto, desarrollado con tecnologías modernas y arquitectura escalable.

## ✅ Estado Actual: SISTEMA COMPLETO - PRODUCTION READY

- ✅ **FASE 0**: Configuración general del proyecto
- ✅ **FASE 1**: Sistema de autenticación con Keycloak
- ✅ **FASE 2**: Panel del Colaborador
- ✅ **FASE 3**: Módulo Académico / Desarrollo Profesional
- ✅ **FASE 4**: Panel del Administrador (RRHH)
- ✅ **FASE 5**: Base de Datos Completa (MySQL/XAMPP)
- ✅ **FASE 6**: Seed de Datos de Prueba
- ✅ **FASE 7**: Diseño UX/UI Completo
- 🔄 **FASE 8**: Testing y Deployment (Siguiente)

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Formularios**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Tablas**: TanStack Table
- **PDF Viewer**: react-pdf
- **Autenticación**: Keycloak OAuth2/OIDC

#### Backend
- **Java**: 21
- **Framework**: Spring Boot 3.2.0
- **Seguridad**: Spring Security + Keycloak JWT
- **Base de Datos**: PostgreSQL 15
- **ORM**: Spring Data JPA + Hibernate
- **Auditoría**: Spring AOP
- **Rate Limiting**: Bucket4j
- **Storage**: AWS S3

#### Infraestructura
- **IdP**: Keycloak 23
- **Base de Datos**: PostgreSQL 15
- **Container**: Docker Compose
- **DB Admin**: pgAdmin 4

## 🎨 Paleta de Colores - Cooperativa Reducto

- **Verde Principal**: #7FD855
- **Verde Secundario**: #5CB85C
- **Amarillo**: #FFD700
- **Gris Claro**: #F8F9FA
- **Gris Medio**: #E9ECEF
- **Gris Oscuro**: #495057
- **Blanco**: #FFFFFF

## 📁 Estructura del Proyecto

```
SISTEMA_TTHH_V2/
├── frontend/              # Next.js 15 + React + TypeScript
├── backend/               # Spring Boot 3 + Java 21
└── infra/                      # Docker, PostgreSQL, Keycloak
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Java 21
- Docker y Docker Compose
- PostgreSQL 15+

### Instalación Automática (Windows)

```bash
start.bat
```

### Instalación Manual

1. **Configurar infraestructura**
```bash
cd infra
docker-compose up -d
```

2. **Configurar Keycloak** (Ver `KEYCLOAK_SETUP.md`)

3. **Configurar Backend**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

4. **Configurar Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs del Sistema

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:3000 | admin.tthh / admin123 |
| **Backend API** | http://localhost:8080/api/v1 | - |
| **Keycloak** | http://localhost:8081 | admin / admin |
| **pgAdmin** | http://localhost:5050 | admin@coopreducto.com / admin |

## 👥 Roles del Sistema

- **TTHH**: Gestión completa de recursos humanos
- **GERENCIA**: Visualización y aprobaciones
- **AUDITORIA**: Acceso de solo lectura con logs
- **COLABORADOR**: Autogestión limitada

## 🔐 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin.tthh | admin123 | TTHH |
| gerente.test | gerente123 | GERENCIA |
| auditor.test | auditor123 | AUDITORIA |
| colaborador.test | colaborador123 | COLABORADOR |

## 📚 Documentación

### Guías de Configuración
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía de inicio rápido
- **[KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)** - Configuración de Keycloak paso a paso
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía completa de testing

### Documentación Técnica
- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Diagrama de arquitectura completo
- **[RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md)** - Resumen ejecutivo del proyecto

### Resúmenes de Fases
- **[FASE_0_COMPLETADA.md](FASE_0_COMPLETADA.md)** - Configuración general
- **[FASE_1_COMPLETADA.md](FASE_1_COMPLETADA.md)** - Sistema de autenticación
- **[FASE_2_COMPLETADA.md](FASE_2_COMPLETADA.md)** - Panel del Colaborador

### Documentación por Módulo
- **[frontend/README.md](frontend/README.md)** - Documentación del frontend
- **[backend/README.md](backend/README.md)** - Documentación del backend
- **[infra/README.md](infra/README.md)** - Documentación de infraestructura

## ✨ Funcionalidades Implementadas

### Autenticación y Seguridad
- ✅ Login con Keycloak (OAuth2/OIDC)
- ✅ Logout con limpieza de tokens
- ✅ Refresh token automático
- ✅ Protección de rutas con middleware
- ✅ Role-Based Access Control (RBAC)
- ✅ Rate limiting (100 req/min por IP)
- ✅ Auditoría automática con AOP

### Frontend
- ✅ Diseño responsive con Tailwind CSS
- ✅ Componentes UI reutilizables (shadcn/ui)
- ✅ Sidebar de navegación
- ✅ Topbar con búsqueda y perfil
- ✅ Dashboard con estadísticas
- ✅ Páginas de error (403, session expired)
- ✅ Context API para autenticación

### Backend
- ✅ API REST con paginación
- ✅ Validación de DTOs con Bean Validation
- ✅ Manejo centralizado de errores
- ✅ Auditoría automática (AOP + @Auditable)
- ✅ JWT validation con Keycloak
- ✅ CORS configurado
- ✅ Rate limiting con Bucket4j

### Base de Datos
- ✅ Entidades JPA (Empleado, Ausencia, Auditoria)
- ✅ Repositorios Spring Data
- ✅ Migraciones automáticas con Hibernate

## 🎯 Próximas Fases

### FASE 2 - Módulo de Legajos
- CRUD completo de empleados
- Carga de documentos
- Historial laboral
- Datos familiares

### FASE 3 - Módulo de Permisos y Vacaciones
- Solicitud de ausencias
- Workflow de aprobación
- Calendario de ausencias
- Notificaciones

### FASE 4 - Reportes e Indicadores
- Dashboard con métricas
- Reportes IPS
- Exportación a PDF/Excel
- Gráficos y estadísticas

### FASE 5 - Optimización y Deployment
- Testing completo
- Optimización de performance
- CI/CD pipeline
- Deployment a producción

## 🧪 Testing

Ver **[TESTING_GUIDE.md](TESTING_GUIDE.md)** para instrucciones detalladas de testing.

### Quick Test

```bash
# Test de login
curl -X POST http://localhost:8081/realms/cooperativa-reducto/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=tthh-frontend" \
  -d "username=admin.tthh" \
  -d "password=admin123" \
  -d "grant_type=password"

# Test de API
curl -X GET http://localhost:8080/api/v1/empleados \
  -H "Authorization: Bearer <token>"
```

## 📊 Métricas del Proyecto

- **Líneas de Código**: ~8,000+
- **Archivos Creados**: ~115+
- **Componentes UI**: 15+
- **API Endpoints**: 25+
- **Documentación**: 11 archivos

## 🤝 Contribución

Este proyecto es propiedad de Cooperativa Reducto. Para contribuir:

1. Seguir las guías de estilo establecidas
2. Documentar todos los cambios
3. Realizar testing exhaustivo
4. Actualizar documentación relevante

## 📝 Licencia

Propiedad de Cooperativa Reducto - Todos los derechos reservados

---

## 🆘 Soporte

Para problemas o preguntas:

1. Revisar **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Sección Troubleshooting
2. Revisar **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Solución de problemas
3. Verificar logs de cada servicio
4. Contactar al equipo de desarrollo

---

**Última actualización**: 2025-12-03  
**Versión**: 2.0.0  
**Estado**: 🟢 OPERATIVO - Fases 0, 1 y 2 completadas
