package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Documento;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

        // Búsquedas por Empleado
        List<Documento> findByEmpleadoOrderByCreatedAtDesc(Empleado empleado);

        Page<Documento> findByEmpleado(Empleado empleado, Pageable pageable);

        List<Documento> findByEmpleadoAndCategoria(Empleado empleado, String categoria);

        Long countByEmpleado(Empleado empleado);

        // Búsquedas por Categoría y Estado
        List<Documento> findByCategoria(String categoria);

        List<Documento> findByEstado(String estado);

        Page<Documento> findByEstado(String estado, Pageable pageable);

        // Búsqueda por versión
        List<Documento> findByDocumentoPadreId(Long documentoPadreId);

        @Query("SELECT MAX(d.version) FROM Documento d WHERE d.documentoPadreId = :documentoPadreId OR d.id = :documentoPadreId")
        Integer findMaxVersion(@Param("documentoPadreId") Long documentoPadreId);

        // Documentos pendientes de aprobación
        @Query("SELECT d FROM Documento d WHERE d.requiereAprobacion = true AND d.estaAprobado = false ORDER BY d.createdAt DESC")
        List<Documento> findPendientesAprobacion();

        List<Documento> findByRequiereAprobacionTrueAndEstaAprobadoFalse();

        // Documentos vencidos o próximos a vencer
        @Query("SELECT d FROM Documento d WHERE d.fechaVencimiento IS NOT NULL AND d.fechaVencimiento < CURRENT_DATE")
        List<Documento> findVencidos();

        @Query("SELECT d FROM Documento d WHERE " +
                        "d.fechaVencimiento IS NOT NULL AND " +
                        "d.fechaVencimiento BETWEEN CURRENT_DATE AND :fechaLimite AND " +
                        "d.alertaEnviada = false")
        List<Documento> findProximosAVencer(@Param("fechaLimite") LocalDate fechaLimite);

        // Documentos obligatorios faltantes
        @Query("SELECT d.tipo FROM Documento d WHERE d.esObligatorio = true GROUP BY d.tipo")
        List<String> findTiposObligatorios();

        // Búsqueda por empleado y documentos obligatorios faltantes
        @Query("SELECT tipo FROM Documento WHERE esObligatorio = true " +
                        "AND tipo NOT IN (SELECT d.tipo FROM Documento d WHERE d.empleado = :empleado)")
        List<String> findDocumentosObligatoriosFaltantes(@Param("empleado") Empleado empleado);

        // Estadísticas
        Long countByCategoria(String categoria);

        Long countByEstado(String estado);

        @Query("SELECT d.categoria, COUNT(d) FROM Documento d GROUP BY d.categoria")
        List<Object[]> countByCategoria();

        // Búsqueda avanzada
        @Query("SELECT d FROM Documento d WHERE " +
                        "(:empleadoId IS NULL OR d.empleado.id = :empleadoId) AND " +
                        "(:categoria IS NULL OR d.categoria = :categoria) AND " +
                        "(:estado IS NULL OR d.estado = :estado) AND " +
                        "(:search IS NULL OR " +
                        "LOWER(d.nombre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(d.descripcion) LIKE LOWER(CONCAT('%', :search, '%')))")
        Page<Documento> findByFilters(
                        @Param("empleadoId") Long empleadoId,
                        @Param("categoria") String categoria,
                        @Param("estado") String estado,
                        @Param("search") String search,
                        Pageable pageable);

        // Validaciones
        boolean existsByEmpleadoAndNombre(Empleado empleado, String nombre);

        @Query("SELECT COUNT(d) > 0 FROM Documento d WHERE " +
                        "d.empleado = :empleado AND " +
                        "d.nombre = :nombre AND " +
                        "d.id != :documentoId")
        boolean existsByEmpleadoAndNombreAndIdNot(
                        @Param("empleado") Empleado empleado,
                        @Param("nombre") String nombre,
                        @Param("documentoId") Long documentoId);
}
