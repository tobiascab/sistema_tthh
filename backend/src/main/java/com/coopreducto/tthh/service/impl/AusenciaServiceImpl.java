package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.AusenciaDTO;
import com.coopreducto.tthh.entity.Ausencia;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.repository.AusenciaRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.AusenciaService;
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
public class AusenciaServiceImpl implements AusenciaService {

    private final AusenciaRepository ausenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final com.coopreducto.tthh.service.WebPushService webPushService;

    @Override
    @Transactional(readOnly = true)
    public Page<AusenciaDTO> findAll(Pageable pageable) {
        return ausenciaRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public AusenciaDTO findById(Long id) {
        Ausencia ausencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));
        return convertToDTO(ausencia);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AusenciaDTO> findByEmpleadoId(Long empleadoId, Pageable pageable) {
        // Empleado empleado = empleadoRepository.findById(empleadoId)
        // .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " +
        // empleadoId));

        return ausenciaRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public AusenciaDTO create(AusenciaDTO ausenciaDTO) {
        Empleado empleado = empleadoRepository.findById(ausenciaDTO.getEmpleadoId())
                .orElseThrow(
                        () -> new RuntimeException("Empleado no encontrado con ID: " + ausenciaDTO.getEmpleadoId()));

        Ausencia ausencia = convertToEntity(ausenciaDTO);
        ausencia.setEmpleado(empleado);
        ausencia.setEstado("PENDIENTE");

        Ausencia savedAusencia = ausenciaRepository.save(ausencia);

        // Notify TTHH Admins
        String empleadoNombre = empleado.getNombres() + " " + empleado.getApellidos();
        webPushService.sendToRole(
                "TTHH",
                "📅 Nueva Ausencia",
                empleadoNombre + " ha solicitado " + savedAusencia.getTipo(),
                "/colaborador/solicitudes?tipo=ausencia");

        return convertToDTO(savedAusencia);
    }

    @Override
    public AusenciaDTO update(Long id, AusenciaDTO ausenciaDTO) {
        Ausencia ausencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));

        updateEntityFromDTO(ausencia, ausenciaDTO);
        Ausencia updatedAusencia = ausenciaRepository.save(ausencia);

        return convertToDTO(updatedAusencia);
    }

    @Override
    public AusenciaDTO aprobar(Long id) {
        Ausencia ausencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));

        if (!"PENDIENTE".equals(ausencia.getEstado())) {
            throw new RuntimeException("Solo se pueden aprobar ausencias en estado PENDIENTE");
        }

        ausencia.setEstado("APROBADA");
        ausencia.setFechaAprobacion(LocalDateTime.now());
        ausencia.setAprobadoPor(com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername());

        Ausencia updatedAusencia = ausenciaRepository.save(ausencia);
        return convertToDTO(updatedAusencia);
    }

    @Override
    public AusenciaDTO rechazar(Long id, String motivo) {
        Ausencia ausencia = ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));

        if (!"PENDIENTE".equals(ausencia.getEstado())) {
            throw new RuntimeException("Solo se pueden rechazar ausencias en estado PENDIENTE");
        }

        ausencia.setEstado("RECHAZADA");
        ausencia.setFechaAprobacion(LocalDateTime.now());
        ausencia.setObservaciones(motivo);
        ausencia.setAprobadoPor(com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername());

        Ausencia updatedAusencia = ausenciaRepository.save(ausencia);
        return convertToDTO(updatedAusencia);
    }

    @Override
    public void delete(Long id) {
        if (!ausenciaRepository.existsById(id)) {
            throw new RuntimeException("Ausencia no encontrada con ID: " + id);
        }
        ausenciaRepository.deleteById(id);
    }

    private AusenciaDTO convertToDTO(Ausencia ausencia) {
        AusenciaDTO dto = new AusenciaDTO();
        dto.setId(ausencia.getId());
        dto.setEmpleadoId(ausencia.getEmpleado().getId());
        dto.setEmpleadoNombre(ausencia.getEmpleado().getNombres() + " " + ausencia.getEmpleado().getApellidos());
        dto.setTipo(ausencia.getTipo());
        dto.setFechaInicio(ausencia.getFechaInicio());
        dto.setFechaFin(ausencia.getFechaFin());
        dto.setDiasSolicitados(ausencia.getDiasSolicitados());
        dto.setEstado(ausencia.getEstado());
        dto.setMotivo(ausencia.getMotivo());
        dto.setObservaciones(ausencia.getObservaciones());
        dto.setAprobadoPor(ausencia.getAprobadoPor());
        dto.setDocumentoUrl(ausencia.getDocumentoUrl());
        dto.setCreatedAt(ausencia.getCreatedAt());
        return dto;
    }

    private Ausencia convertToEntity(AusenciaDTO dto) {
        Ausencia ausencia = new Ausencia();
        updateEntityFromDTO(ausencia, dto);
        return ausencia;
    }

    private void updateEntityFromDTO(Ausencia ausencia, AusenciaDTO dto) {
        ausencia.setTipo(dto.getTipo());
        ausencia.setFechaInicio(dto.getFechaInicio());
        ausencia.setFechaFin(dto.getFechaFin());
        ausencia.setDiasSolicitados(dto.getDiasSolicitados());
        ausencia.setMotivo(dto.getMotivo());
        ausencia.setObservaciones(dto.getObservaciones());
        ausencia.setDocumentoUrl(dto.getDocumentoUrl());
    }
}
