package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.RolDTO;
import java.util.List;

public interface RolService {
    List<RolDTO> getAll();

    List<RolDTO> getActivos();

    RolDTO getById(Long id);

    RolDTO getByNombre(String nombre);

    RolDTO create(RolDTO dto);

    RolDTO update(Long id, RolDTO dto);

    void delete(Long id);
}
