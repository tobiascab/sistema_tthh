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
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio,
            Authentication authentication,
            Pageable pageable) {

        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TTHH") || a.getAuthority().equals("ROLE_GERENCIA"));

        // Si NO es admin ni gerente, y es colaborador (o cualquier otro rol
        // restringido), solo puede ver sus propios recibos
        if (!isAdminOrManager) {
            empleadoId = getCurrentUserId(authentication);
            sucursal = null; // No filtrar por sucursal si es usuario normal
            if (empleadoId == null) {
                return ResponseEntity.ok(org.springframework.data.domain.Page.empty());
            }
        }

        return ResponseEntity.ok(reciboSalarioService.findByFilters(sucursal, empleadoId, mes, anio, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'COLABORADOR')")
    public ResponseEntity<ReciboSalarioDTO> getReciboById(@PathVariable Long id) {
        return ResponseEntity.ok(reciboSalarioService.findById(id));
    }

    @GetMapping("/{id}/pdf")
    @SuppressWarnings("null")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id, Authentication authentication) {
        org.slf4j.LoggerFactory.getLogger(PayrollController.class)
                .info("📥 Solicitud de descarga de PDF para recibo ID: {}", id);

        // Obtener usuario actual
        Long currentUserId = getCurrentUserId(authentication);
        org.slf4j.LoggerFactory.getLogger(PayrollController.class)
                .info("Usuario actual ID: {}", currentUserId);

        // Obtener el recibo para verificar permisos
        ReciboSalarioDTO recibo = reciboSalarioService.findById(id);

        // Verificar permisos: Admin puede ver todo, Colaborador solo sus recibos
        boolean isAdmin = hasRole("TTHH", authentication) || hasRole("GERENCIA", authentication);

        if (!isAdmin) {
            // Si no es admin, verificar que el recibo pertenece al empleado del usuario
            // actual
            if (!recibo.getEmpleadoId().equals(currentUserId)) {
                org.slf4j.LoggerFactory.getLogger(PayrollController.class)
                        .warn("⚠️ Usuario {} intentó acceder al recibo del empleado {}",
                                currentUserId, recibo.getEmpleadoId());
                throw new org.springframework.security.access.AccessDeniedException(
                        "No tiene permisos para acceder a este recibo");
            }
        }

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

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<com.coopreducto.tthh.dto.PayrollDashboardDTO> getSummary() {
        return ResponseEntity.ok(reciboSalarioService.getDashboardSummary());
    }

    @PostMapping("/cerrar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> cerrarNomina(
            @RequestParam Integer anio,
            @RequestParam Integer mes) {
        reciboSalarioService.cerrarNomina(anio, mes);
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

    @GetMapping("/exportar-planilla")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Resource> exportarPlanilla(
            @RequestParam Integer anio,
            @RequestParam Integer mes) {
        Resource resource = reciboSalarioService.exportarPlanillaBancaria(anio, mes);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"planilla_bancaria_" + mes + "_" + anio + ".xlsx\"")
                .body(resource);
    }

    @GetMapping("/exportar-excel")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Resource> exportarExcel(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio) {
        Resource resource = reciboSalarioService.exportarExcel(sucursal, empleadoId, mes, anio);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reporte_salarios.xlsx\"")
                .body(resource);
    }

    @GetMapping("/exportar-pdf")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Resource> exportarPdf(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio) {
        Resource resource = reciboSalarioService.exportarPdf(sucursal, empleadoId, mes, anio);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reporte_salarios.pdf\"")
                .body(resource);
    }

    // Método auxiliar para verificar roles
    private boolean hasRole(String role, Authentication authentication) { // Modified to accept Authentication
        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role) || auth.getAuthority().equals(role));
    }
}
