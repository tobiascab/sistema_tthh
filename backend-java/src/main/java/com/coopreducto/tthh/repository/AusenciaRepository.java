package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Ausencia;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AusenciaRepository extends JpaRepository<Ausencia, Long>, JpaSpecificationExecutor<Ausencia> {

    List<Ausencia> findByEmpleado(Empleado empleado);

    List<Ausencia> findByEstado(String estado);

    List<Ausencia> findByEmpleadoAndEstado(Empleado empleado, String estado);

    List<Ausencia> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);

    List<Ausencia> findByTipo(String tipo);
}
