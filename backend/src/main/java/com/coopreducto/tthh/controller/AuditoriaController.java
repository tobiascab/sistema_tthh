package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.AuditoriaDTO;
import com.coopreducto.tthh.service.AuditoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auditoria")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'AUDITORIA')")
    public ResponseEntity<Page<AuditoriaDTO>> getAllAuditorias(Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'AUDITORIA')")
    public ResponseEntity<AuditoriaDTO> getAuditoriaById(@PathVariable Long id) {
        return ResponseEntity.ok(auditoriaService.findById(id));
    }

    @GetMapping("/usuario/{usuario}")
    @PreAuthorize("hasAnyRole('TTHH', 'AUDITORIA')")
    public ResponseEntity<Page<AuditoriaDTO>> getAuditoriasByUsuario(
            @PathVariable String usuario,
            Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.findByUsuario(usuario, pageable));
    }

    @GetMapping("/entidad/{entidad}")
    @PreAuthorize("hasAnyRole('TTHH', 'AUDITORIA')")
    public ResponseEntity<Page<AuditoriaDTO>> getAuditoriasByEntidad(
            @PathVariable String entidad,
            Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.findByEntidad(entidad, pageable));
    }

    @GetMapping("/fecha-rango")
    @PreAuthorize("hasAnyRole('TTHH', 'AUDITORIA')")
    public ResponseEntity<Page<AuditoriaDTO>> getAuditoriasByFechaRango(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin,
            Pageable pageable) {
        return ResponseEntity.ok(auditoriaService.findByFechaRango(inicio, fin, pageable));
    }

    @PostMapping
    public ResponseEntity<AuditoriaDTO> createAuditoria(@Valid @RequestBody AuditoriaDTO auditoriaDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auditoriaService.create(auditoriaDTO));
    }
}
