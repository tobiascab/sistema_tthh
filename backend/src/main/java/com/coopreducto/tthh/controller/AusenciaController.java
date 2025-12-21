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
    private final com.coopreducto.tthh.repository.UsuarioRepository usuarioRepository;

    private Long getCurrentUserId(org.springframework.security.core.Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .map(u -> u.getEmpleado() != null ? u.getEmpleado().getId() : null)
                .orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<Page<AusenciaDTO>> getAllAusencias(Pageable pageable) {
        return ResponseEntity.ok(ausenciaService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA', 'COLABORADOR')")
    public ResponseEntity<AusenciaDTO> getAusenciaById(@PathVariable Long id,
            org.springframework.security.core.Authentication authentication) {

        AusenciaDTO ausencia = ausenciaService.findById(id);

        // Validate access for collaborators
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            Long currentEmpleadoId = getCurrentUserId(authentication);
            if (currentEmpleadoId == null || !currentEmpleadoId.equals(ausencia.getEmpleadoId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(ausencia);
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA', 'COLABORADOR')")
    public ResponseEntity<Page<AusenciaDTO>> getAusenciasByEmpleado(
            @PathVariable Long empleadoId,
            Pageable pageable,
            org.springframework.security.core.Authentication authentication) {

        // Validate access for collaborators
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            Long currentEmpleadoId = getCurrentUserId(authentication);
            if (currentEmpleadoId == null || !currentEmpleadoId.equals(empleadoId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(ausenciaService.findByEmpleadoId(empleadoId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TTHH', 'COLABORADOR')")
    public ResponseEntity<AusenciaDTO> createAusencia(
            @Valid @RequestBody AusenciaDTO ausenciaDTO,
            org.springframework.security.core.Authentication authentication) {

        // For collaborators, force own employee ID
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            Long currentEmpleadoId = getCurrentUserId(authentication);
            if (currentEmpleadoId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            ausenciaDTO.setEmpleadoId(currentEmpleadoId);
        }

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
    @PreAuthorize("hasAnyRole('TTHH', 'COLABORADOR')")
    public ResponseEntity<Void> deleteAusencia(@PathVariable Long id,
            org.springframework.security.core.Authentication authentication) {
        // If collaborator, validate ownership and pending status
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            Long currentEmpleadoId = getCurrentUserId(authentication);
            if (currentEmpleadoId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            AusenciaDTO ausencia = ausenciaService.findById(id);
            if (!currentEmpleadoId.equals(ausencia.getEmpleadoId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            if (!"PENDIENTE".equals(ausencia.getEstado())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
        }

        ausenciaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
