package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.ReciboSalarioDTO;
import com.coopreducto.tthh.service.ReciboSalarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final ReciboSalarioService reciboSalarioService;
    private final com.coopreducto.tthh.repository.UsuarioRepository usuarioRepository;

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .map(u -> u.getEmpleado() != null ? u.getEmpleado().getId() : null)
                .orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<Page<ReciboSalarioDTO>> getRecibos(
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer anio,
            Authentication authentication,
            Pageable pageable) {

        // Si es colaborador, solo puede ver sus propios recibos
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR"))) {
            empleadoId = getCurrentUserId(authentication);
            if (empleadoId == null) {
                return ResponseEntity.ok(org.springframework.data.domain.Page.empty());
            }
        }

        return ResponseEntity.ok(reciboSalarioService.findByEmpleadoAndAnio(empleadoId, anio, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<ReciboSalarioDTO> getReciboById(@PathVariable Long id) {
        return ResponseEntity.ok(reciboSalarioService.findById(id));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    @SuppressWarnings("null")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id) {
        Resource resource = reciboSalarioService.getPdfResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"recibo_" + id + ".pdf\"")
                .body(resource);
    }

    @GetMapping("/aguinaldo")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<java.math.BigDecimal> getAguinaldo(Authentication authentication) {
        Long empleadoId = null;
        // Si es colaborador, obtener su propio ID
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_COLABORADOR")) ||
                authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_GERENCIA"))
                ||
                authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_AUDITORIA"))) {
            empleadoId = getCurrentUserId(authentication);
        } else {
            // TTHH podría consultar de otros (futura mejora), por ahora retornamos el
            // propio o 0
            empleadoId = getCurrentUserId(authentication);
        }

        if (empleadoId == null) {
            return ResponseEntity.ok(java.math.BigDecimal.ZERO);
        }

        return ResponseEntity.ok(reciboSalarioService.calcularAguinaldoProyectado(empleadoId));
    }

    @PostMapping("/generar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> generarNomina(
            @RequestParam Integer anio,
            @RequestParam Integer mes) {
        reciboSalarioService.generarNominaMensual(anio, mes);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<ReciboSalarioDTO> createRecibo(@Valid @RequestBody ReciboSalarioDTO reciboDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reciboSalarioService.create(reciboDTO));
    }

    @PostMapping("/{id}/send-email")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<Void> sendReciboByEmail(@PathVariable Long id) {
        reciboSalarioService.sendByEmail(id);
        return ResponseEntity.ok().build();
    }
}
