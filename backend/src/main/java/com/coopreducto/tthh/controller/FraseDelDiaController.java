package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.entity.FraseDelDia;
import com.coopreducto.tthh.service.FraseDelDiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/frases-del-dia")
@RequiredArgsConstructor
public class FraseDelDiaController {

    private final FraseDelDiaService fraseDelDiaService;

    /**
     * Obtiene la frase del día actual - Público para todos los usuarios
     * autenticados
     */
    @GetMapping("/hoy")
    public ResponseEntity<Map<String, Object>> obtenerFraseDelDia() {
        FraseDelDia frase = fraseDelDiaService.obtenerFraseDelDia();
        return ResponseEntity.ok(Map.of(
                "texto", frase.getTexto(),
                "autor", frase.getAutor() != null ? frase.getAutor() : "Equipo de HR"));
    }

    /**
     * Obtiene todas las frases - Solo admin
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ADMIN')")
    public ResponseEntity<List<FraseDelDia>> obtenerTodas() {
        return ResponseEntity.ok(fraseDelDiaService.obtenerTodas());
    }

    /**
     * Crea una nueva frase - Solo admin
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ADMIN')")
    public ResponseEntity<FraseDelDia> crear(@RequestBody FraseDelDia frase) {
        return ResponseEntity.ok(fraseDelDiaService.crear(frase));
    }

    /**
     * Actualiza una frase existente - Solo admin
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ADMIN')")
    public ResponseEntity<FraseDelDia> actualizar(@PathVariable Long id, @RequestBody FraseDelDia frase) {
        return ResponseEntity.ok(fraseDelDiaService.actualizar(id, frase));
    }

    /**
     * Elimina una frase - Solo admin
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        fraseDelDiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle activa/inactiva - Solo admin
     */
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'ADMIN')")
    public ResponseEntity<FraseDelDia> toggleActiva(@PathVariable Long id) {
        return ResponseEntity.ok(fraseDelDiaService.toggleActiva(id));
    }
}
