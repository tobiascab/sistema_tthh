package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Ausencia;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AusenciaRepository extends JpaRepository<Ausencia, Long>, JpaSpecificationExecutor<Ausencia> {

    @Query("SELECT a FROM Ausencia a WHERE a.empleado = :empleado")
    Page<Ausencia> findByEmpleado(@Param("empleado") Empleado empleado, Pageable pageable);

    Long countByEstado(String estado);

    @Query("SELECT a FROM Ausencia a WHERE a.estado = :estado ORDER BY a.createdAt DESC")
    List<Ausencia> findTop20ByEstadoOrderByCreatedAtDesc(@Param("estado") String estado, Pageable pageable);

    List<Ausencia> findByEstado(String estado);

    List<Ausencia> findByEmpleadoAndEstado(Empleado empleado, String estado);

    List<Ausencia> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);

    List<Ausencia> findByTipo(String tipo);
}
