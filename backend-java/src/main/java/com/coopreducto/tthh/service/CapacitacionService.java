package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.CapacitacionDTO;
import com.coopreducto.tthh.dto.InscripcionDTO;
import java.util.List;

public interface CapacitacionService {
    List<CapacitacionDTO> getAll();

    CapacitacionDTO getById(Long id);

    CapacitacionDTO create(CapacitacionDTO dto);

    CapacitacionDTO update(Long id, CapacitacionDTO dto);

    void delete(Long id);

    InscripcionDTO inscribir(Long empleadoId, Long capacitacionId);

    void cancelarInscripcion(Long inscripcionId);

    List<InscripcionDTO> getInscripcionesPorEmpleado(Long empleadoId);

    boolean estaInscrito(Long empleadoId, Long capacitacionId);
}
