package com.coopreducto.tthh.mapper;

import com.coopreducto.tthh.dto.AsistenciaDTO;
import com.coopreducto.tthh.entity.Asistencia;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AsistenciaMapper {

    public AsistenciaDTO toDTO(Asistencia entity) {
        if (entity == null) {
            return null;
        }

        AsistenciaDTO dto = new AsistenciaDTO();
        dto.setId(entity.getId());
        dto.setEmpleadoId(entity.getEmpleado() != null ? entity.getEmpleado().getId() : null);
        dto.setEmpleadoNombre(entity.getEmpleado() != null ? entity.getEmpleado().getNombreCompleto() : null);
        dto.setFecha(entity.getFecha());
        dto.setTipo(entity.getTipo());
        dto.setHoraEntrada(entity.getHoraEntrada());
        dto.setHoraSalida(entity.getHoraSalida());
        dto.setMinutosRetraso(entity.getMinutosRetraso());
        dto.setObservaciones(entity.getObservaciones());
        dto.setJustificado(entity.getJustificado());
        dto.setDocumentoJustificacion(entity.getDocumentoJustificacion());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setRegistradoPor(entity.getRegistradoPor());

        return dto;
    }

    public Asistencia toEntity(AsistenciaDTO dto) {
        if (dto == null) {
            return null;
        }

        Asistencia entity = new Asistencia();
        entity.setId(dto.getId());

        if (dto.getEmpleadoId() != null) {
            Empleado empleado = new Empleado();
            empleado.setId(dto.getEmpleadoId());
            entity.setEmpleado(empleado);
        }

        entity.setFecha(dto.getFecha());
        entity.setTipo(dto.getTipo());
        entity.setHoraEntrada(dto.getHoraEntrada());
        entity.setHoraSalida(dto.getHoraSalida());
        entity.setMinutosRetraso(dto.getMinutosRetraso());
        entity.setObservaciones(dto.getObservaciones());
        entity.setJustificado(dto.getJustificado() != null ? dto.getJustificado() : false);
        entity.setDocumentoJustificacion(dto.getDocumentoJustificacion());
        entity.setRegistradoPor(dto.getRegistradoPor());

        return entity;
    }

    public List<AsistenciaDTO> toDTOList(List<Asistencia> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
