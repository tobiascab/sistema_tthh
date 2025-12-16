-- ============================================
-- DATA SEEDING - SISTEMA TTHH
-- Datos de prueba con Cumpleaños en DICIEMBRE
-- ============================================

-- Desactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas
DELETE FROM auditoria;
DELETE FROM inscripciones_capacitacion;
DELETE FROM capacitaciones_internas;
DELETE FROM plan_desarrollo;
DELETE FROM habilidades;
DELETE FROM idiomas;
DELETE FROM certificaciones_profesionales;
DELETE FROM cursos_capacitaciones;
DELETE FROM formacion_academica;
DELETE FROM solicitudes;
DELETE FROM recibos_salario;
DELETE FROM empleados;

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

-- 1.4 Colaborador 1 - Juan Pérez (CUMPLEAÑOS HOY - 16 DIC)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000001', 'COL001', 'Juan', 'Pérez', 'juan.perez@coopreducto.com', '0981444444', '1995-12-16', '2022-01-10', 'Desarrollador Senior', 'Tecnología', 'Casa Matriz', 'ACTIVO', 'Luque', 8500000.00, 'user-colab1-id');

-- 1.5 Colaborador 2 (Operaciones)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000002', 'COL002', 'María', 'González', 'maria.gonzalez@coopreducto.com', '0981555555', '1993-07-22', '2022-03-20', 'Analista de Operaciones', 'Operaciones', 'Sucursal 1', 'ACTIVO', 'Fernando de la Mora', 5500000.00, 'user-colab2-id');

-- 1.6 Colaborador 3 - Carlos Rodríguez (CUMPLEAÑOS FIN DE AÑO - 30 DIC)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000003', 'COL003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@coopreducto.com', '0981666666', '1990-12-30', '2021-11-15', 'Ejecutivo de Cuentas', 'Ventas', 'Sucursal 2', 'ACTIVO', 'Capiatá', 4800000.00, 'user-colab3-id');

-- 1.7 Colaborador 4 - Ana Martínez (CUMPLEAÑOS NAVIDAD - 25 DIC)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000004', 'COL004', 'Ana', 'Martínez', 'ana.martinez@coopreducto.com', '0981777777', '1998-12-25', '2023-02-01', 'Atención al Socio', 'Atención al Cliente', 'Casa Matriz', 'ACTIVO', 'Asunción', 3500000.00, 'user-colab4-id');

-- 1.8 Colaborador 5 - Luis Fernández (CUMPLEAÑOS PASADO - 10 DIC)
INSERT INTO empleados (numero_documento, numero_socio, nombres, apellidos, email, telefono, fecha_nacimiento, fecha_ingreso, cargo, departamento, sucursal, estado, ciudad, salario, keycloak_user_id)
VALUES ('2000005', 'COL005', 'Luis', 'Fernández', 'luis.fernandez@coopreducto.com', '0981888888', '1982-12-10', '2019-05-05', 'Contador Senior', 'Contabilidad', 'Casa Matriz', 'ACTIVO', 'Lambaré', 9000000.00, 'user-colab5-id');

-- ============================================
-- 2. RECIBOS DE SALARIO
-- ============================================
INSERT INTO recibos_salario (empleado_id, anio, mes, fecha_pago, salario_bruto, descuentos_ips, descuentos_jubilacion, salario_neto, estado)
VALUES 
(4, 2024, 1, '2024-01-31', 8500000.00, 765000.00, 0, 7735000.00, 'DESCARGADO'),
(4, 2024, 2, '2024-02-29', 8500000.00, 765000.00, 0, 7735000.00, 'DESCARGADO'),
(4, 2024, 3, '2024-03-31', 8500000.00, 765000.00, 0, 7735000.00, 'ENVIADO'),
(4, 2024, 4, '2024-04-30', 8500000.00, 765000.00, 0, 7735000.00, 'GENERADO'),
(5, 2024, 1, '2024-01-31', 5500000.00, 495000.00, 0, 5005000.00, 'DESCARGADO'),
(5, 2024, 2, '2024-02-29', 5500000.00, 495000.00, 0, 5005000.00, 'ENVIADO');

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
