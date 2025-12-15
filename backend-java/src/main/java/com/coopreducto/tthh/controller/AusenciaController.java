package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.AusenciaDTO;
import com.coopreducto.tthh.service.AusenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ausencias")
@RequiredArgsConstructor
public class AusenciaController {

    private final AusenciaService ausenciaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<Page<AusenciaDTO>> getAllAusencias(Pageable pageable) {
        return ResponseEntity.ok(ausenciaService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA', 'COLABORADOR')")
    public ResponseEntity<AusenciaDTO> getAusenciaById(@PathVariable Long id) {
        return ResponseEntity.ok(ausenciaService.findById(id));
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA', 'COLABORADOR')")
    public ResponseEntity<Page<AusenciaDTO>> getAusenciasByEmpleado(
            @PathVariable Long empleadoId,
            Pageable pageable) {
        return ResponseEntity.ok(ausenciaService.findByEmpleadoId(empleadoId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TTHH', 'COLABORADOR')")
    public ResponseEntity<AusenciaDTO> createAusencia(@Valid @RequestBody AusenciaDTO ausenciaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ausenciaService.create(ausenciaDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<AusenciaDTO> updateAusencia(
            @PathVariable Long id,
            @Valid @RequestBody AusenciaDTO ausenciaDTO) {
        return ResponseEntity.ok(ausenciaService.update(id, ausenciaDTO));
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<AusenciaDTO> aprobarAusencia(@PathVariable Long id) {
        return ResponseEntity.ok(ausenciaService.aprobar(id));
    }

    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<AusenciaDTO> rechazarAusencia(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {
        return ResponseEntity.ok(ausenciaService.rechazar(id, motivo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<Void> deleteAusencia(@PathVariable Long id) {
        ausenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
