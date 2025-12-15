package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.ComunicadoDTO;
import java.util.List;

public interface ComunicadoService {

    List<ComunicadoDTO> findActiveForDepartamento(String departamento);

    List<ComunicadoDTO> findAll();

    ComunicadoDTO create(ComunicadoDTO comunicadoDTO);

    void delete(Long id);
}
