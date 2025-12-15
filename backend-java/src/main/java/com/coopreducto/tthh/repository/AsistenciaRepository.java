package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Asistencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

        List<Asistencia> findByEmpleadoId(Long empleadoId);

        Page<Asistencia> findByEmpleadoId(Long empleadoId, Pageable pageable);

        Page<Asistencia> findByFecha(LocalDate fecha, Pageable pageable);

        Optional<Asistencia> findByEmpleadoIdAndFecha(Long empleadoId, LocalDate fecha);

        @Query("SELECT a FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
        List<Asistencia> findByEmpleadoIdAndRangoFecha(@Param("empleadoId") Long empleadoId,
                        @Param("fechaInicio") LocalDate fechaInicio,
                        @Param("fechaFin") LocalDate fechaFin);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.tipo = 'TARDANZA' AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
        Long countTardanzas(@Param("empleadoId") Long empleadoId,
                        @Param("fechaInicio") LocalDate fechaInicio,
                        @Param("fechaFin") LocalDate fechaFin);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.tipo = 'AUSENTE' AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
        Long countAusencias(@Param("empleadoId") Long empleadoId,
                        @Param("fechaInicio") LocalDate fechaInicio,
                        @Param("fechaFin") LocalDate fechaFin);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.tipo IN ('AUSENTE', 'PERMISO', 'LICENCIA') AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
        Long countAusenciasGlobal(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

        @Query("SELECT a.tipo, COUNT(a) FROM Asistencia a WHERE a.fecha BETWEEN :fechaInicio AND :fechaFin GROUP BY a.tipo")
        List<Object[]> countByTipoAndRangoFecha(@Param("fechaInicio") LocalDate fechaInicio,
                        @Param("fechaFin") LocalDate fechaFin);

        // ========================================
        // CONSULTAS ADICIONALES OPTIMIZADAS
        // ========================================

        // Contar asistencias por tipo y empleado en un rango de fechas
        @Query("SELECT a.tipo, COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.fecha BETWEEN :fechaInicio AND :fechaFin GROUP BY a.tipo")
        List<Object[]> countByEmpleadoAndTipo(@Param("empleadoId") Long empleadoId,
                        @Param("fechaInicio") LocalDate fechaInicio,
                        @Param("fechaFin") LocalDate fechaFin);

        // Estadísticas mensuales por empleado
        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.tipo = 'PRESENTE' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long countPresentesMensual(@Param("empleadoId") Long empleadoId,
                        @Param("mes") Integer mes,
                        @Param("anio") Integer anio);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.tipo = 'TARDANZA' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long countTardanzasMensual(@Param("empleadoId") Long empleadoId,
                        @Param("mes") Integer mes,
                        @Param("anio") Integer anio);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND a.tipo = 'AUSENTE' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long countAusenciasMensual(@Param("empleadoId") Long empleadoId,
                        @Param("mes") Integer mes,
                        @Param("anio") Integer anio);

        // Totales globales mensuales
        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.tipo = 'TARDANZA' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long countTardanzasGlobalMensual(@Param("mes") Integer mes, @Param("anio") Integer anio);

        @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.tipo = 'AUSENTE' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long countAusenciasGlobalMensual(@Param("mes") Integer mes, @Param("anio") Integer anio);

        // Suma de minutos de retraso mensual por empleado
        @Query("SELECT COALESCE(SUM(a.minutosRetraso), 0) FROM Asistencia a WHERE a.empleado.id = :empleadoId AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio")
        Long sumMinutosRetrasoMensual(@Param("empleadoId") Long empleadoId,
                        @Param("mes") Integer mes,
                        @Param("anio") Integer anio);

        // Empleados con más tardanzas en el mes
        @Query("SELECT a.empleado.id, COUNT(a) as total FROM Asistencia a WHERE a.tipo = 'TARDANZA' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio GROUP BY a.empleado.id ORDER BY total DESC")
        List<Object[]> topEmpleadosTardanzasMensual(@Param("mes") Integer mes, @Param("anio") Integer anio,
                        Pageable pageable);

        // Empleados con más ausencias en el mes
        @Query("SELECT a.empleado.id, COUNT(a) as total FROM Asistencia a WHERE a.tipo = 'AUSENTE' AND MONTH(a.fecha) = :mes AND YEAR(a.fecha) = :anio GROUP BY a.empleado.id ORDER BY total DESC")
        List<Object[]> topEmpleadosAusenciasMensual(@Param("mes") Integer mes, @Param("anio") Integer anio,
                        Pageable pageable);

        // Asistencias pendientes de hoy (empleados que no marcaron entrada)
        @Query("SELECT COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO' AND e.id NOT IN (SELECT a.empleado.id FROM Asistencia a WHERE a.fecha = :fecha)")
        Long countEmpleadosSinMarcarHoy(@Param("fecha") LocalDate fecha);
}
