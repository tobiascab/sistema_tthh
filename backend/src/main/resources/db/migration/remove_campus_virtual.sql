-- Script para eliminar el módulo de Campus Virtual (Capacitaciones)
-- Fecha: 2025-12-15
-- Descripción: Elimina todas las tablas relacionadas con el módulo de capacitaciones
-- Base de Datos: MySQL

-- Desactivar restricciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Eliminar tabla de inscripciones a capacitaciones
DROP TABLE IF EXISTS `inscripcion_capacitacion`;

-- Eliminar tabla de capacitaciones internas
DROP TABLE IF EXISTS `capacitacion_interna`;

-- Reactivar restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que le as tablas se eliminaron (Opcional, para ejecutar manualmente)
-- SHOW TABLES LIKE '%capacitacion%';
