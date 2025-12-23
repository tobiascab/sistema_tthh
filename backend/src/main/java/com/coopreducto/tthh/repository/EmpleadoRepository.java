package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Empleado;
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
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

        // ========================================
        // BÚSQUEDAS BÁSICAS
        // ========================================

        Optional<Empleado> findByNumeroDocumento(String numeroDocumento);

        Optional<Empleado> findByNumeroSocio(String numeroSocio);

        Optional<Empleado> findByEmail(String email);

        List<Empleado> findByEstado(String estado);

        Long countByEstado(String estado);

        // ========================================
        // BÚSQUEDAS POR CRITERIOS
        // ========================================

        List<Empleado> findBySucursal(String sucursal);

        List<Empleado> findByArea(String area);

        List<Empleado> findByCargo(String cargo);

        Page<Empleado> findByEstado(String estado, Pageable pageable);

        Page<Empleado> findBySucursal(String sucursal, Pageable pageable);

        Page<Empleado> findByArea(String area, Pageable pageable);

        // ========================================
        // BÚSQUEDA AVANZADA
        // ========================================

        @Query("SELECT e FROM Empleado e WHERE " +
                        "LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.numeroSocio) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))")
        Page<Empleado> searchEmpleados(@Param("search") String search, Pageable pageable);

        @Query("SELECT e FROM Empleado e WHERE " +
                        "(:estado IS NULL OR e.estado = :estado) AND " +
                        "(:sucursal IS NULL OR e.sucursal = :sucursal) AND " +
                        "(:area IS NULL OR e.area = :area) AND " +
                        "(:cargo IS NULL OR e.cargo = :cargo) AND " +
                        "(:search IS NULL OR " +
                        "LOWER(e.nombres) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(e.numeroDocumento) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<Empleado> findByFilters(
                        @Param("estado") String estado,
                        @Param("sucursal") String sucursal,
                        @Param("area") String area,
                        @Param("cargo") String cargo,
                        @Param("search") String search,
                        Pageable pageable);

        // ========================================
        // CONSULTAS ESPECIALES
        // ========================================

        // Empleados próximos a cumplir años (este mes)
        @Query("SELECT e FROM Empleado e WHERE " +
                        "MONTH(e.fechaNacimiento) = MONTH(CURRENT_DATE) AND " +
                        "e.estado = 'ACTIVO' " +
                        "ORDER BY DAY(e.fechaNacimiento)")
        List<Empleado> findCumpleaniosDelMes();

        @Query(value = "SELECT * FROM empleados e WHERE e.estado = 'ACTIVO' " +
                        "ORDER BY " +
                        "CASE " +
                        "  WHEN (MONTH(e.fecha_nacimiento) > MONTH(CURRENT_DATE)) OR (MONTH(e.fecha_nacimiento) = MONTH(CURRENT_DATE) AND DAY(e.fecha_nacimiento) >= DAY(CURRENT_DATE)) THEN 0 "
                        +
                        "  ELSE 1 " +
                        "END, " +
                        "MONTH(e.fecha_nacimiento), DAY(e.fecha_nacimiento) " +
                        "LIMIT :limit", nativeQuery = true)
        List<Empleado> findProximosCumpleanios(@Param("limit") int limit);

        // Aniversarios laborales (este mes)
        @Query("SELECT e FROM Empleado e WHERE " +
                        "MONTH(e.fechaIngreso) = MONTH(CURRENT_DATE) AND " +
                        "e.estado = 'ACTIVO' " +
                        "ORDER BY DAY(e.fechaIngreso)")
        List<Empleado> findAniversariosDelMes();

        // Contratos próximos a vencer (próximos 30 días)
        @Query("SELECT e FROM Empleado e WHERE " +
                        "e.fechaFinContrato IS NOT NULL AND " +
                        "e.fechaFinContrato BETWEEN CURRENT_DATE AND :fecha AND " +
                        "e.estado = 'ACTIVO'")
        List<Empleado> findContratosProximosAVencer(@Param("fecha") LocalDate fecha);

        // Empleados sin examen médico reciente (más de 1 año)
        @Query("SELECT e FROM Empleado e WHERE " +
                        "e.estado = 'ACTIVO' AND " +
                        "(e.fechaUltimoExamenMedico IS NULL OR " +
                        "e.fechaUltimoExamenMedico < :fechaLimite)")
        List<Empleado> findEmpleadosSinExamenMedicoReciente(@Param("fechaLimite") LocalDate fechaLimite);

        // Empleados con vacaciones disponibles
        @Query("SELECT e FROM Empleado e WHERE " +
                        "e.estado = 'ACTIVO' AND " +
                        "e.diasVacacionesDisponibles > 0 " +
                        "ORDER BY e.diasVacacionesDisponibles DESC")
        List<Empleado> findEmpleadosConVacacionesDisponibles();

        // ========================================
        // ESTADÍSTICAS
        // ========================================

        @Query("SELECT COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO'")
        Long countActivos();

        @Query("SELECT COUNT(e) FROM Empleado e WHERE e.estado = 'INACTIVO'")
        Long countInactivos();

        @Query("SELECT e.sucursal, COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO' GROUP BY e.sucursal")
        List<Object[]> countBySucursal();

        @Query("SELECT e.area, COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO' GROUP BY e.area")
        List<Object[]> countByArea();

        @Query("SELECT e.cargo, COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO' GROUP BY e.cargo")
        List<Object[]> countByCargo();

        @Query("SELECT e.genero, COUNT(e) FROM Empleado e WHERE e.estado = 'ACTIVO' GROUP BY e.genero")
        List<Object[]> countByGenero();

        // Edad promedio
        @Query("SELECT AVG(YEAR(CURRENT_DATE) - YEAR(e.fechaNacimiento)) FROM Empleado e WHERE e.estado = 'ACTIVO'")
        Double getEdadPromedio();

        // Antigüedad promedio
        @Query("SELECT AVG(YEAR(CURRENT_DATE) - YEAR(e.fechaIngreso)) FROM Empleado e WHERE e.estado = 'ACTIVO'")
        Double getAntiguedadPromedio();

        // Salario promedio
        @Query("SELECT AVG(e.salario) FROM Empleado e WHERE e.estado = 'ACTIVO'")
        Double getSalarioPromedio();

        // ========================================
        // VALIDACIONES
        // ========================================

        boolean existsByNumeroDocumento(String numeroDocumento);

        boolean existsByNumeroSocio(String numeroSocio);

        boolean existsByEmail(String email);

        @Query("SELECT COUNT(e) > 0 FROM Empleado e WHERE " +
                        "e.numeroDocumento = :numeroDocumento AND " +
                        "e.id != :empleadoId")
        boolean existsByNumeroDocumentoAndIdNot(
                        @Param("numeroDocumento") String numeroDocumento,
                        @Param("empleadoId") Long empleadoId);

        @Query("SELECT COUNT(e) > 0 FROM Empleado e WHERE " +
                        "e.email = :email AND " +
                        "e.id != :empleadoId")
        boolean existsByEmailAndIdNot(
                        @Param("email") String email,
                        @Param("empleadoId") Long empleadoId);

        // Performance Optimization for Demographics
        long countByFechaNacimientoBetweenAndEstado(@Param("start") LocalDate start, @Param("end") LocalDate end,
                        @Param("estado") String estado);

        long countByFechaNacimientoBeforeAndEstado(@Param("date") LocalDate date, @Param("estado") String estado);

        long countByFechaNacimientoAfterAndEstado(@Param("date") LocalDate date, @Param("estado") String estado);

        @Query("SELECT SUM(e.salario) FROM Empleado e WHERE e.estado = :estado")
        java.math.BigDecimal sumSalarioByEstado(@Param("estado") String estado);
}
