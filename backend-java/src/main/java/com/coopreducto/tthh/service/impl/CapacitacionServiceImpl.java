package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.CapacitacionDTO;
import com.coopreducto.tthh.dto.InscripcionDTO;
import com.coopreducto.tthh.entity.CapacitacionInterna;
import com.coopreducto.tthh.entity.InscripcionCapacitacion;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.repository.CapacitacionInternaRepository;
import com.coopreducto.tthh.repository.InscripcionRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.CapacitacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CapacitacionServiceImpl implements CapacitacionService {

    private final CapacitacionInternaRepository repository;
    private final InscripcionRepository inscripcionRepository;
    private final EmpleadoRepository empleadoRepository;

    // Manual Mapper methods
    private CapacitacionDTO toDTO(CapacitacionInterna entity) {
        if (entity == null)
            return null;
        CapacitacionDTO dto = new CapacitacionDTO();
        dto.setId(entity.getId());
        dto.setNombreCapacitacion(entity.getNombreCapacitacion());
        dto.setDescripcion(entity.getDescripcion());
        dto.setCategoria(entity.getCategoria());
        dto.setModalidad(entity.getModalidad());
        dto.setDuracionHoras(entity.getDuracionHoras());
        dto.setCupoMaximo(entity.getCupoMaximo());
        dto.setCupoDisponible(entity.getCupoDisponible());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaFin(entity.getFechaFin());
        dto.setInstructor(entity.getInstructor());
        dto.setUbicacion(entity.getUbicacion());
        dto.setEstado(entity.getEstado());
        dto.setObjetivos(entity.getObjetivos());
        dto.setRequisitos(entity.getRequisitos());
        dto.setMaterialUrl(entity.getMaterialUrl());
        return dto;
    }

    private CapacitacionInterna toEntity(CapacitacionDTO dto) {
        if (dto == null)
            return null;
        CapacitacionInterna entity = new CapacitacionInterna();
        entity.setNombreCapacitacion(dto.getNombreCapacitacion());
        entity.setDescripcion(dto.getDescripcion());
        entity.setCategoria(dto.getCategoria());
        entity.setModalidad(dto.getModalidad());
        entity.setDuracionHoras(dto.getDuracionHoras());
        entity.setCupoMaximo(dto.getCupoMaximo());
        entity.setCupoDisponible(dto.getCupoDisponible());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setInstructor(dto.getInstructor());
        entity.setUbicacion(dto.getUbicacion());
        entity.setEstado(dto.getEstado() != null ? dto.getEstado() : "PLANIFICADA");
        entity.setObjetivos(dto.getObjetivos());
        entity.setRequisitos(dto.getRequisitos());
        entity.setMaterialUrl(dto.getMaterialUrl());
        return entity;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CapacitacionDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CapacitacionDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    @Transactional
    public CapacitacionDTO create(CapacitacionDTO dto) {
        CapacitacionInterna entity = toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        entity.setCreatedBy("SYSTEM");
        return toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public CapacitacionDTO update(Long id, CapacitacionDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setNombreCapacitacion(dto.getNombreCapacitacion());
            existing.setDescripcion(dto.getDescripcion());
            existing.setCategoria(dto.getCategoria());
            existing.setModalidad(dto.getModalidad());
            existing.setDuracionHoras(dto.getDuracionHoras());
            existing.setCupoMaximo(dto.getCupoMaximo());
            existing.setCupoDisponible(dto.getCupoDisponible());
            existing.setFechaInicio(dto.getFechaInicio());
            existing.setFechaFin(dto.getFechaFin());
            existing.setInstructor(dto.getInstructor());
            existing.setUbicacion(dto.getUbicacion());
            existing.setEstado(dto.getEstado());
            existing.setUpdatedAt(LocalDateTime.now());
            return toDTO(repository.save(existing));
        }).orElse(null);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public InscripcionDTO inscribir(Long empleadoId, Long capacitacionId) {
        if (estaInscrito(empleadoId, capacitacionId)) {
            throw new RuntimeException("Ya estás inscrito en esta capacitación");
        }

        CapacitacionInterna capacitacion = repository.findById(capacitacionId)
                .orElseThrow(() -> new RuntimeException("Capacitación no encontrada"));

        if (capacitacion.getCupoDisponible() <= 0) {
            throw new RuntimeException("No hay cupos disponibles");
        }

        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        capacitacion.setCupoDisponible(capacitacion.getCupoDisponible() - 1);
        repository.save(capacitacion);

        InscripcionCapacitacion inscripcion = new InscripcionCapacitacion();
        inscripcion.setEmpleado(empleado);
        inscripcion.setCapacitacion(capacitacion);
        inscripcion.setCreatedAt(LocalDateTime.now());
        inscripcion.setUpdatedAt(LocalDateTime.now());
        inscripcion.setEstado("INSCRITO");

        return toInscripcionDTO(inscripcionRepository.save(inscripcion));
    }

    @Override
    @Transactional
    public void cancelarInscripcion(Long inscripcionId) {
        InscripcionCapacitacion inscripcion = inscripcionRepository.findById(inscripcionId)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));

        if ("INSCRITO".equals(inscripcion.getEstado())) {
            CapacitacionInterna cap = inscripcion.getCapacitacion();
            cap.setCupoDisponible(cap.getCupoDisponible() + 1);
            repository.save(cap);
        }

        inscripcion.setEstado("CANCELADO");
        inscripcionRepository.save(inscripcion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InscripcionDTO> getInscripcionesPorEmpleado(Long empleadoId) {
        return inscripcionRepository.findByEmpleadoId(empleadoId).stream()
                .map(this::toInscripcionDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean estaInscrito(Long empleadoId, Long capacitacionId) {
        return inscripcionRepository.existsByEmpleadoIdAndCapacitacionIdAndEstado(empleadoId, capacitacionId,
                "INSCRITO");
    }

    private InscripcionDTO toInscripcionDTO(InscripcionCapacitacion entity) {
        if (entity == null)
            return null;
        InscripcionDTO dto = new InscripcionDTO();
        dto.setId(entity.getId());
        dto.setEmpleadoId(entity.getEmpleado().getId());
        dto.setEmpleadoNombre(entity.getEmpleado().getNombres() + " " + entity.getEmpleado().getApellidos());
        dto.setCapacitacionId(entity.getCapacitacion().getId());
        dto.setCapacitacionNombre(entity.getCapacitacion().getNombreCapacitacion());
        dto.setFechaInscripcion(entity.getCreatedAt());
        dto.setEstado(entity.getEstado());
        dto.setAsistio(entity.getAsistio());
        dto.setCalificacion(entity.getCalificacion());
        dto.setAprobado(entity.getAprobado());
        return dto;
    }
}
