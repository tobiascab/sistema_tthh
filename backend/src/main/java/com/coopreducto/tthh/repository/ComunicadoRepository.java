package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComunicadoRepository extends JpaRepository<Comunicado, Long> {

    List<Comunicado> findByActivoTrueOrderByFechaPublicacionDesc();

    List<Comunicado> findByActivoTrueAndDepartamentoDestinoOrderByFechaPublicacionDesc(String departamento);

    @Query("SELECT c FROM Comunicado c WHERE c.activo = true AND " +
            "(c.departamentoDestino IS NULL OR c.departamentoDestino = :departamento) AND " +
            "(c.fechaExpiracion IS NULL OR c.fechaExpiracion > :now) " +
            "ORDER BY c.prioridad DESC, c.fechaPublicacion DESC")
    List<Comunicado> findActiveComunicadosForDepartamento(String departamento, LocalDateTime now);

    List<Comunicado> findByTipoAndActivoTrueOrderByFechaPublicacionDesc(String tipo);
}
