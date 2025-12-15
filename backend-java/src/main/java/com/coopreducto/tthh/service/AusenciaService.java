package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.AusenciaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AusenciaService {

    Page<AusenciaDTO> findAll(Pageable pageable);

    AusenciaDTO findById(Long id);

    Page<AusenciaDTO> findByEmpleadoId(Long empleadoId, Pageable pageable);

    AusenciaDTO create(AusenciaDTO ausenciaDTO);

    AusenciaDTO update(Long id, AusenciaDTO ausenciaDTO);

    AusenciaDTO aprobar(Long id);

    AusenciaDTO rechazar(Long id, String motivo);

    void delete(Long id);
}
