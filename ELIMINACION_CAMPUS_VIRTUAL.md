# Eliminación del Módulo Campus Virtual

Fecha: 2025-12-15

## Resumen
Se ha eliminado completamente el módulo de Campus Virtual (Capacitaciones) del sistema TTHH_V2.

## Archivos Eliminados

### Frontend

#### Tipos TypeScript
- `frontend/src/types/capacitacion.ts` - Definiciones de tipos para capacitaciones

#### API
- `frontend/src/lib/api/capacitaciones.ts` - Funciones de API para capacitaciones

#### Páginas y Componentes
- `frontend/app/(private)/tthh/capacitaciones/` - Directorio completo de páginas de capacitaciones

#### Menú
- Entrada "Campus Virtual" eliminada del sidebar (`frontend/src/components/layout/sidebar.tsx`)

### Backend

#### Entidades
- `backend/src/main/java/com/coopreducto/tthh/entity/CapacitacionInterna.java`
- `backend/src/main/java/com/coopreducto/tthh/entity/InscripcionCapacitacion.java`

#### Repositorios
- `backend/src/main/java/com/coopreducto/tthh/repository/CapacitacionInternaRepository.java`

#### Servicios
- `backend/src/main/java/com/coopreducto/tthh/service/CapacitacionService.java`
- `backend/src/main/java/com/coopreducto/tthh/service/impl/CapacitacionServiceImpl.java`

#### Controladores
- `backend/src/main/java/com/coopreducto/tthh/controller/CapacitacionController.java`

#### DTOs
- `backend/src/main/java/com/coopreducto/tthh/dto/CapacitacionDTO.java`

### Base de Datos

Se creó el script SQL para eliminar las tablas (Compatible con MySQL):
- `backend/src/main/resources/db/migration/remove_campus_virtual.sql`

#### Tablas a eliminar:
- `inscripcion_capacitacion`
- `capacitacion_interna`

## Pasos para Completar la Eliminación

### 1. Ejecutar el Script SQL
```bash
# Si tienes MySQL instalado y en el PATH:
mysql -u root -p sistema_tthh < backend/src/main/resources/db/migration/remove_campus_virtual.sql

# O puedes abrir el archivo .sql en tu gestor de base de datos favorito (DBeaver, Workbench, phpMyAdmin) y ejecutarlo.
```

### 2. Limpiar el Proyecto Backend
```bash
cd backend
mvn clean
```

### 3. Limpiar el Proyecto Frontend
```bash
cd frontend
npm run build
```

### 4. Reiniciar los Servicios
- Detener el backend (Maven)
- Detener el frontend (npm)
- Iniciar nuevamente ambos servicios

## Verificación

Después de completar los pasos:

1. ✅ El menú lateral no debe mostrar "Campus Virtual"
2. ✅ No debe haber errores de compilación en el backend
3. ✅ No debe haber errores de compilación en el frontend
4. ✅ Las tablas de capacitaciones deben haber sido eliminadas de la base de datos

## Estado

- [x] Archivos del frontend eliminados
- [x] Archivos del backend eliminados
- [x] Script SQL creado (MySQL)
- [ ] Script SQL ejecutado
- [ ] Backend recompilado
- [ ] Frontend recompilado
- [ ] Servicios reiniciados
