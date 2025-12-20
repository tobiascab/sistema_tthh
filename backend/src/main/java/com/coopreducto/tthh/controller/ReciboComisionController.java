package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.ReciboComisionDTO;
import com.coopreducto.tthh.service.ReciboComisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comisiones")
@RequiredArgsConstructor
public class ReciboComisionController {

    private final ReciboComisionService reciboComisionService;
    private final com.coopreducto.tthh.repository.UsuarioRepository usuarioRepository;

    private Long getCurrentUserId(org.springframework.security.core.Authentication authentication) {
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .map(u -> u.getEmpleado() != null ? u.getEmpleado().getId() : null)
                .orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ASESOR_DE_CREDITO', 'JUDICIAL', 'RECUPERADOR_DE_CREDITO', 'COBRANZAS')")
    public ResponseEntity<Page<ReciboComisionDTO>> getComisiones(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio,
            org.springframework.security.core.Authentication authentication,
            Pageable pageable) {

        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TTHH") || a.getAuthority().equals("ROLE_GERENCIA"));

        if (!isAdminOrManager) {
            empleadoId = getCurrentUserId(authentication);
            sucursal = null;
            if (empleadoId == null) {
                return ResponseEntity.ok(org.springframework.data.domain.Page.empty());
            }
        }

        return ResponseEntity.ok(reciboComisionService.findByFilters(sucursal, empleadoId, mes, anio, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ASESOR_DE_CREDITO', 'JUDICIAL', 'RECUPERADOR_DE_CREDITO', 'COBRANZAS')")
    public ResponseEntity<ReciboComisionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reciboComisionService.findById(id));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ASESOR_DE_CREDITO', 'JUDICIAL', 'RECUPERADOR_DE_CREDITO', 'COBRANZAS')")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long id) {
        Resource resource = reciboComisionService.getPdfResource(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"comision_" + id + ".pdf\"")
                .body(resource);
    }

    @PostMapping("/generar")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> generarComisiones(
            @RequestParam Integer anio,
            @RequestParam Integer mes) {
        reciboComisionService.generarComisionesMensuales(anio, mes);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exportar-excel")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Resource> exportarExcel(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio) {
        Resource resource = reciboComisionService.exportarExcel(sucursal, empleadoId, mes, anio);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reporte_comisiones.xlsx\"")
                .body(resource);
    }

    @GetMapping("/exportar-pdf")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Resource> exportarPdf(
            @RequestParam(required = false) String sucursal,
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer anio) {
        Resource resource = reciboComisionService.exportarPdf(sucursal, empleadoId, mes, anio);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"reporte_comisiones.pdf\"")
                .body(resource);
    }
}
