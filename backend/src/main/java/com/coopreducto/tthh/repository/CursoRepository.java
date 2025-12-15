package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Curso;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    List<Curso> findByEmpleadoOrderByFechaFinalizacionDesc(Empleado empleado);

    List<Curso> findByEmpleadoAndCategoriaOrderByFechaFinalizacionDesc(Empleado empleado, String categoria);

    List<Curso> findByEstado(String estado);

    Long countByEmpleadoAndAprobado(Empleado empleado, Boolean aprobado);
}
