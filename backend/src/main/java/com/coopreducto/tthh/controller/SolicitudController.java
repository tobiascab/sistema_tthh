package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.SolicitudDTO;
import com.coopreducto.tthh.service.SolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;
    private final com.coopreducto.tthh.repository.UsuarioRepository usuarioRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .map(u -> u.getEmpleado() != null ? u.getEmpleado().getId() : null)
                .orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<Page<SolicitudDTO>> getSolicitudes(
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String tipo,
            Authentication authentication,
            Pageable pageable) {

        // Si es colaborador, solo puede ver sus propias solicitudes
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            empleadoId = getCurrentUserId(authentication);
            if (empleadoId == null) {
                return ResponseEntity.ok(Page.empty());
            }
        }

        return ResponseEntity.ok(solicitudService.findByFilters(empleadoId, estado, tipo, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<SolicitudDTO> getSolicitudById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(solicitudService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TTHH', 'COLABORADOR')")
    public ResponseEntity<SolicitudDTO> createSolicitud(
            @Valid @RequestBody SolicitudDTO solicitudDTO,
            Authentication authentication) {

        // Si es colaborador, forzar que la solicitud sea para él mismo
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            Long currentEmpleadoId = getCurrentUserId(authentication);
            if (currentEmpleadoId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            solicitudDTO.setEmpleadoId(currentEmpleadoId);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solicitudService.create(solicitudDTO));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<SolicitudDTO> updateSolicitud(
            @PathVariable("id") Long id,
            @Valid @RequestBody SolicitudDTO solicitudDTO) {
        return ResponseEntity.ok(solicitudService.update(id, solicitudDTO));
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<SolicitudDTO> aprobarSolicitud(
            @PathVariable("id") Long id,
            @RequestParam(value = "respuesta", required = false) String respuesta) {
        return ResponseEntity.ok(solicitudService.aprobar(id, respuesta));
    }

    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<SolicitudDTO> rechazarSolicitud(
            @PathVariable("id") Long id,
            @RequestParam(value = "respuesta", required = false) String respuesta) {
        return ResponseEntity.ok(solicitudService.rechazar(id, respuesta));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<Void> deleteSolicitud(@PathVariable("id") Long id) {
        solicitudService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
