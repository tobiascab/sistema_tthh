package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.FormacionAcademica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormacionAcademicaRepository extends JpaRepository<FormacionAcademica, Long> {

    List<FormacionAcademica> findByEmpleadoOrderByFechaFinalizacionDesc(Empleado empleado);

    List<FormacionAcademica> findByEmpleadoAndNivelOrderByFechaFinalizacionDesc(Empleado empleado, String nivel);

    List<FormacionAcademica> findByEstado(String estado);

    Long countByEmpleadoAndEstado(Empleado empleado, String estado);
}
