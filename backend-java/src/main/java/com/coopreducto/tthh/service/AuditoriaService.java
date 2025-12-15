package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.AuditoriaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface AuditoriaService {

    Page<AuditoriaDTO> findAll(Pageable pageable);

    AuditoriaDTO findById(Long id);

    Page<AuditoriaDTO> findByUsuario(String usuario, Pageable pageable);

    Page<AuditoriaDTO> findByEntidad(String entidad, Pageable pageable);

    Page<AuditoriaDTO> findByFechaRango(LocalDateTime inicio, LocalDateTime fin, Pageable pageable);

    AuditoriaDTO create(AuditoriaDTO auditoriaDTO);

    void logAccion(String usuario, String accion, String entidad, Long entidadId, String detalles, String ipAddress,
            String userAgent);
}
