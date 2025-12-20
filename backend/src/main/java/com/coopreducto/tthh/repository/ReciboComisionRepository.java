package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.ReciboComision;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReciboComisionRepository
        extends JpaRepository<ReciboComision, Long>, JpaSpecificationExecutor<ReciboComision> {

    Page<ReciboComision> findByEmpleadoIdAndAnio(Long empleadoId, Integer anio, Pageable pageable);

    @Query("SELECT r FROM ReciboComision r WHERE r.empleado.id = :empleadoId AND r.anio = :anio AND r.mes = :mes")
    Optional<ReciboComision> findByEmpleadoIdAndAnioAndMes(@Param("empleadoId") Long empleadoId,
            @Param("anio") Integer anio, @Param("mes") Integer mes);

    List<ReciboComision> findByAnioAndMes(Integer anio, Integer mes);

    @Query("SELECT r FROM ReciboComision r WHERE r.empleado.id = :empleadoId ORDER BY r.anio DESC, r.mes DESC")
    List<ReciboComision> findTopByEmpleadoIdOrderByAnioDescMesDesc(@Param("empleadoId") Long empleadoId,
            Pageable pageable);
}
