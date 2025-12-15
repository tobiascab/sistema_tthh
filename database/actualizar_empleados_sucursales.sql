-- Script para actualizar empleados con sucursales y departamentos reales de Cooperativa Reducto
-- Ejecutar en la base de datos H2 o la que se esté usando

-- Departamentos: CREDITO, AHORRO, TARJETA, JUDICIALES, CONTABILIDAD, TESORERIA, RECUPERACION, INFORMATICA, SEPRELAD
-- Sucursales: CASA MATRIZ, SUCURSAL LUQUE, SUCURSAL SAN LORENZO, SUCURSAL LAMBARE, SUCURSAL FERNANDO DE LA MORA

-- Actualizar empleados distribuidos por ID para cubrir todos los departamentos y sucursales
UPDATE empleados SET area = 'CREDITO', sucursal = 'CASA MATRIZ' WHERE id = 1;
UPDATE empleados SET area = 'AHORRO', sucursal = 'SUCURSAL LUQUE' WHERE id = 2;
UPDATE empleados SET area = 'TARJETA', sucursal = 'SUCURSAL SAN LORENZO' WHERE id = 3;
UPDATE empleados SET area = 'JUDICIALES', sucursal = 'SUCURSAL LAMBARE' WHERE id = 4;
UPDATE empleados SET area = 'CONTABILIDAD', sucursal = 'SUCURSAL FERNANDO DE LA MORA' WHERE id = 5;
UPDATE empleados SET area = 'TESORERIA', sucursal = 'CASA MATRIZ' WHERE id = 6;
UPDATE empleados SET area = 'RECUPERACION', sucursal = 'SUCURSAL LUQUE' WHERE id = 7;
UPDATE empleados SET area = 'INFORMATICA', sucursal = 'SUCURSAL SAN LORENZO' WHERE id = 8;
UPDATE empleados SET area = 'SEPRELAD', sucursal = 'SUCURSAL LAMBARE' WHERE id = 9;
UPDATE empleados SET area = 'CREDITO', sucursal = 'SUCURSAL FERNANDO DE LA MORA' WHERE id = 10;
UPDATE empleados SET area = 'AHORRO', sucursal = 'CASA MATRIZ' WHERE id = 11;
UPDATE empleados SET area = 'TARJETA', sucursal = 'SUCURSAL LUQUE' WHERE id = 12;
UPDATE empleados SET area = 'JUDICIALES', sucursal = 'SUCURSAL SAN LORENZO' WHERE id = 13;
UPDATE empleados SET area = 'CONTABILIDAD', sucursal = 'SUCURSAL LAMBARE' WHERE id = 14;
UPDATE empleados SET area = 'TESORERIA', sucursal = 'SUCURSAL FERNANDO DE LA MORA' WHERE id = 15;
UPDATE empleados SET area = 'RECUPERACION', sucursal = 'CASA MATRIZ' WHERE id = 16;
UPDATE empleados SET area = 'INFORMATICA', sucursal = 'SUCURSAL LUQUE' WHERE id = 17;
UPDATE empleados SET area = 'SEPRELAD', sucursal = 'SUCURSAL SAN LORENZO' WHERE id = 18;
UPDATE empleados SET area = 'CREDITO', sucursal = 'SUCURSAL LAMBARE' WHERE id = 19;
UPDATE empleados SET area = 'AHORRO', sucursal = 'SUCURSAL FERNANDO DE LA MORA' WHERE id = 20;
UPDATE empleados SET area = 'TARJETA', sucursal = 'CASA MATRIZ' WHERE id = 21;
UPDATE empleados SET area = 'COMERCIAL', sucursal = 'CASA MATRIZ' WHERE id = 22; -- Victor Maldonado (Demo)

-- Actualizar cargos específicos por departamento
UPDATE empleados SET cargo = 'Analista de Créditos' WHERE area = 'CREDITO';
UPDATE empleados SET cargo = 'Ejecutivo de Cuentas' WHERE area = 'AHORRO';
UPDATE empleados SET cargo = 'Ejecutivo de Tarjetas' WHERE area = 'TARJETA';
UPDATE empleados SET cargo = 'Abogado' WHERE area = 'JUDICIALES';
UPDATE empleados SET cargo = 'Contador' WHERE area = 'CONTABILIDAD';
UPDATE empleados SET cargo = 'Cajero' WHERE area = 'TESORERIA';
UPDATE empleados SET cargo = 'Gestor de Cobranzas' WHERE area = 'RECUPERACION';
UPDATE empleados SET cargo = 'Analista de Sistemas' WHERE area = 'INFORMATICA';
UPDATE empleados SET cargo = 'Oficial de Cumplimiento' WHERE area = 'SEPRELAD';

-- Mensaje de confirmación
SELECT 'Empleados actualizados con sucursales y departamentos' as resultado;
