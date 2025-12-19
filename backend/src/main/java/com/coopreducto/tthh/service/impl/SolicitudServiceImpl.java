package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.SolicitudDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.Solicitud;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.repository.SolicitudRepository;
import com.coopreducto.tthh.service.AuditoriaService;
import com.coopreducto.tthh.service.SolicitudService;
import com.coopreducto.tthh.service.WebPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AuditoriaService auditoriaService;
    private final WebPushService webPushService;

    @Override
    @Transactional(readOnly = true)
    public Page<SolicitudDTO> findByFilters(Long empleadoId, String estado, String tipo, Pageable pageable) {
        return solicitudRepository.findAll((root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (empleadoId != null) {
                predicates.add(cb.equal(root.get("empleado").get("id"), empleadoId));
            }
            if (estado != null && !estado.isEmpty()) {
                predicates.add(cb.equal(root.get("estado"), estado));
            }
            if (tipo != null && !tipo.isEmpty()) {
                predicates.add(cb.equal(root.get("tipo"), tipo));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable).map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public SolicitudDTO findById(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        return convertToDTO(solicitud);
    }

    @Override
    @CacheEvict(value = "dashboardAdmin", allEntries = true)
    public SolicitudDTO create(SolicitudDTO solicitudDTO) {
        Empleado empleado = empleadoRepository.findById(solicitudDTO.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Solicitud solicitud = convertToEntity(solicitudDTO);
        solicitud.setEmpleado(empleado);
        solicitud.setEstado("PENDIENTE");

        Solicitud saved = solicitudRepository.save(solicitud);

        auditoriaService.logAccion(
                com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername(),
                "CREATE",
                "SOLICITUD",
                saved.getId(),
                "Creación de solicitud tipo " + saved.getTipo(),
                "unknown",
                "unknown");

        // Send push notification to TTHH admins
        String empleadoNombre = empleado.getNombres() + " " + empleado.getApellidos();
        webPushService.sendToRole(
                "TTHH",
                "📋 Nueva Solicitud",
                empleadoNombre + " ha creado una solicitud de " + saved.getTipo(),
                "/solicitudes");

        return convertToDTO(saved);
    }

    @Override
    @CacheEvict(value = "dashboardAdmin", allEntries = true)
    public SolicitudDTO update(Long id, SolicitudDTO solicitudDTO) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (!"PENDIENTE".equals(solicitud.getEstado())) {
            throw new RuntimeException("Solo se pueden modificar solicitudes pendientes");
        }

        solicitud.setTitulo(solicitudDTO.getTitulo());
        solicitud.setDescripcion(solicitudDTO.getDescripcion());
        solicitud.setTipo(solicitudDTO.getTipo());
        solicitud.setPrioridad(solicitudDTO.getPrioridad());
        solicitud.setDatosAdicionales(solicitudDTO.getDatosAdicionales());

        return convertToDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @CacheEvict(value = "dashboardAdmin", allEntries = true)
    public SolicitudDTO aprobar(Long id, String respuesta) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado("APROBADA");
        solicitud.setRespuesta(respuesta);
        solicitud.setFechaAprobacion(LocalDateTime.now());
        solicitud.setAprobadoPor(com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername());

        return convertToDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @CacheEvict(value = "dashboardAdmin", allEntries = true)
    public SolicitudDTO rechazar(Long id, String respuesta) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado("RECHAZADA");
        solicitud.setRespuesta(respuesta);
        solicitud.setFechaAprobacion(LocalDateTime.now());
        solicitud.setAprobadoPor(com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername());

        return convertToDTO(solicitudRepository.save(solicitud));
    }

    @Override
    @CacheEvict(value = "dashboardAdmin", allEntries = true)
    public void delete(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        if (!"PENDIENTE".equals(solicitud.getEstado())) {
            throw new RuntimeException("Solo se pueden eliminar solicitudes pendientes");
        }

        solicitudRepository.delete(solicitud);
    }

    @Override
    public Long countActiveByEmpleado(Long empleadoId) {
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        return solicitudRepository.countByEmpleadoAndEstado(empleado, "PENDIENTE");
    }

    private SolicitudDTO convertToDTO(Solicitud entity) {
        SolicitudDTO dto = new SolicitudDTO();
        dto.setId(entity.getId());
        dto.setEmpleadoId(entity.getEmpleado().getId());
        dto.setEmpleadoNombre(entity.getEmpleado().getNombres() + " " + entity.getEmpleado().getApellidos());
        dto.setTipo(entity.getTipo());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEstado(entity.getEstado());
        dto.setPrioridad(entity.getPrioridad());
        dto.setDatosAdicionales(entity.getDatosAdicionales());
        dto.setRespuesta(entity.getRespuesta());
        dto.setAprobadoPor(entity.getAprobadoPor());
        dto.setFechaAprobacion(entity.getFechaAprobacion());
        dto.setDocumentoUrl(entity.getDocumentoUrl());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private Solicitud convertToEntity(SolicitudDTO dto) {
        Solicitud entity = new Solicitud();
        entity.setTipo(dto.getTipo());
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrioridad(dto.getPrioridad());
        entity.setDatosAdicionales(dto.getDatosAdicionales());
        return entity;
    }
}
