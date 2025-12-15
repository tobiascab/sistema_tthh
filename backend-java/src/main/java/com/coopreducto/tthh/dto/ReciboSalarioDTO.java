package com.coopreducto.tthh.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReciboSalarioDTO {

    private Long id;

    @NotNull(message = "El ID del empleado es requerido")
    private Long empleadoId;

    private String empleadoNombre;

    @NotNull(message = "El año es requerido")
    @Min(value = 2020, message = "El año debe ser mayor o igual a 2020")
    @Max(value = 2100, message = "El año debe ser menor o igual a 2100")
    private Integer anio;

    @NotNull(message = "El mes es requerido")
    @Min(value = 1, message = "El mes debe estar entre 1 y 12")
    @Max(value = 12, message = "El mes debe estar entre 1 y 12")
    private Integer mes;

    @NotNull(message = "La fecha de pago es requerida")
    private LocalDate fechaPago;

    @NotNull(message = "El salario bruto es requerido")
    @DecimalMin(value = "0.0", message = "El salario bruto debe ser mayor o igual a 0")
    private BigDecimal salarioBruto;

    @DecimalMin(value = "0.0", message = "Los descuentos IPS deben ser mayor o igual a 0")
    private BigDecimal descuentosIps;

    @DecimalMin(value = "0.0", message = "Los descuentos jubilación deben ser mayor o igual a 0")
    private BigDecimal descuentosJubilacion;

    @DecimalMin(value = "0.0", message = "Otros descuentos deben ser mayor o igual a 0")
    private BigDecimal otrosDescuentos;

    @DecimalMin(value = "0.0", message = "Las bonificaciones deben ser mayor o igual a 0")
    private BigDecimal bonificaciones;

    @NotNull(message = "El salario neto es requerido")
    @DecimalMin(value = "0.0", message = "El salario neto debe ser mayor o igual a 0")
    private BigDecimal salarioNeto;

    private String pdfUrl;

    @Pattern(regexp = "GENERADO|ENVIADO|DESCARGADO", message = "Estado inválido")
    private String estado;

    private String observaciones;

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

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Integer getMes() {
        return mes;
    }

    public void setMes(Integer mes) {
        this.mes = mes;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public BigDecimal getSalarioBruto() {
        return salarioBruto;
    }

    public void setSalarioBruto(BigDecimal salarioBruto) {
        this.salarioBruto = salarioBruto;
    }

    public BigDecimal getDescuentosIps() {
        return descuentosIps;
    }

    public void setDescuentosIps(BigDecimal descuentosIps) {
        this.descuentosIps = descuentosIps;
    }

    public BigDecimal getDescuentosJubilacion() {
        return descuentosJubilacion;
    }

    public void setDescuentosJubilacion(BigDecimal descuentosJubilacion) {
        this.descuentosJubilacion = descuentosJubilacion;
    }

    public BigDecimal getOtrosDescuentos() {
        return otrosDescuentos;
    }

    public void setOtrosDescuentos(BigDecimal otrosDescuentos) {
        this.otrosDescuentos = otrosDescuentos;
    }

    public BigDecimal getBonificaciones() {
        return bonificaciones;
    }

    public void setBonificaciones(BigDecimal bonificaciones) {
        this.bonificaciones = bonificaciones;
    }

    public BigDecimal getSalarioNeto() {
        return salarioNeto;
    }

    public void setSalarioNeto(BigDecimal salarioNeto) {
        this.salarioNeto = salarioNeto;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
