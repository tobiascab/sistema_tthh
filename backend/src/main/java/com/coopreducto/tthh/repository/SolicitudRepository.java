package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long>, JpaSpecificationExecutor<Solicitud> {

    List<Solicitud> findByEmpleadoOrderByCreatedAtDesc(Empleado empleado);

    List<Solicitud> findByEmpleadoAndEstadoOrderByCreatedAtDesc(Empleado empleado, String estado);

    List<Solicitud> findByEmpleadoAndTipoOrderByCreatedAtDesc(Empleado empleado, String tipo);

    List<Solicitud> findByEstadoOrderByCreatedAtDesc(String estado);

    List<Solicitud> findByTipoAndEstadoOrderByCreatedAtDesc(String tipo, String estado);

    Long countByEmpleadoAndEstado(Empleado empleado, String estado);

    Long countByEstado(String estado);

    Long countByTipo(String tipo);

    List<Solicitud> findTop20ByOrderByCreatedAtDesc();

    List<Solicitud> findTop20ByEstadoOrderByCreatedAtDesc(String estado);
}
