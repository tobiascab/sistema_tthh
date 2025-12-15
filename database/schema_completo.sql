-- ============================================
-- SISTEMA DE GESTIÓN DE TALENTO HUMANO
-- Base de Datos Completa - MySQL/MariaDB
-- Versión: 1.0.0
-- Fecha: 2025-12-03
-- ============================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS sistema_tthh 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE sistema_tthh;

-- ============================================
-- TABLA: empleados (Employee)
-- Información principal de empleados
-- ============================================
CREATE TABLE IF NOT EXISTS empleados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    numero_socio VARCHAR(50) UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_ingreso DATE NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    sucursal VARCHAR(100),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    salario DECIMAL(12,2),
    foto_url VARCHAR(500),
    keycloak_user_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    INDEX idx_numero_documento (numero_documento),
    INDEX idx_numero_socio (numero_socio),
    INDEX idx_email (email),
    INDEX idx_estado (estado),
    INDEX idx_departamento (departamento),
    INDEX idx_sucursal (sucursal),
    INDEX idx_nombres_apellidos (nombres, apellidos)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: recibos_salario (PayrollReceipt)
-- Recibos de pago mensuales
-- ============================================
CREATE TABLE IF NOT EXISTS recibos_salario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    anio INT NOT NULL,
    mes INT NOT NULL,
    fecha_pago DATE NOT NULL,
    salario_bruto DECIMAL(12,2) NOT NULL,
    descuentos_ips DECIMAL(12,2) DEFAULT 0,
    descuentos_jubilacion DECIMAL(12,2) DEFAULT 0,
    otros_descuentos DECIMAL(12,2) DEFAULT 0,
    bonificaciones DECIMAL(12,2) DEFAULT 0,
    salario_neto DECIMAL(12,2) NOT NULL,
    pdf_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'GENERADO',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY uk_empleado_anio_mes (empleado_id, anio, mes),
    INDEX idx_anio_mes (anio, mes),
    INDEX idx_estado (estado),
    INDEX idx_fecha_pago (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: solicitudes (Request)
-- Solicitudes de empleados (vacaciones, permisos, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    prioridad VARCHAR(20) DEFAULT 'MEDIA',
    datos_adicionales TEXT,
    respuesta TEXT,
    aprobado_por VARCHAR(100),
    fecha_aprobacion TIMESTAMP NULL,
    documento_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad),
    INDEX idx_empleado_estado (empleado_id, estado),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: formacion_academica (AcademicLevel)
-- Formación académica de empleados
-- ============================================
CREATE TABLE IF NOT EXISTS formacion_academica (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    institucion VARCHAR(200) NOT NULL,
    titulo VARCHAR(200),
    especialidad VARCHAR(100),
    fecha_inicio DATE,
    fecha_finalizacion DATE,
    en_curso BOOLEAN DEFAULT FALSE,
    documento_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    observaciones TEXT,
    verificado_por VARCHAR(100),
    fecha_verificacion TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_nivel (nivel),
    INDEX idx_estado (estado),
    INDEX idx_empleado_nivel (empleado_id, nivel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: cursos_capacitaciones (Course)
-- Cursos y capacitaciones externas
-- ============================================
CREATE TABLE IF NOT EXISTS cursos_capacitaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    nombre_curso VARCHAR(200) NOT NULL,
    institucion VARCHAR(200) NOT NULL,
    modalidad VARCHAR(50),
    categoria VARCHAR(100),
    duracion_horas INT,
    fecha_inicio DATE,
    fecha_finalizacion DATE,
    certificado_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    nota DECIMAL(5,2),
    aprobado BOOLEAN,
    descripcion TEXT,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado),
    INDEX idx_empleado_categoria (empleado_id, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: certificaciones_profesionales (Certification)
-- Certificaciones profesionales con vencimiento
-- ============================================
CREATE TABLE IF NOT EXISTS certificaciones_profesionales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    nombre_certificacion VARCHAR(200) NOT NULL,
    entidad_certificadora VARCHAR(200) NOT NULL,
    numero_certificado VARCHAR(100),
    fecha_obtencion DATE NOT NULL,
    fecha_vencimiento DATE,
    vigente BOOLEAN DEFAULT TRUE,
    documento_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'VIGENTE',
    descripcion TEXT,
    alerta_enviada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_vigente (vigente),
    INDEX idx_fecha_vencimiento (fecha_vencimiento),
    INDEX idx_estado (estado),
    INDEX idx_empleado_vigente (empleado_id, vigente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: idiomas (Language)
-- Idiomas que domina el empleado
-- ============================================
CREATE TABLE IF NOT EXISTS idiomas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    idioma VARCHAR(50) NOT NULL,
    nivel_cefr VARCHAR(10) NOT NULL,
    certificacion VARCHAR(100),
    documento_url VARCHAR(500),
    nativo BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_idioma (idioma),
    INDEX idx_nivel_cefr (nivel_cefr),
    INDEX idx_empleado_idioma (empleado_id, idioma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: habilidades (Skill)
-- Habilidades técnicas y blandas
-- ============================================
CREATE TABLE IF NOT EXISTS habilidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    nombre_habilidad VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(100),
    nivel INT NOT NULL,
    anios_experiencia INT,
    descripcion TEXT,
    certificada BOOLEAN DEFAULT FALSE,
    documento_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_tipo (tipo),
    INDEX idx_categoria (categoria),
    INDEX idx_nivel (nivel),
    INDEX idx_empleado_tipo (empleado_id, tipo),
    CHECK (nivel BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: plan_desarrollo (DevelopmentPlan)
-- Planes de desarrollo individual (IDP)
-- ============================================
CREATE TABLE IF NOT EXISTS plan_desarrollo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    anio INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'BORRADOR',
    objetivos TEXT,
    cursos_recomendados TEXT,
    gaps_detectados TEXT,
    progreso INT DEFAULT 0,
    fecha_inicio DATE,
    fecha_objetivo DATE,
    comentarios_supervisor TEXT,
    supervisor_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY uk_empleado_anio (empleado_id, anio),
    INDEX idx_anio (anio),
    INDEX idx_estado (estado),
    CHECK (progreso BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: capacitaciones_internas (InternalTraining)
-- Capacitaciones organizadas internamente
-- ============================================
CREATE TABLE IF NOT EXISTS capacitaciones_internas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_capacitacion VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    modalidad VARCHAR(50),
    duracion_horas INT,
    cupo_maximo INT,
    cupo_disponible INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    instructor VARCHAR(200),
    ubicacion VARCHAR(200),
    estado VARCHAR(20) DEFAULT 'PLANIFICADA',
    objetivos TEXT,
    requisitos TEXT,
    material_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    INDEX idx_estado (estado),
    INDEX idx_categoria (categoria),
    INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: inscripciones_capacitacion (TrainingEnrollment)
-- Inscripciones a capacitaciones internas
-- ============================================
CREATE TABLE IF NOT EXISTS inscripciones_capacitacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    capacitacion_id BIGINT NOT NULL,
    empleado_id BIGINT NOT NULL,
    estado VARCHAR(20) DEFAULT 'INSCRITO',
    asistio BOOLEAN DEFAULT FALSE,
    calificacion DECIMAL(5,2),
    aprobado BOOLEAN,
    certificado_url VARCHAR(500),
    comentarios TEXT,
    evaluacion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (capacitacion_id) REFERENCES capacitaciones_internas(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY uk_capacitacion_empleado (capacitacion_id, empleado_id),
    INDEX idx_estado (estado),
    INDEX idx_asistio (asistio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: movimientos_empleado
-- Historial de movimientos (ascensos, cambios, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS movimientos_empleado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL,
    area_anterior VARCHAR(100),
    area_nueva VARCHAR(100),
    cargo_anterior VARCHAR(100),
    cargo_nuevo VARCHAR(100),
    salario_anterior DECIMAL(12,2),
    salario_nuevo DECIMAL(12,2),
    fecha_efectiva DATE NOT NULL,
    motivo TEXT,
    observaciones TEXT,
    documento_url VARCHAR(500),
    autorizado_por VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_tipo_movimiento (tipo_movimiento),
    INDEX idx_fecha_efectiva (fecha_efectiva),
    INDEX idx_empleado_fecha (empleado_id, fecha_efectiva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: asistencias
-- Control de asistencias
-- ============================================
CREATE TABLE IF NOT EXISTS asistencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    hora_entrada TIMESTAMP NULL,
    hora_salida TIMESTAMP NULL,
    minutos_retraso INT DEFAULT 0,
    observaciones TEXT,
    justificado BOOLEAN DEFAULT FALSE,
    documento_justificacion VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por VARCHAR(100),
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    UNIQUE KEY uk_empleado_fecha (empleado_id, fecha),
    INDEX idx_fecha (fecha),
    INDEX idx_tipo (tipo),
    INDEX idx_justificado (justificado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: comunicados
-- Comunicados internos
-- ============================================
CREATE TABLE IF NOT EXISTS comunicados (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50),
    prioridad VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_publicacion TIMESTAMP NULL,
    fecha_expiracion TIMESTAMP NULL,
    imagen_url VARCHAR(500),
    departamento_destino VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    INDEX idx_activo (activo),
    INDEX idx_tipo (tipo),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha_publicacion (fecha_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: auditoria (AuditLog)
-- Registro de auditoría de acciones críticas
-- ============================================
CREATE TABLE IF NOT EXISTS auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(100),
    entidad_id BIGINT,
    detalles TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_usuario (usuario),
    INDEX idx_accion (accion),
    INDEX idx_entidad (entidad),
    INDEX idx_created_at (created_at),
    INDEX idx_usuario_accion (usuario, accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: ausencias
-- Registro de ausencias (ya existente en el código)
-- ============================================
CREATE TABLE IF NOT EXISTS ausencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    tipo_ausencia VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_solicitados INT NOT NULL,
    motivo TEXT,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    aprobado_por VARCHAR(100),
    fecha_aprobacion TIMESTAMP NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    INDEX idx_tipo_ausencia (tipo_ausencia),
    INDEX idx_estado (estado),
    INDEX idx_fecha_inicio (fecha_inicio),
    INDEX idx_empleado_estado (empleado_id, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar empleado de prueba
INSERT INTO empleados (
    numero_documento, numero_socio, nombres, apellidos, email, 
    telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, 
    sucursal, estado, ciudad, salario, keycloak_user_id
) VALUES (
    '12345678', 'SOC001', 'Admin', 'TTHH', 'admin.tthh@coopreducto.com',
    '0981123456', '1990-01-15', '2024-01-01', 'Jefe de RRHH', 'Talento Humano',
    'Asunción', 'ACTIVO', 'Asunción', 8000000.00, 'admin-tthh-keycloak-id'
);

-- Insertar comunicado de bienvenida
INSERT INTO comunicados (
    titulo, contenido, tipo, prioridad, activo, fecha_publicacion
) VALUES (
    'Bienvenida al Sistema TTHH',
    'Bienvenidos al nuevo Sistema de Gestión de Talento Humano de Cooperativa Reducto. Este sistema les permitirá gestionar sus recibos, solicitudes, formación y mucho más.',
    'INFORMATIVO', 'ALTA', TRUE, NOW()
);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de empleados activos con información resumida
CREATE OR REPLACE VIEW v_empleados_activos AS
SELECT 
    e.id,
    e.numero_documento,
    e.numero_socio,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    e.email,
    e.cargo,
    e.departamento,
    e.sucursal,
    e.fecha_ingreso,
    TIMESTAMPDIFF(YEAR, e.fecha_ingreso, CURDATE()) AS antiguedad_anios,
    e.salario
FROM empleados e
WHERE e.estado = 'ACTIVO';

-- Vista de solicitudes pendientes
CREATE OR REPLACE VIEW v_solicitudes_pendientes AS
SELECT 
    s.id,
    CONCAT(e.nombres, ' ', e.apellidos) AS empleado,
    e.numero_socio,
    s.tipo,
    s.titulo,
    s.prioridad,
    s.created_at,
    DATEDIFF(CURDATE(), DATE(s.created_at)) AS dias_pendiente
FROM solicitudes s
INNER JOIN empleados e ON s.empleado_id = e.id
WHERE s.estado = 'PENDIENTE'
ORDER BY s.prioridad DESC, s.created_at ASC;

-- Vista de certificaciones por vencer
CREATE OR REPLACE VIEW v_certificaciones_por_vencer AS
SELECT 
    c.id,
    CONCAT(e.nombres, ' ', e.apellidos) AS empleado,
    e.numero_socio,
    c.nombre_certificacion,
    c.entidad_certificadora,
    c.fecha_vencimiento,
    DATEDIFF(c.fecha_vencimiento, CURDATE()) AS dias_restantes
FROM certificaciones_profesionales c
INNER JOIN empleados e ON c.empleado_id = e.id
WHERE c.vigente = TRUE 
  AND c.fecha_vencimiento IS NOT NULL
  AND c.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
ORDER BY c.fecha_vencimiento ASC;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger para actualizar cupo disponible al inscribirse
DELIMITER $$
CREATE TRIGGER trg_after_inscripcion_insert
AFTER INSERT ON inscripciones_capacitacion
FOR EACH ROW
BEGIN
    UPDATE capacitaciones_internas
    SET cupo_disponible = cupo_disponible - 1
    WHERE id = NEW.capacitacion_id AND cupo_disponible > 0;
END$$

-- Trigger para restaurar cupo al cancelar inscripción
CREATE TRIGGER trg_after_inscripcion_delete
AFTER DELETE ON inscripciones_capacitacion
FOR EACH ROW
BEGIN
    UPDATE capacitaciones_internas
    SET cupo_disponible = cupo_disponible + 1
    WHERE id = OLD.capacitacion_id AND cupo_disponible < cupo_maximo;
END$$

DELIMITER ;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Mostrar resumen de tablas creadas
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Registros',
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Tamaño (MB)'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'sistema_tthh'
ORDER BY TABLE_NAME;
