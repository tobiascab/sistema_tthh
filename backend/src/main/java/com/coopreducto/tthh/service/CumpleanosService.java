package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.ConfiguracionDTO;
import com.coopreducto.tthh.dto.CumpleanosManualDTO;

import java.util.List;

public interface CumpleanosService {

    // Configuración
    ConfiguracionDTO getConfiguracion();

    ConfiguracionDTO setConfiguracion(String valor); // EMPLOYEES | MANUAL

    // Gestión Manual
    List<CumpleanosManualDTO> getAllManual();

    CumpleanosManualDTO createManual(CumpleanosManualDTO dto);

    void deleteManual(Long id);

    // Fetch para Dashboard (Resuelve la lógica interna: Fichas vs Manual)
    List<CumpleanosManualDTO> getCumpleanosDelMes();

    List<CumpleanosManualDTO> getProximos(int limit);
}
