package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.AuditoriaDTO;
import com.coopreducto.tthh.entity.Auditoria;
import com.coopreducto.tthh.repository.AuditoriaRepository;
import com.coopreducto.tthh.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class AuditoriaServiceImpl implements AuditoriaService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuditoriaServiceImpl.class);

    private final AuditoriaRepository auditoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AuditoriaDTO> findAll(Pageable pageable) {
        return auditoriaRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public AuditoriaDTO findById(Long id) {
        Auditoria auditoria = auditoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auditoría no encontrada con ID: " + id));
        return convertToDTO(auditoria);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditoriaDTO> findByUsuario(String usuario, Pageable pageable) {
        return auditoriaRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditoriaDTO> findByEntidad(String entidad, Pageable pageable) {
        return auditoriaRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditoriaDTO> findByFechaRango(LocalDateTime inicio, LocalDateTime fin, Pageable pageable) {
        return auditoriaRepository.findByCreatedAtBetween(inicio, fin, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public AuditoriaDTO create(AuditoriaDTO auditoriaDTO) {
        Auditoria auditoria = convertToEntity(auditoriaDTO);
        Auditoria savedAuditoria = auditoriaRepository.save(auditoria);

        log.info("Auditoría creada: {} - {} - {} por usuario {}",
                savedAuditoria.getAccion(),
                savedAuditoria.getEntidad(),
                savedAuditoria.getEntidadId(),
                savedAuditoria.getUsuario());

        return convertToDTO(savedAuditoria);
    }

    @Override
    public void logAccion(String usuario, String accion, String entidad, Long entidadId,
            String detalles, String ipAddress, String userAgent) {
        Auditoria auditoria = new Auditoria();
        auditoria.setUsuario(usuario);
        auditoria.setAccion(accion);
        auditoria.setEntidad(entidad);
        auditoria.setEntidadId(entidadId);
        auditoria.setDetalles(detalles);
        auditoria.setIpAddress(ipAddress);
        auditoria.setUserAgent(userAgent);

        auditoriaRepository.save(auditoria);

        log.info("Auditoría registrada: {} - {} - {} por usuario {} desde IP {}",
                accion, entidad, entidadId, usuario, ipAddress);
    }

    private AuditoriaDTO convertToDTO(Auditoria auditoria) {
        AuditoriaDTO dto = new AuditoriaDTO();
        dto.setId(auditoria.getId());
        dto.setUsuario(auditoria.getUsuario());
        dto.setAccion(auditoria.getAccion());
        dto.setEntidad(auditoria.getEntidad());
        dto.setEntidadId(auditoria.getEntidadId());
        dto.setDetalles(auditoria.getDetalles());
        dto.setIpAddress(auditoria.getIpAddress());
        dto.setUserAgent(auditoria.getUserAgent());
        dto.setCreatedAt(auditoria.getCreatedAt());
        return dto;
    }

    private Auditoria convertToEntity(AuditoriaDTO dto) {
        Auditoria auditoria = new Auditoria();
        auditoria.setUsuario(dto.getUsuario());
        auditoria.setAccion(dto.getAccion());
        auditoria.setEntidad(dto.getEntidad());
        auditoria.setEntidadId(dto.getEntidadId());
        auditoria.setDetalles(dto.getDetalles());
        auditoria.setIpAddress(dto.getIpAddress());
        auditoria.setUserAgent(dto.getUserAgent());
        return auditoria;
    }
}
