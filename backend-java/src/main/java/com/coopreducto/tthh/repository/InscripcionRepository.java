package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.InscripcionCapacitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscripcionRepository extends JpaRepository<InscripcionCapacitacion, Long> {
    List<InscripcionCapacitacion> findByEmpleadoId(Long empleadoId);
    List<InscripcionCapacitacion> findByCapacitacionId(Long capacitacionId);
    Optional<InscripcionCapacitacion> findByEmpleadoIdAndCapacitacionId(Long empleadoId, Long capacitacionId);
    boolean existsByEmpleadoIdAndCapacitacionIdAndEstado(Long empleadoId, Long capacitacionId, String estado);
}