-- ============================================
-- SEED DATA - SISTEMA TTHH
-- Datos de prueba para desarrollo y testing
-- Fecha: 2025-12-03
-- ============================================

USE sistema_tthh;

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas (opcional, comentar si no se desea limpiar)
TRUNCATE TABLE auditoria;
TRUNCATE TABLE inscripciones_capacitacion;
TRUNCATE TABLE capacitaciones_internas;
TRUNCATE TABLE plan_desarrollo;
TRUNCATE TABLE habilidades;
TRUNCATE TABLE idiomas;
TRUNCATE TABLE certificaciones_profesionales;
TRUNCATE TABLE cursos_capacitaciones;
TRUNCATE TABLE formacion_academica;
TRUNCATE TABLE solicitudes;
TRUNCATE TABLE recibos_salario;
TRUNCATE TABLE empleados;

-- ============================================
-- 1. EMPLEADOS (8 registros)
-- ============================================

-- 1.1 Admin TTHH
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('1000001', 'EMP001', 'Admin', 'Recursos Humanos', 'admin.tthh@coopreducto.com', '0981111111', '1985-05-10', '2020-01-01', 'Jefe de TTHH', 'Talento Humano', 'Casa Matriz', 'ACTIVO', 'Asunción', 12000000.00, 'user-tthh-id');

-- 1.2 Gerencia
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('1000002', 'EMP002', 'Roberto', 'Gerente', 'gerencia@coopreducto.com', '0981222222', '1975-08-20', '2018-03-15', 'Gerente General', 'Gerencia', 'Casa Matriz', 'ACTIVO', 'Asunción', 25000000.00, 'user-gerencia-id');

-- 1.3 Auditoría
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('1000003', 'EMP003', 'Laura', 'Auditora', 'auditoria@coopreducto.com', '0981333333', '1988-11-05', '2021-06-01', 'Auditor Interno', 'Auditoría', 'Casa Matriz', 'ACTIVO', 'San Lorenzo', 10000000.00, 'user-auditoria-id');

-- 1.4 Colaborador 1 (Tecnología)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000001', 'COL001', 'Juan', 'Pérez', 'juan.perez@coopreducto.com', '0981444444', '1995-02-14', '2022-01-10', 'Desarrollador Senior', 'Tecnología', 'Casa Matriz', 'ACTIVO', 'Luque', 8500000.00, 'user-colab1-id');

-- 1.5 Colaborador 2 (Operaciones)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000002', 'COL002', 'María', 'González', 'maria.gonzalez@coopreducto.com', '0981555555', '1993-07-22', '2022-03-20', 'Analista de Operaciones', 'Operaciones', 'Sucursal 1', 'ACTIVO', 'Fernando de la Mora', 5500000.00, 'user-colab2-id');

-- 1.6 Colaborador 3 (Ventas)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000003', 'COL003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@coopreducto.com', '0981666666', '1990-12-30', '2021-11-15', 'Ejecutivo de Cuentas', 'Ventas', 'Sucursal 2', 'ACTIVO', 'Capiatá', 4800000.00, 'user-colab3-id');

-- 1.7 Colaborador 4 (Atención al Cliente)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000004', 'COL004', 'Ana', 'Martínez', 'ana.martinez@coopreducto.com', '0981777777', '1998-04-18', '2023-02-01', 'Atención al Socio', 'Atención al Cliente', 'Casa Matriz', 'ACTIVO', 'Asunción', 3500000.00, 'user-colab4-id');

-- 1.8 Colaborador 5 (Contabilidad)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000005', 'COL005', 'Luis', 'Fernández', 'luis.fernandez@coopreducto.com', '0981888888', '1982-09-09', '2019-05-05', 'Contador Senior', 'Contabilidad', 'Casa Matriz', 'ACTIVO', 'Lambaré', 9000000.00, 'user-colab5-id');

-- ============================================
-- 2. RECIBOS DE SALARIO (Muestra para Juan Pérez y María González)
-- ============================================

-- Recibos 2024 para Juan Pérez (ID 4)
INSERT INTO recibos_salario (empleado_id, anio, mes, fecha_pago, salario_bruto, descuentos_ips, descuentos_jubilacion, salario_neto, estado)
VALUES 
(4, 2024, 1, '2024-01-31', 8500000.00, 765000.00, 0, 7735000.00, 'DESCARGADO'),
(4, 2024, 2, '2024-02-29', 8500000.00, 765000.00, 0, 7735000.00, 'DESCARGADO'),
(4, 2024, 3, '2024-03-31', 8500000.00, 765000.00, 0, 7735000.00, 'ENVIADO'),
(4, 2024, 4, '2024-04-30', 8500000.00, 765000.00, 0, 7735000.00, 'GENERADO');

-- Recibos 2024 para María González (ID 5)
INSERT INTO recibos_salario (empleado_id, anio, mes, fecha_pago, salario_bruto, descuentos_ips, descuentos_jubilacion, salario_neto, estado)
VALUES 
(5, 2024, 1, '2024-01-31', 5500000.00, 495000.00, 0, 5005000.00, 'DESCARGADO'),
(5, 2024, 2, '2024-02-29', 5500000.00, 495000.00, 0, 5005000.00, 'ENVIADO');

-- ============================================
-- 3. FORMACIÓN ACADÉMICA
-- ============================================

-- Juan Pérez (Ingeniero)
INSERT INTO formacion_academica (empleado_id, nivel, institucion, titulo, fecha_finalizacion, estado)
VALUES 
(4, 'UNIVERSITARIO', 'Universidad Nacional de Asunción', 'Ingeniero en Informática', '2018-12-15', 'APROBADO'),
(4, 'POSTGRADO', 'Universidad Católica', 'Especialización en Desarrollo de Software', '2020-11-30', 'APROBADO');

-- María González (Licenciada)
INSERT INTO formacion_academica (empleado_id, nivel, institucion, titulo, fecha_finalizacion, estado)
VALUES 
(5, 'UNIVERSITARIO', 'Universidad Americana', 'Licenciada en Administración', '2016-12-20', 'APROBADO');

-- Ana Martínez (Estudiante)
INSERT INTO formacion_academica (empleado_id, nivel, institucion, titulo, en_curso, estado)
VALUES 
(7, 'UNIVERSITARIO', 'Universidad Columbia', 'Licenciatura en Marketing', TRUE, 'PENDIENTE');

-- ============================================
-- 4. CERTIFICACIONES PROFESIONALES
-- ============================================

-- Juan Pérez
INSERT INTO certificaciones_profesionales (empleado_id, nombre_certificacion, entidad_certificadora, fecha_obtencion, fecha_vencimiento, vigente, estado)
VALUES 
(4, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2023-06-15', '2026-06-15', TRUE, 'VIGENTE'),
(4, 'Java SE 11 Developer', 'Oracle', '2021-03-10', NULL, TRUE, 'VIGENTE');

-- Carlos Rodríguez (Vencida)
INSERT INTO certificaciones_profesionales (empleado_id, nombre_certificacion, entidad_certificadora, fecha_obtencion, fecha_vencimiento, vigente, estado)
VALUES 
(6, 'Técnicas de Ventas Avanzadas', 'Sales Institute', '2020-01-15', '2022-01-15', FALSE, 'VENCIDA');

-- ============================================
-- 5. IDIOMAS
-- ============================================

INSERT INTO idiomas (empleado_id, idioma, nivel_cefr, nativo) VALUES
(4, 'ESPAÑOL', 'C2', TRUE),
(4, 'INGLES', 'B2', FALSE),
(5, 'ESPAÑOL', 'C2', TRUE),
(5, 'PORTUGUES', 'B1', FALSE),
(6, 'GUARANI', 'C2', TRUE);

-- ============================================
-- 6. HABILIDADES (Skills)
-- ============================================

-- Juan Pérez (Tech)
INSERT INTO habilidades (empleado_id, nombre_habilidad, tipo, categoria, nivel, anios_experiencia) VALUES
(4, 'Java', 'TECNICA', 'PROGRAMACION', 5, 6),
(4, 'Spring Boot', 'TECNICA', 'FRAMEWORK', 4, 4),
(4, 'Liderazgo', 'BLANDA', 'GESTION', 3, 2);

-- María González (Ops)
INSERT INTO habilidades (empleado_id, nombre_habilidad, tipo, categoria, nivel, anios_experiencia) VALUES
(5, 'Excel Avanzado', 'TECNICA', 'OFIMATICA', 5, 8),
(5, 'Trabajo en Equipo', 'BLANDA', 'SOFT_SKILLS', 5, 5);

-- ============================================
-- 7. CAPACITACIONES INTERNAS Y CURSOS
-- ============================================

-- Capacitaciones Internas
INSERT INTO capacitaciones_internas (nombre_capacitacion, descripcion, categoria, modalidad, cupo_maximo, cupo_disponible, fecha_inicio, estado)
VALUES 
('Seguridad de la Información 2024', 'Curso obligatorio sobre seguridad informática', 'SEGURIDAD', 'VIRTUAL', 100, 95, '2024-03-01', 'ACTIVA'),
('Atención al Socio - Protocolo', 'Mejores prácticas para atención', 'ATENCION', 'PRESENCIAL', 20, 5, '2024-04-15', 'PLANIFICADA');

-- Inscripciones
INSERT INTO inscripciones_capacitacion (capacitacion_id, empleado_id, estado, asistio) VALUES
(1, 4, 'INSCRITO', FALSE),
(1, 5, 'INSCRITO', FALSE),
(1, 6, 'INSCRITO', FALSE),
(1, 7, 'INSCRITO', FALSE),
(1, 8, 'INSCRITO', FALSE);

-- Cursos Externos
INSERT INTO cursos_capacitaciones (empleado_id, nombre_curso, institucion, modalidad, estado, aprobado) VALUES
(4, 'Microservicios con Spring Cloud', 'Udemy', 'VIRTUAL', 'APROBADO', TRUE),
(5, 'Gestión de Procesos BPMN', 'Coursera', 'VIRTUAL', 'PENDIENTE', NULL);

-- ============================================
-- 8. SOLICITUDES
-- ============================================

-- Juan Pérez
INSERT INTO solicitudes (empleado_id, tipo, titulo, descripcion, estado, prioridad, created_at) VALUES
(4, 'VACACIONES', 'Vacaciones Enero 2025', 'Solicito 15 días de vacaciones', 'PENDIENTE', 'MEDIA', NOW()),
(4, 'PERMISO', 'Consulta Médica', 'Permiso para ir al dentista', 'APROBADA', 'BAJA', '2024-02-10 08:00:00');

-- Ana Martínez
INSERT INTO solicitudes (empleado_id, tipo, titulo, descripcion, estado, prioridad, created_at) VALUES
(7, 'CERTIFICADO', 'Certificado de Trabajo', 'Para presentar en la universidad', 'PENDIENTE', 'BAJA', NOW());

-- Carlos Rodríguez (Rechazada)
INSERT INTO solicitudes (empleado_id, tipo, titulo, descripcion, estado, prioridad, respuesta, created_at) VALUES
(6, 'VACACIONES', 'Vacaciones Semana Santa', 'Solicito días libres', 'RECHAZADA', 'ALTA', 'No hay cobertura suficiente en esas fechas', '2024-03-01 10:00:00');

-- ============================================
-- 9. AUDITORÍA
-- ============================================

INSERT INTO auditoria (usuario, accion, entidad, entidad_id, detalles, ip_address) VALUES
('admin.tthh', 'LOGIN', 'AUTH', NULL, 'Inicio de sesión exitoso', '192.168.1.10'),
('admin.tthh', 'CREATE', 'EMPLEADO', 4, 'Creación de empleado Juan Pérez', '192.168.1.10'),
('juan.perez', 'LOGIN', 'AUTH', NULL, 'Inicio de sesión exitoso', '192.168.1.25'),
('juan.perez', 'CREATE', 'SOLICITUD', 1, 'Solicitud de vacaciones creada', '192.168.1.25');

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- FIN DEL SEED
-- ============================================
SELECT 'Seed completado exitosamente' AS mensaje;
