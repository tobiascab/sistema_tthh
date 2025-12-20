package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.AsistenciaDTO;
import com.coopreducto.tthh.service.AsistenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asistencia")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @PostMapping
    public ResponseEntity<AsistenciaDTO> registrar(@RequestBody AsistenciaDTO dto) {
        return ResponseEntity.ok(asistenciaService.registrarAsistencia(dto));
    }

    @GetMapping
    public ResponseEntity<Page<AsistenciaDTO>> listarTodas(Pageable pageable) {
        return ResponseEntity.ok(asistenciaService.listarTodas(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsistenciaDTO> actualizar(@PathVariable Long id, @RequestBody AsistenciaDTO dto) {
        return ResponseEntity.ok(asistenciaService.actualizarAsistencia(id, dto));
    }

    @GetMapping("/empleado/{empleadoId}")
    public ResponseEntity<Page<AsistenciaDTO>> listarPorEmpleado(
            @PathVariable Long empleadoId,
            Pageable pageable) {
        return ResponseEntity.ok(asistenciaService.listarPorEmpleado(empleadoId, pageable));
    }

    @GetMapping("/reporte/{empleadoId}")
    public ResponseEntity<List<AsistenciaDTO>> obtenerReporteMensual(
            @PathVariable Long empleadoId,
            @RequestParam int anio,
            @RequestParam int mes) {
        return ResponseEntity.ok(asistenciaService.obtenerReporteMensual(empleadoId, anio, mes));
    }

    @GetMapping("/estadisticas/{empleadoId}")
    public ResponseEntity<Map<String, Long>> obtenerEstadisticas(
            @PathVariable Long empleadoId,
            @RequestParam int anio,
            @RequestParam int mes) {
        return ResponseEntity.ok(Map.of(
                "tardanzas", asistenciaService.contarTardanzas(empleadoId, anio, mes),
                "ausencias", asistenciaService.contarAusencias(empleadoId, anio, mes)));
    }

    @PostMapping("/marcar")
    public ResponseEntity<AsistenciaDTO> marcarReloj(@RequestParam Long empleadoId) {
        return ResponseEntity.ok(asistenciaService.marcarReloj(empleadoId, "AUTO"));
    }

    @PutMapping("/{id}/justificar")
    public ResponseEntity<AsistenciaDTO> justificar(
            @PathVariable Long id,
            @RequestParam String motivo,
            @RequestParam(required = false) String documentoUrl) {
        return ResponseEntity.ok(asistenciaService.justificar(id, motivo, documentoUrl));
    }

    @GetMapping("/reporte-global")
    public ResponseEntity<com.coopreducto.tthh.dto.AttendanceGlobalReportDTO> obtenerReporteGlobal(
            @RequestParam int anio,
            @RequestParam int mes) {
        return ResponseEntity.ok(asistenciaService.obtenerReporteGlobal(anio, mes));
    }
}
