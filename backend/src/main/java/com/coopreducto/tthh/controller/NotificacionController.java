package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.entity.Notificacion;
import com.coopreducto.tthh.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notificaciones")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class NotificacionController {
    private final NotificacionRepository repository;

    @GetMapping("/mis")
    public List<Notificacion> getMisNotificaciones(@RequestParam Long usuarioId) {
        return repository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId);
    }

    @PostMapping("/leer/{id}")
    public void marcarLeida(@PathVariable Long id) {
        repository.findById(id).ifPresent(n -> {
            n.setLeido(true);
            repository.save(n);
        });
    }

    @GetMapping("/no-leidas/count")
    public long countNoLeidas(@RequestParam Long usuarioId) {
        return repository.countByUsuarioIdAndLeidoFalse(usuarioId);
    }
}

