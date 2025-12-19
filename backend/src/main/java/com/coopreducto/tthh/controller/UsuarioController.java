package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.UsuarioDTO;
import com.coopreducto.tthh.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getById(@PathVariable Long id) {
        UsuarioDTO dto = service.getById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioDTO> getByUsername(@PathVariable String username) {
        UsuarioDTO dto = service.getByUsername(username);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    // Gestión de estado
    @PostMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        service.activar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        service.desactivar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/bloquear")
    public ResponseEntity<Void> bloquear(@PathVariable Long id) {
        service.bloquear(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/desbloquear")
    public ResponseEntity<Void> desbloquear(@PathVariable Long id) {
        service.desbloquear(id);
        return ResponseEntity.ok().build();
    }

    // Gestión de contraseña
    @PostMapping("/{id}/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords) {
        service.cambiarPassword(id, passwords.get("currentPassword"), passwords.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resetear-password")
    public ResponseEntity<Void> resetearPassword(@PathVariable Long id) {
        service.resetearPassword(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/recuperar-password")
    public ResponseEntity<Map<String, String>> generarTokenRecuperacion(@RequestBody Map<String, String> body) {
        String token = service.generarTokenRecuperacion(body.get("email"));
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/recuperar-password/{token}")
    public ResponseEntity<Void> recuperarPassword(
            @PathVariable String token,
            @RequestBody Map<String, String> body) {
        service.recuperarPassword(token, body.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    // Búsquedas
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscar(@RequestParam String q) {
        return ResponseEntity.ok(service.buscar(q));
    }

    @GetMapping("/rol/{rolId}")
    public ResponseEntity<List<UsuarioDTO>> getByRol(@PathVariable Long rolId) {
        return ResponseEntity.ok(service.getByRol(rolId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<UsuarioDTO>> getByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(service.getByEstado(estado));
    }

    // Estadísticas
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "activos", service.countByEstado("ACTIVO"),
                "inactivos", service.countByEstado("INACTIVO"),
                "bloqueados", service.countByEstado("BLOQUEADO"),
                "total", service.count()));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncEmpleadosToUsuarios() {
        return ResponseEntity.ok(service.syncEmpleadosToUsuarios());
    }
}
