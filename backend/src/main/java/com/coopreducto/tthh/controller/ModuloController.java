package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.ModuloDTO;
import com.coopreducto.tthh.service.ModuloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/modulos")
@RequiredArgsConstructor
public class ModuloController {

    private final ModuloService moduloService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR', 'AUDITORIA')")
    public ResponseEntity<List<ModuloDTO>> listarModulos() {
        return ResponseEntity.ok(moduloService.listarActivos());
    }

    @GetMapping("/todos")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<List<ModuloDTO>> listarTodos() {
        return ResponseEntity.ok(moduloService.listarTodos());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<ModuloDTO> obtenerModulo(@PathVariable Long id) {
        return ResponseEntity.ok(moduloService.obtenerPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<ModuloDTO> crear(@RequestBody ModuloDTO moduloDTO) {
        ModuloDTO created = moduloService.crear(moduloDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<ModuloDTO> actualizar(@PathVariable Long id, @RequestBody ModuloDTO moduloDTO) {
        return ResponseEntity.ok(moduloService.actualizar(id, moduloDTO));
    }

    // ========================================
    // GESTIÓN DE PERMISOS POR EMPLEADO
    // ========================================

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA') or @moduloServiceImpl.tieneAccesoSelf(#empleadoId)")
    public ResponseEntity<List<ModuloDTO>> obtenerModulosEmpleado(@PathVariable Long empleadoId) {
        return ResponseEntity.ok(moduloService.obtenerModulosEmpleado(empleadoId));
    }

    @PostMapping("/empleado/{empleadoId}/asignar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> asignarModulos(
            @PathVariable Long empleadoId,
            @RequestBody List<Long> moduloIds) {
        moduloService.asignarModulosMultiples(empleadoId, moduloIds);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/empleado/{empleadoId}/sincronizar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> sincronizarModulos(
            @PathVariable Long empleadoId,
            @RequestBody List<Long> moduloIds) {
        moduloService.sincronizarModulosEmpleado(empleadoId, moduloIds);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/empleado/{empleadoId}/modulo/{moduloId}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> quitarModulo(
            @PathVariable Long empleadoId,
            @PathVariable Long moduloId) {
        moduloService.quitarModulo(empleadoId, moduloId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/empleado/{empleadoId}/tiene-acceso/{codigoModulo}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA') or @moduloServiceImpl.tieneAccesoSelf(#empleadoId)")
    public ResponseEntity<Map<String, Boolean>> verificarAcceso(
            @PathVariable Long empleadoId,
            @PathVariable String codigoModulo) {
        boolean tieneAcceso = moduloService.tieneAccesoModulo(empleadoId, codigoModulo);
        return ResponseEntity.ok(Map.of("tieneAcceso", tieneAcceso));
    }
}
