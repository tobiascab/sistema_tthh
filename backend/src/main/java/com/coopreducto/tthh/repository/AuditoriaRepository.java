package com.coopreducto.tthh.repository;

import com.coopreducto.tthh.entity.Auditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {

    List<Auditoria> findByUsuario(String usuario);

    Page<Auditoria> findByUsuario(String usuario, Pageable pageable);

    List<Auditoria> findByEntidad(String entidad);

    Page<Auditoria> findByEntidad(String entidad, Pageable pageable);

    List<Auditoria> findByEntidadAndEntidadId(String entidad, Long entidadId);

    List<Auditoria> findByCreatedAtBetween(LocalDateTime inicio, LocalDateTime fin);

    Page<Auditoria> findByCreatedAtBetween(LocalDateTime inicio, LocalDateTime fin, Pageable pageable);

    List<Auditoria> findByAccion(String accion);

    Page<Auditoria> findByAccion(String accion, Pageable pageable);
}
