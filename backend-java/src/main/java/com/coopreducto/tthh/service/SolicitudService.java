package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.SolicitudDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SolicitudService {

    Page<SolicitudDTO> findByFilters(Long empleadoId, String estado, String tipo, Pageable pageable);

    SolicitudDTO findById(Long id);

    SolicitudDTO create(SolicitudDTO solicitudDTO);

    SolicitudDTO update(Long id, SolicitudDTO solicitudDTO);

    SolicitudDTO aprobar(Long id, String respuesta);

    SolicitudDTO rechazar(Long id, String respuesta);

    void delete(Long id);

    Long countActiveByEmpleado(Long empleadoId);
}
