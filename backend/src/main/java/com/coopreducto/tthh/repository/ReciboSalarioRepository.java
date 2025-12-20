package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.ReciboSalario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReciboSalarioRepository
        extends JpaRepository<ReciboSalario, Long>, JpaSpecificationExecutor<ReciboSalario> {

    Page<ReciboSalario> findByEmpleado(Empleado empleado, Pageable pageable);

    Page<ReciboSalario> findByEmpleadoAndAnio(Empleado empleado, Integer anio, Pageable pageable);

    List<ReciboSalario> findByEmpleadoOrderByAnioDescMesDesc(Empleado empleado);

    List<ReciboSalario> findByEmpleadoAndAnioOrderByMesDesc(Empleado empleado, Integer anio);

    Optional<ReciboSalario> findByEmpleadoAndAnioAndMes(Empleado empleado, Integer anio, Integer mes);

    List<ReciboSalario> findByAnioAndMes(Integer anio, Integer mes);

    List<ReciboSalario> findByEstado(String estado);

    Page<ReciboSalario> findByAnio(Integer anio, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT r.anio, r.mes, COUNT(r), SUM(r.salarioNeto), MAX(r.estado), MAX(r.createdAt) FROM ReciboSalario r GROUP BY r.anio, r.mes ORDER BY r.anio DESC, r.mes DESC")
    List<Object[]> findPayrollRuns();
}
