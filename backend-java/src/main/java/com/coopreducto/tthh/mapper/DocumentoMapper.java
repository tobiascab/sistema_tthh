package com.coopreducto.tthh.mapper;

import com.coopreducto.tthh.dto.DocumentoDTO;
import com.coopreducto.tthh.entity.Documento;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class DocumentoMapper {

    private final EmpleadoRepository empleadoRepository;

    public DocumentoDTO toDTO(Documento documento) {
        if (documento == null) {
            return null;
        }

        DocumentoDTO dto = new DocumentoDTO();

        // Campos básicos
        dto.setId(documento.getId());
        dto.setEmpleadoId(documento.getEmpleado().getId());
        dto.setEmpleadoNombre(documento.getEmpleado().getNombreCompleto());
        dto.setEmpleadoNumeroDocumento(documento.getEmpleado().getNumeroDocumento());

        dto.setNombre(documento.getNombre());
        dto.setDescripcion(documento.getDescripcion());
        dto.setCategoria(documento.getCategoria());
        dto.setTipo(documento.getTipo());
        dto.setRutaArchivo(documento.getRutaArchivo());
        dto.setNombreArchivo(documento.getNombreArchivo());
        dto.setExtension(documento.getExtension());
        dto.setMimeType(documento.getMimeType());
        dto.setTamanioBytes(documento.getTamanioBytes());

        // Versiones
        dto.setVersion(documento.getVersion());
        dto.setDocumentoPadreId(documento.getDocumentoPadreId());

        // Estado y vencimiento
        dto.setEstado(documento.getEstado());
        dto.setFechaEmision(documento.getFechaEmision());
        dto.setFechaVencimiento(documento.getFechaVencimiento());

        // Aprobación
        dto.setRequiereAprobacion(documento.getRequiereAprobacion());
        dto.setEstaAprobado(documento.getEstaAprobado());
        dto.setAprobadoPor(documento.getAprobadoPor());
        dto.setFechaAprobacion(documento.getFechaAprobacion());
        dto.setComentarioAprobacion(documento.getComentarioAprobacion());

        // Alertas
        dto.setAlertaEnviada(documento.getAlertaEnviada());
        dto.setDiasAlertaVencimiento(documento.getDiasAlertaVencimiento());

        // Metadata
        dto.setEntidadEmisora(documento.getEntidadEmisora());
        dto.setNumeroDocumento(documento.getNumeroDocumento());
        dto.setEsObligatorio(documento.getEsObligatorio());
        dto.setEsConfidencial(documento.getEsConfidencial());
        dto.setUploadedBy(documento.getUploadedBy());
        dto.setObservaciones(documento.getObservaciones());

        // Auditoría
        dto.setCreatedAt(documento.getCreatedAt());
        dto.setUpdatedAt(documento.getUpdatedAt());

        // Campos calculados
        dto.setEstaVencido(documento.estaVencido());
        dto.setTamanioFormateado(documento.getTamanioFormateado());

        // Calcular días para vencer
        if (documento.getFechaVencimiento() != null && !documento.estaVencido()) {
            long dias = ChronoUnit.DAYS.between(LocalDate.now(), documento.getFechaVencimiento());
            dto.setDiasParaVencer((int) dias);
        }

        // URL de descarga (se construirá en el controller)
        dto.setUrlDescarga("/api/v1/documentos/" + documento.getId() + "/descargar");

        return dto;
    }

    public Documento toEntity(DocumentoDTO dto) {
        if (dto == null) {
            return null;
        }

        Documento documento = new Documento();

        // Obtener empleado
        Long empleadoId = dto.getEmpleadoId();
        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        documento.setEmpleado(empleado);

        // Campos básicos
        documento.setNombre(dto.getNombre());
        documento.setDescripcion(dto.getDescripcion());
        documento.setCategoria(dto.getCategoria());
        documento.setTipo(dto.getTipo());
        documento.setRutaArchivo(dto.getRutaArchivo());
        documento.setNombreArchivo(dto.getNombreArchivo());
        documento.setExtension(dto.getExtension());
        documento.setMimeType(dto.getMimeType());
        documento.setTamanioBytes(dto.getTamanioBytes());

        // Versiones
        documento.setVersion(dto.getVersion() != null ? dto.getVersion() : 1);
        documento.setDocumentoPadreId(dto.getDocumentoPadreId());

        // Estado y vencimiento
        documento.setEstado(dto.getEstado() != null ? dto.getEstado() : "PENDIENTE");
        documento.setFechaEmision(dto.getFechaEmision());
        documento.setFechaVencimiento(dto.getFechaVencimiento());

        // Aprobación
        documento.setRequiereAprobacion(dto.getRequiereAprobacion() != null ? dto.getRequiereAprobacion() : false);
        documento.setEstaAprobado(dto.getEstaAprobado() != null ? dto.getEstaAprobado() : false);
        documento.setAprobadoPor(dto.getAprobadoPor());
        documento.setFechaAprobacion(dto.getFechaAprobacion());
        documento.setComentarioAprobacion(dto.getComentarioAprobacion());

        // Alertas
        documento.setAlertaEnviada(dto.getAlertaEnviada() != null ? dto.getAlertaEnviada() : false);
        documento
                .setDiasAlertaVencimiento(dto.getDiasAlertaVencimiento() != null ? dto.getDiasAlertaVencimiento() : 30);

        // Metadata
        documento.setEntidadEmisora(dto.getEntidadEmisora());
        documento.setNumeroDocumento(dto.getNumeroDocumento());
        documento.setEsObligatorio(dto.getEsObligatorio() != null ? dto.getEsObligatorio() : false);
        documento.setEsConfidencial(dto.getEsConfidencial() != null ? dto.getEsConfidencial() : false);
        documento.setUploadedBy(dto.getUploadedBy());
        documento.setObservaciones(dto.getObservaciones());

        return documento;
    }

    public void updateEntity(Documento documento, DocumentoDTO dto) {
        if (documento == null || dto == null) {
            return;
        }

        // No actualizar empleado ni archivo (solo metadata)
        documento.setNombre(dto.getNombre());
        documento.setDescripcion(dto.getDescripcion());
        documento.setCategoria(dto.getCategoria());
        documento.setTipo(dto.getTipo());
        documento.setEstado(dto.getEstado());
        documento.setFechaEmision(dto.getFechaEmision());
        documento.setFechaVencimiento(dto.getFechaVencimiento());
        documento.setRequiereAprobacion(dto.getRequiereAprobacion());
        documento.setEntidadEmisora(dto.getEntidadEmisora());
        documento.setNumeroDocumento(dto.getNumeroDocumento());
        documento.setEsObligatorio(dto.getEsObligatorio());
        documento.setEsConfidencial(dto.getEsConfidencial());
        documento.setObservaciones(dto.getObservaciones());
        documento.setDiasAlertaVencimiento(dto.getDiasAlertaVencimiento());
    }
}
