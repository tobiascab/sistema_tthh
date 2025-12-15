package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.Habilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabilidadRepository extends JpaRepository<Habilidad, Long> {

    List<Habilidad> findByEmpleadoOrderByNivelDesc(Empleado empleado);

    List<Habilidad> findByEmpleadoAndTipo(Empleado empleado, String tipo);

    @Query("SELECT h FROM Habilidad h WHERE h.empleado = :empleado AND h.tipo = 'TECNICA' ORDER BY h.nivel DESC")
    List<Habilidad> findHabilidadesTecnicasByEmpleado(Empleado empleado);

    @Query("SELECT h FROM Habilidad h WHERE h.empleado = :empleado AND h.tipo = 'BLANDA' ORDER BY h.nivel DESC")
    List<Habilidad> findHabilidadesBlandasByEmpleado(Empleado empleado);

    Long countByEmpleadoAndNivelGreaterThanEqual(Empleado empleado, Integer nivel);
}
