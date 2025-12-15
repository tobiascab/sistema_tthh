package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.CapacitacionDTO;
import com.coopreducto.tthh.dto.InscripcionDTO;
import com.coopreducto.tthh.service.CapacitacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/capacitaciones") // Ajustar path si es necesario, otros controllers usan raíz o /api/v1
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CapacitacionController {

    private final CapacitacionService service;

    @GetMapping
    public ResponseEntity<List<CapacitacionDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CapacitacionDTO> getById(@PathVariable Long id) {
        CapacitacionDTO dto = service.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CapacitacionDTO> create(@RequestBody CapacitacionDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CapacitacionDTO> update(@PathVariable Long id, @RequestBody CapacitacionDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/inscribir")
    public ResponseEntity<InscripcionDTO> inscribir(
            @RequestParam Long empleadoId,
            @RequestParam Long capacitacionId) {
        return ResponseEntity.ok(service.inscribir(empleadoId, capacitacionId));
    }

    @PostMapping("/cancelar-inscripcion/{id}")
    public ResponseEntity<Void> cancelarInscripcion(@PathVariable Long id) {
        service.cancelarInscripcion(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mis-inscripciones")
    public ResponseEntity<List<InscripcionDTO>> getMisInscripciones(@RequestParam Long empleadoId) {
        return ResponseEntity.ok(service.getInscripcionesPorEmpleado(empleadoId));
    }
}
