package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.AsistenciaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AsistenciaService {

    AsistenciaDTO registrarAsistencia(AsistenciaDTO asistenciaDTO);

    AsistenciaDTO actualizarAsistencia(Long id, AsistenciaDTO asistenciaDTO);

    void eliminarAsistencia(Long id);

    AsistenciaDTO obtenerPorId(Long id);

    Page<AsistenciaDTO> listarPorEmpleado(Long empleadoId, Pageable pageable);

    List<AsistenciaDTO> obtenerReporteMensual(Long empleadoId, int anio, int mes);

    Long contarTardanzas(Long empleadoId, int anio, int mes);

    Long contarAusencias(Long empleadoId, int anio, int mes);

    // Método para registrar entrada/salida rápida (marcado de reloj)
    AsistenciaDTO marcarReloj(Long empleadoId, String tipoMarca);

    AsistenciaDTO justificar(Long id, String motivo, String documentoUrl);
}
