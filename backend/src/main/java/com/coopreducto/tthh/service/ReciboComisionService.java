package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.ReciboComisionDTO;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReciboComisionService {

    Page<ReciboComisionDTO> findByEmpleadoAndAnio(Long empleadoId, Integer anio, Pageable pageable);

    Page<ReciboComisionDTO> findByFilters(String sucursal, Long empleadoId, Integer mes, Integer anio,
            Pageable pageable);

    ReciboComisionDTO findById(Long id);

    ReciboComisionDTO create(ReciboComisionDTO dto);

    Resource getPdfResource(Long id);

    Resource exportarExcel(String sucursal, Long empleadoId, Integer mes, Integer anio);

    Resource exportarPdf(String sucursal, Long empleadoId, Integer mes, Integer anio);

    void generarComisionesMensuales(Integer anio, Integer mes);

    void cerrarComisiones(Integer anio, Integer mes);
}
