package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.CertificacionProfesional;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CertificacionProfesionalRepository extends JpaRepository<CertificacionProfesional, Long> {

    List<CertificacionProfesional> findByEmpleadoOrderByFechaObtencionDesc(Empleado empleado);

    List<CertificacionProfesional> findByEmpleadoAndVigenteTrue(Empleado empleado);

    @Query("SELECT c FROM CertificacionProfesional c WHERE c.fechaVencimiento IS NOT NULL " +
            "AND c.fechaVencimiento BETWEEN :fechaInicio AND :fechaFin " +
            "AND c.alertaEnviada = false")
    List<CertificacionProfesional> findProximasAVencer(
            @org.springframework.data.repository.query.Param("fechaInicio") LocalDate fechaInicio,
            @org.springframework.data.repository.query.Param("fechaFin") LocalDate fechaFin);

    Long countByEmpleadoAndVigenteTrue(Empleado empleado);
}
