# 📋 PLAN DE IMPLEMENTACIÓN - SISTEMA TTHH
## Sistema de Gestión de Talento Humano - Cooperativa Reducto

---

## 🎯 ESTADO ACTUAL

### ✅ Completado
- [x] Configuración inicial del proyecto (Backend + Frontend)
- [x] Base de datos MySQL con XAMPP
- [x] Autenticación básica (modo desarrollo)
- [x] Dashboard inicial con KPIs básicos
- [x] Módulo de Empleados (parcial):
  - CRUD básico
  - Campos: numeroSocio, sucursal
  - Tabla con columnas personalizadas

### 🚧 En Progreso
- [ ] Dashboard completo con gráficos
- [ ] Empleados con todas las funcionalidades

---

## 📦 MÓDULOS DEL SISTEMA

## **MÓDULO 1: DASHBOARD (PRIORIDAD ALTA)**

### 🎯 Objetivo
Panel de control con métricas clave, gráficos y alertas en tiempo real.

### 📊 Funcionalidades

#### 1.1 KPIs Principales
- [x] Total de colaboradores activos/inactivos
- [ ] Planilla mensual estimada vs pagada
- [ ] Solicitudes pendientes de aprobación
- [ ] Certificaciones por vencer (30 días)
- [ ] Horas de formación del mes/año
- [ ] Tasa de ausentismo del mes

#### 1.2 Gráficos y Visualizaciones
- [ ] Distribución de empleados por:
  - Departamento (gráfico de barras)
  - Cargo (gráfico circular)
  - Sucursal (gráfico de barras horizontales)
  - Género (gráfico de dona)
  - Rango de edad (gráfico de área)
- [ ] Tendencias mensuales (últimos 6 meses):
  - Evolución de nómina
  - Ausencias por mes
  - Capacitaciones realizadas
  - Nuevos ingresos vs bajas

#### 1.3 Alertas Inteligentes
- [ ] Certificaciones próximas a vencer
- [ ] Solicitudes pendientes > 48 horas
- [ ] Documentos faltantes en legajos
- [ ] Permisos sin retroalimentación
- [ ] Cumpleaños del mes
- [ ] Aniversarios laborales

#### 1.4 Accesos Rápidos
- [ ] Cards con acciones directas:
  - Crear nuevo empleado
  - Aprobar solicitudes pendientes
  - Generar recibo de salario
  - Registrar ausencia
  - Cargar documento a legajo

### 🔧 Tareas Técnicas

#### Backend
- [ ] Implementar queries optimizadas para KPIs
- [ ] Crear DTOs para gráficos (con agrupaciones)
- [ ] Endpoint `/dashboard/kpis`
- [ ] Endpoint `/dashboard/charts`
- [ ] Endpoint `/dashboard/alerts`
- [ ] Cacheo de datos (Redis o Spring Cache)

#### Frontend
- [ ] Componentes de gráficos con Recharts
- [ ] Cards de KPIs con animaciones
- [ ] Panel de alertas con notificaciones
- [ ] Responsive design para tablets/móviles
- [ ] Auto-refresh cada 5 minutos

---

## **MÓDULO 2: GESTIÓN DE EMPLEADOS (PRIORIDAD ALTA)**

### 🎯 Objetivo
CRUD completo de empleados con toda su información personal, laboral y contractual.

### 📊 Funcionalidades

#### 2.1 Listado de Empleados
- [x] Tabla con paginación
- [x] Columnas: N° Socio, Nombre, Cargo, Sucursal, Estado
- [ ] Búsqueda avanzada:
  - Por nombre/apellido
  - Por número de socio
  - Por sucursal
  - Por departamento
  - Por estado
- [ ] Filtros múltiples
- [ ] Exportar a Excel/PDF
- [ ] Ordenamiento por columnas

#### 2.2 Ficha de Empleado (Vista Completa)
- [ ] Tabs de información:
  - **Datos Personales**: Documento, nombres, fecha nacimiento, género, estado civil, dirección, teléfono
  - **Datos Laborales**: Sucursal, departamento, cargo, fecha ingreso, tipo contrato, salario
  - **Documentos**: Legajo digital con archivos adjuntos
  - **Capacitaciones**: Cursos realizados y certificaciones
  - **Evaluaciones de Desempeño**: Historial de evaluaciones
  - **Historial Laboral**: Movimientos, promociones, cambios
  - **Ausencias**: Permisos, vacaciones, licencias

#### 2.3 Creación/Edición de Empleado
- [x] Formulario con validaciones
- [x] Campos básicos implementados
- [ ] Campos adicionales:
  - Foto de perfil (upload)
  - Contacto de emergencia
  - Nivel educativo
  - Profesión/título
  - Tipo de sangre
  - Alergias/condiciones médicas
  - Banco para depósito
  - Número de cuenta
  - AFP/IPS
- [ ] Validaciones avanzadas:
  - Edad mínima (18 años)
  - Fecha de ingreso no futura
  - Email único
  - Número de socio único
  - CI/RUC válido

#### 2.4 Gestión de Estados
- [ ] Cambiar estado empleado:
  - ACTIVO → INACTIVO (con motivo)
  - ACTIVO → SUSPENDIDO (con fecha inicio/fin)
  - INACTIVO → ACTIVO (reingreso)
- [ ] Historial de cambios de estado
- [ ] Notificaciones automáticas

#### 2.5 Reportes de Empleados
- [ ] Lista de empleados activos
- [ ] Lista por sucursal
- [ ] Lista por departamento
- [ ] Empleados por vencer contrato
- [ ] Empleados sin documentos completos

### 🔧 Tareas Técnicas

#### Backend
- [ ] Completar entidad `Empleado` con todos los campos
- [ ] Repository con queries personalizadas
- [ ] Service con lógica de negocio
- [ ] Endpoints CRUD completos
- [ ] Endpoint de búsqueda avanzada
- [ ] Endpoint de cambio de estado
- [ ] Validaciones con Bean Validation
- [ ] Manejo de archivos (foto de perfil)

#### Frontend
- [ ] Componente `EmpleadosList` mejorado
- [ ] Componente `EmpleadoDetail` (con tabs)
- [ ] Componente `EmpleadoForm` completo
- [ ] Componente `SearchBar` avanzado
- [ ] Modal de confirmación para acciones
- [ ] Upload de imagen con preview
- [ ] Formulario multi-step (wizard)

---

## **MÓDULO 3: LEGAJOS DIGITALES (PRIORIDAD ALTA)**

### 🎯 Objetivo
Gestión documental digital de cada empleado con categorización y versionado.

### 📊 Funcionalidades

#### 3.1 Gestión de Documentos
- [ ] Categorías de documentos:
  - **Contractuales**: Contrato, addendas, finiquito
  - **Personales**: CI, CV, certificado de nacimiento
  - **Educativos**: Títulos, diplomas, certificados
  - **Médicos**: Certificados médicos, exámenes
  - **Otros**: Declaraciones juradas, referencias
- [ ] Upload múltiple de archivos
- [ ] Tipos permitidos: PDF, Word, Excel, Imágenes
- [ ] Tamaño máximo: 10MB por archivo
- [ ] Versiones de documentos (histórico)
- [ ] Fechas de vencimiento (ej: certificado médico)
- [ ] Estado: Pendiente, Aprobado, Rechazado, Vencido

#### 3.2 Visualización
- [ ] Árbol de carpetas por categoría
- [ ] Vista de lista con filtros
- [ ] Previsualizador de PDF/imágenes
- [ ] Descarga individual o masiva (ZIP)
- [ ] Registro de quién subió y cuándo

#### 3.3 Alertas
- [ ] Documentos faltantes obligatorios
- [ ] Documentos próximos a vencer
- [ ] Documentos vencidos

#### 3.4 Reportes
- [ ] Empleados con legajo incompleto
- [ ] Documentos vencidos por sucursal
- [ ] Checklist de onboarding

### 🔧 Tareas Técnicas

#### Backend
- [ ] Entidad `Documento` (FK a Empleado)
- [ ] Entidad `CategoriaDocumento`
- [ ] Servicio de upload a AWS S3 o filesystem
- [ ] Endpoint `/documentos/upload`
- [ ] Endpoint `/documentos/{id}/download`
- [ ] Endpoint `/documentos/empleado/{empleadoId}`
- [ ] Versionado automático
- [ ] Validación de tipos MIME

#### Frontend
- [ ] Componente `LegajoDigital`
- [ ] Componente `DocumentUploader` (drag & drop)
- [ ] Componente `DocumentViewer` (PDF.js)
- [ ] Árbol de navegación reactivo
- [ ] Progress bar para uploads
- [ ] Gestión de errores

---

## **MÓDULO 4: SOLICITUDES Y PERMISOS (PRIORIDAD MEDIA)**

### 🎯 Objetivo
Workflow digital para solicitudes de ausencias, permisos, vacaciones con aprobación multi-nivel.

### 📊 Funcionalidades

#### 4.1 Tipos de Solicitudes
- [ ] **Vacaciones**:
  - Fecha inicio/fin
  - Días solicitados
  - Días disponibles (cálculo automático)
  - Observaciones
- [ ] **Permiso Personal**:
  - Con/sin goce de sueldo
  - Horas/días solicitados
  - Motivo
- [ ] **Licencia Médica**:
  - Adjuntar certificado médico
  - Fecha inicio/fin
  - Diagnóstico (opcional)
- [ ] **Permiso por Estudio**:
  - Adjuntar constancia
  - Horario requerido
- [ ] **Otros Permisos**:
  - Maternidad/Paternidad
  - Duelo
  - Matrimonio

#### 4.2 Flujo de Aprobación
- [ ] Estados:
  - PENDIENTE → Recién creada
  - EN_REVISION → Jefe inmediato revisando
  - APROBADA_JEFE → Jefe aprobó, pasa a RRHH
  - APROBADA → RRHH aprobó (final)
  - RECHAZADA → Con comentario de rechazo
  - CANCELADA → Empleado canceló
- [ ] Notificaciones automáticas por email/sistema
- [ ] Histórico de cambios de estado
- [ ] Comentarios en cada etapa

#### 4.3 Calendario de Ausencias
- [ ] Vista de calendario grupal (por equipo)
- [ ] Colores según tipo de ausencia
- [ ] Alertas de solapamientos (múltiples ausencias)
- [ ] Exportar calendario a iCal

#### 4.4 Reportes
- [ ] Ausencias por empleado
- [ ] Ausencias por departamento/mes
- [ ] Vacaciones pendientes de uso
- [ ] Historial de solicitudes

### 🔧 Tareas Técnicas

#### Backend
- [ ] Entidad `Solicitud` con tipos enumerados
- [ ] Entidad `AprobacionSolicitud` (auditoría)
- [ ] Service con lógica de workflow
- [ ] Endpoint `/solicitudes` CRUD
- [ ] Endpoint `/solicitudes/{id}/aprobar`
- [ ] Endpoint `/solicitudes/{id}/rechazar`
- [ ] Endpoint `/solicitudes/empleado/{id}`
- [ ] Cálculo de días de vacaciones
- [ ] Validación de solapamientos

#### Frontend
- [ ] Componente `SolicitudForm`
- [ ] Componente `SolicitudesList` con filtros
- [ ] Componente `SolicitudDetail` (timeline de aprobaciones)
- [ ] Componente `CalendarioAusencias`
- [ ] Botones de aprobación/rechazo
- [ ] Notificaciones real-time (WebSockets opcional)

---

## **MÓDULO 5: RECIBOS DE SALARIO (PRIORIDAD MEDIA)**

### 🎯 Objetivo
Generación, gestión y descarga de recibos de salario con cálculo automático de deducciones.

### 📊 Funcionalidades

#### 5.1 Generación de Planilla
- [ ] Seleccionar mes/año
- [ ] Carga masiva de conceptos (Excel/CSV)
- [ ] Cálculo automático:
  - Salario base
  - Bonificaciones
  - Horas extras
  - Deducciones IPS/AFP
  - Descuentos varios
  - Salario neto
- [ ] Previsualización antes de confirmar
- [ ] Generación masiva de recibos (PDF)

#### 5.2 Conceptos de Pago
- [ ] CRUD de conceptos:
  - Nombre
  - Tipo: INGRESO / DEDUCCION
  - Fórmula de cálculo
  - Afecto a IPS/AFP
- [ ] Conceptos predefinidos del sistema
- [ ] Conceptos personalizados

#### 5.3 Gestión de Recibos
- [ ] Listado de recibos por mes/año
- [ ] Estados: BORRADOR, CONFIRMADO, ENVIADO, DESCARGADO
- [ ] Envío masivo por email
- [ ] Descarga individual (PDF)
- [ ] Descarga masiva (ZIP)
- [ ] Reenvío de recibo

#### 5.4 Portal del Empleado
- [ ] Vista de recibos propios
- [ ] Descarga de recibos históricos
- [ ] Certificados de ingresos

#### 5.5 Reportes
- [ ] Planilla mensual consolidada
- [ ] Libro de sueldos
- [ ] Declaración jurada IPS
- [ ] Resumen por departamento

### 🔧 Tareas Técnicas

#### Backend
- [ ] Entidad `ReciboSalario` (ya existe, mejorar)
- [ ] Entidad `ConceptoPago`
- [ ] Entidad `DetalleRecibo`
- [ ] Service de cálculo de planilla
- [ ] Generación de PDF (iText/JasperReports)
- [ ] Endpoint `/recibos/generar/{mes}/{anio}`
- [ ] Endpoint `/recibos/{id}/pdf`
- [ ] Endpoint `/recibos/enviar-email`
- [ ] Servicio de email (SMTP)

#### Frontend
- [ ] Componente `GenerarPlanilla`
- [ ] Componente `RecibosList`
- [ ] Componente `ReciboViewer` (PDF)
- [ ] Configuración de conceptos
- [ ] Modal de confirmación masiva
- [ ] Progress bar para generación

---

## **MÓDULO 6: CAPACITACIONES Y DESARROLLO (PRIORIDAD BAJA)**

### 🎯 Objetivo
Gestión de cursos, talleres, certificaciones y matriz de habilidades.

### 📊 Funcionalidades

#### 6.1 Gestión de Cursos
- [ ] CRUD de cursos:
  - Nombre
  - Descripción
  - Fecha inicio/fin
  - Instructor (interno/externo)
  - Modalidad: Presencial/Virtual/Híbrido
  - Costo
  - Cupos disponibles
  - Certificación al finalizar
- [ ] Estados: PLANIFICADO, EN_CURSO, FINALIZADO, CANCELADO

#### 6.2 Inscripciones
- [ ] Inscripción de empleados a cursos
- [ ] Validación de pre-requisitos
- [ ] Lista de espera
- [ ] Registro de asistencia
- [ ] Evaluaciones post-capacitación
- [ ] Emisión de certificados

#### 6.3 Certificaciones Profesionales
- [ ] CRUD de certificaciones:
  - Nombre
  - Entidad emisora
  - Número de certificado
  - Fecha obtención
  - Fecha vencimiento
  - Adjuntar documento
- [ ] Alertas de vencimiento
- [ ] Renovaciones

#### 6.4 Matriz de Habilidades
- [ ] Definir habilidades requeridas por cargo
- [ ] Evaluar nivel de cada empleado (1-5)
- [ ] Identificar brechas (gap analysis)
- [ ] Plan de desarrollo individual

#### 6.5 Reportes
- [ ] Horas de capacitación por empleado
- [ ] ROI de capacitaciones
- [ ] Empleados por certificar
- [ ] Matriz de skills por departamento

### 🔧 Tareas Técnicas

#### Backend
- [ ] Entidad `Curso`
- [ ] Entidad `InscripcionCapacitacion` (ya existe, mejorar)
- [ ] Entidad `CertificacionProfesional` (ya existe)
- [ ] Entidad `Habilidad`
- [ ] Entidad `HabilidadEmpleado` (nivel)
- [ ] Services y endpoints CRUD
- [ ] Lógica de inscripciones

#### Frontend
- [ ] Componentes de gestión de cursos
- [ ] Calendario de capacitaciones
- [ ] Matriz de habilidades visual
- [ ] Gráficos de skills

---

## **MÓDULO 7: REPORTES Y ANALÍTICAS (PRIORIDAD BAJA)**

### 🎯 Objetivo
Reportes gerenciales, analíticas y exportaciones avanzadas.

### 📊 Funcionalidades

#### 7.1 Reportes Operativos
- [ ] Nómina mensual detallada
- [ ] Ausencias por período
- [ ] Dotación actual (headcount)
- [ ] Ingresos y egresos del mes
- [ ] Antigüedad promedio
- [ ] Rotación de personal (turnover)

#### 7.2 Reportes Gerenciales
- [ ] KPIs de RRHH:
  - Tiempo promedio de contratación
  - Costo por contratación
  - Tasa de retención
  - Satisfacción del empleado
  - Productividad por área
- [ ] Proyecciones de planilla
- [ ] Análisis de costos laborales

#### 7.3 Analíticas Avanzadas
- [ ] Tendencias de ausentismo
- [ ] Predicción de rotación (ML básico)
- [ ] Análisis demográfico
- [ ] Mapa de talento

#### 7.4 Exportaciones
- [ ] Excel con formato
- [ ] PDF con logo
- [ ] CSV para integración
- [ ] Reportes programados (cada fin de mes)

### 🔧 Tareas Técnicas

#### Backend
- [ ] ReportesService con queries complejas
- [ ] Generación de Excel (Apache POI)
- [ ] Generación de PDF personalizado
- [ ] Scheduler para reportes automáticos
- [ ] Cacheo de resultados

#### Frontend
- [ ] Dashboard de reportes
- [ ] Filtros avanzados por fecha
- [ ] Gráficos interactivos
- [ ] Descarga directa

---

## 🎯 PRIORIZACIÓN SUGERIDA

### FASE 1: MVP FUNCIONAL (2-3 semanas)
1. ✅ Dashboard básico (ya completado)
2. **Empleados completo** (CRUD + búsqueda + ficha completa)
3. **Legajos básico** (upload/download de documentos principales)
4. **Solicitudes básicas** (vacaciones y permisos con aprobación simple)

### FASE 2: EXPANSIÓN (2-3 semanas)
5. **Recibos de salario** (generación y descarga)
6. **Legajos avanzado** (categorías, versionado, alertas)
7. **Dashboard avanzado** (gráficos, tendencias, alertas)
8. **Solicitudes avanzadas** (workflow multi-nivel, calendario)

### FASE 3: OPTIMIZACIÓN (1-2 semanas)
9. **Capacitaciones** (cursos, inscripciones, certificaciones)
10. **Matriz de habilidades**
11. **Reportes avanzados**
12. **Analíticas y predicciones**

### FASE 4: PULIDO Y SEGURIDAD (1 semana)
13. **Keycloak integrado** (autenticación real sin mock)
14. **Auditoría completa** (logs de todas las acciones)
15. **Testing** (unitarios y de integración)
16. **Optimización de performance**
17. **Documentación de usuario**

---

## 🛠️ TECNOLOGÍAS Y HERRAMIENTAS

### Backend
- Spring Boot 3 + Java 21
- Spring Data JPA + Hibernate
- MySQL 8
- Spring Security + OAuth2
- AWS S3 (documentos)
- iText/JasperReports (PDFs)
- Apache POI (Excel)
- Spring Mail (emails)

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (cache)
- TanStack Table (tablas)
- Recharts (gráficos)
- React Hook Form + Zod
- Axios

### DevOps
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Nginx (proxy reverso)

---

## 📌 CONSIDERACIONES IMPORTANTES

### Seguridad
- [ ] Encriptar datos sensibles (salarios)
- [ ] Roles y permisos granulares
- [ ] Auditoría de acciones críticas
- [ ] Rate limiting en API
- [ ] Validación de archivos subidos

### Performance
- [ ] Paginación en todas las listas
- [ ] Índices en BD para búsquedas
- [ ] Cache de reportes pesados
- [ ] Lazy loading de documentos
- [ ] CDN para archivos estáticos

### UX/UI
- [ ] Loading states en todas las acciones
- [ ] Mensajes de confirmación claros
- [ ] Breadcrumbs de navegación
- [ ] Responsive design
- [ ] Modo oscuro (opcional)

---

## 📅 CRONOGRAMA ESTIMADO

| Fase | Duración | Entregables |
|------|----------|-------------|
| Fase 1 | 3 semanas | MVP funcional con módulos básicos |
| Fase 2 | 3 semanas | Sistema expandido con features avanzadas |
| Fase 3 | 2 semanas | Capacitaciones, reportes y analíticas |
| Fase 4 | 1 semana | Seguridad, testing y documentación |
| **TOTAL** | **9 semanas** | Sistema completo y productivo |

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Usuario puede gestionar empleados completamente desde el sistema
- [ ] Cada empleado tiene su legajo digital completo
- [ ] Solicitudes de ausencias fluyen sin fricción
- [ ] Recibos de salario se generan automáticamente cada mes
- [ ] Dashboard muestra métricas en tiempo real
- [ ] Reportes gerenciales disponibles en un clic
- [ ] Sistema es intuitivo y rápido (< 2 segundos por acción)
- [ ] 0 errores críticos en producción
- [ ] 95%+ de uptime

---

**Fecha de creación:** 04/12/2024  
**Última actualización:** 04/12/2024  
**Versión:** 1.0
