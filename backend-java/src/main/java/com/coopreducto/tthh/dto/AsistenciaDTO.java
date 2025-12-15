package com.coopreducto.tthh.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaDTO {

    private Long id;

    @NotNull(message = "El ID del empleado es requerido")
    private Long empleadoId;

    private String empleadoNombre;

    @NotNull(message = "La fecha es requerida")
    private LocalDate fecha;

    @NotNull(message = "El tipo de asistencia es requerido")
    // PRESENTE, AUSENTE, TARDANZA, PERMISO, VACACIONES, LICENCIA
    private String tipo;

    private LocalDateTime horaEntrada;

    private LocalDateTime horaSalida;

    private Integer minutosRetraso;

    private String observaciones;

    private Boolean justificado;

    private String documentoJustificacion;

    private LocalDateTime createdAt;

    private String registradoPor;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public String getEmpleadoNombre() {
        return empleadoNombre;
    }

    public void setEmpleadoNombre(String empleadoNombre) {
        this.empleadoNombre = empleadoNombre;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Integer getMinutosRetraso() {
        return minutosRetraso;
    }

    public void setMinutosRetraso(Integer minutosRetraso) {
        this.minutosRetraso = minutosRetraso;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Boolean getJustificado() {
        return justificado;
    }

    public void setJustificado(Boolean justificado) {
        this.justificado = justificado;
    }

    public String getDocumentoJustificacion() {
        return documentoJustificacion;
    }

    public void setDocumentoJustificacion(String documentoJustificacion) {
        this.documentoJustificacion = documentoJustificacion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRegistradoPor() {
        return registradoPor;
    }

    public void setRegistradoPor(String registradoPor) {
        this.registradoPor = registradoPor;
    }
}
