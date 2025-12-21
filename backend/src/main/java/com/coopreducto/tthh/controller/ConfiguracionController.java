package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.service.ConfiguracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/configuraciones")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    @GetMapping("/{clave}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<String> getValor(@PathVariable String clave) {
        String valor = configuracionService.getValor(clave);
        return valor != null ? ResponseEntity.ok(valor) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{clave}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> setValor(@PathVariable String clave, @RequestBody Map<String, String> body) {
        configuracionService.setValor(clave, body.get("valor"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getSystemStatus() {
        return ResponseEntity.ok(Map.of("maintenanceMode", configuracionService.isModoMantenimiento()));
    }

    @PostMapping("/maintenance-mode")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> setMaintenanceMode(@RequestBody Map<String, Boolean> body) {
        configuracionService.setModoMantenimiento(body.get("activo"));
        return ResponseEntity.ok().build();
    }
}
