package com.coopreducto.tthh.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InscripcionDTO {
    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private Long capacitacionId;
    private String capacitacionNombre;
    private LocalDateTime fechaInscripcion;
    private String estado;
    private Boolean asistio;
    private BigDecimal calificacion;
    private Boolean aprobado;

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

    public Long getCapacitacionId() {
        return capacitacionId;
    }

    public void setCapacitacionId(Long capacitacionId) {
        this.capacitacionId = capacitacionId;
    }

    public String getCapacitacionNombre() {
        return capacitacionNombre;
    }

    public void setCapacitacionNombre(String capacitacionNombre) {
        this.capacitacionNombre = capacitacionNombre;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getAsistio() {
        return asistio;
    }

    public void setAsistio(Boolean asistio) {
        this.asistio = asistio;
    }

    public BigDecimal getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(BigDecimal calificacion) {
        this.calificacion = calificacion;
    }

    public Boolean getAprobado() {
        return aprobado;
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
    }
}
