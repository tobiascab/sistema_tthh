package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.RolDTO;
import com.coopreducto.tthh.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RolController {

    private final RolService service;

    @GetMapping
    public ResponseEntity<List<RolDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<RolDTO>> getActivos() {
        return ResponseEntity.ok(service.getActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolDTO> getById(@PathVariable Long id) {
        RolDTO dto = service.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<RolDTO> getByNombre(@PathVariable String nombre) {
        RolDTO dto = service.getByNombre(nombre);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<RolDTO> create(@RequestBody RolDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolDTO> update(@PathVariable Long id, @RequestBody RolDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
