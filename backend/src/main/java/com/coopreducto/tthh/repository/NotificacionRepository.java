package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId);
    long countByUsuarioIdAndLeidoFalse(Long usuarioId);
}
