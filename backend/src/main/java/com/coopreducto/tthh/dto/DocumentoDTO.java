package com.coopreducto.tthh.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentoDTO {

    private Long id;

    @NotNull(message = "El ID del empleado es requerido")
    private Long empleadoId;

    // Datos del empleado (solo lectura)
    private String empleadoNombre;
    private String empleadoNumeroDocumento;

    @NotBlank(message = "El nombre del documento es requerido")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @NotBlank(message = "La categoría es requerida")
    @Size(max = 100, message = "La categoría no puede exceder 100 caracteres")
    private String categoria;

    @Size(max = 100, message = "El tipo no puede exceder 100 caracteres")
    private String tipo;

    @Size(max = 500, message = "La ruta del archivo no puede exceder 500 caracteres")
    private String rutaArchivo;

    @Size(max = 100, message = "El nombre del archivo no puede exceder 100 caracteres")
    private String nombreArchivo;

    @Size(max = 50, message = "La extensión no puede exceder 50 caracteres")
    private String extension;

    @Size(max = 20, message = "El MIME type no puede exceder 20 caracteres")
    private String mimeType;

    @Min(value = 0, message = "El tamaño no puede ser negativo")
    private Long tamanioBytes;

    private Integer version;

    private Long documentoPadreId;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    @PastOrPresent(message = "La fecha de emisión no puede ser futura")
    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    private Boolean requiereAprobacion;

    private Boolean estaAprobado;

    @Size(max = 100, message = "El campo aprobadoPor no puede exceder 100 caracteres")
    private String aprobadoPor;

    private LocalDateTime fechaAprobacion;

    @Size(max = 500, message = "El comentario de aprobación no puede exceder 500 caracteres")
    private String comentarioAprobacion;

    private Boolean alertaEnviada;

    @Min(value = 1, message = "Los días de alerta deben ser al menos 1")
    @Max(value = 365, message = "Los días de alerta no pueden exceder 365")
    private Integer diasAlertaVencimiento;

    @Size(max = 100, message = "La entidad emisora no puede exceder 100 caracteres")
    private String entidadEmisora;

    @Size(max = 100, message = "El número de documento no puede exceder 100 caracteres")
    private String numeroDocumento;

    private Boolean esObligatorio;

    private Boolean esConfidencial;

    @Size(max = 100, message = "El campo uploadedBy no puede exceder 100 caracteres")
    private String uploadedBy;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;

    // Campos calculados
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean estaVencido;
    private String tamanioFormateado;
    private Integer diasParaVencer;

    // URL de descarga (se genera en el backend)
    private String urlDescarga;

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

    public String getEmpleadoNumeroDocumento() {
        return empleadoNumeroDocumento;
    }

    public void setEmpleadoNumeroDocumento(String empleadoNumeroDocumento) {
        this.empleadoNumeroDocumento = empleadoNumeroDocumento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    public String getNombreArchivo() {
        return nombreArchivo;
    }

    public void setNombreArchivo(String nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Long getTamanioBytes() {
        return tamanioBytes;
    }

    public void setTamanioBytes(Long tamanioBytes) {
        this.tamanioBytes = tamanioBytes;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Long getDocumentoPadreId() {
        return documentoPadreId;
    }

    public void setDocumentoPadreId(Long documentoPadreId) {
        this.documentoPadreId = documentoPadreId;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDate fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public Boolean getRequiereAprobacion() {
        return requiereAprobacion;
    }

    public void setRequiereAprobacion(Boolean requiereAprobacion) {
        this.requiereAprobacion = requiereAprobacion;
    }

    public Boolean getEstaAprobado() {
        return estaAprobado;
    }

    public void setEstaAprobado(Boolean estaAprobado) {
        this.estaAprobado = estaAprobado;
    }

    public String getAprobadoPor() {
        return aprobadoPor;
    }

    public void setAprobadoPor(String aprobadoPor) {
        this.aprobadoPor = aprobadoPor;
    }

    public LocalDateTime getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(LocalDateTime fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public String getComentarioAprobacion() {
        return comentarioAprobacion;
    }

    public void setComentarioAprobacion(String comentarioAprobacion) {
        this.comentarioAprobacion = comentarioAprobacion;
    }

    public Boolean getAlertaEnviada() {
        return alertaEnviada;
    }

    public void setAlertaEnviada(Boolean alertaEnviada) {
        this.alertaEnviada = alertaEnviada;
    }

    public Integer getDiasAlertaVencimiento() {
        return diasAlertaVencimiento;
    }

    public void setDiasAlertaVencimiento(Integer diasAlertaVencimiento) {
        this.diasAlertaVencimiento = diasAlertaVencimiento;
    }

    public String getEntidadEmisora() {
        return entidadEmisora;
    }

    public void setEntidadEmisora(String entidadEmisora) {
        this.entidadEmisora = entidadEmisora;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public Boolean getEsObligatorio() {
        return esObligatorio;
    }

    public void setEsObligatorio(Boolean esObligatorio) {
        this.esObligatorio = esObligatorio;
    }

    public Boolean getEsConfidencial() {
        return esConfidencial;
    }

    public void setEsConfidencial(Boolean esConfidencial) {
        this.esConfidencial = esConfidencial;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getEstaVencido() {
        return estaVencido;
    }

    public void setEstaVencido(Boolean estaVencido) {
        this.estaVencido = estaVencido;
    }

    public String getTamanioFormateado() {
        return tamanioFormateado;
    }

    public void setTamanioFormateado(String tamanioFormateado) {
        this.tamanioFormateado = tamanioFormateado;
    }

    public Integer getDiasParaVencer() {
        return diasParaVencer;
    }

    public void setDiasParaVencer(Integer diasParaVencer) {
        this.diasParaVencer = diasParaVencer;
    }

    public String getUrlDescarga() {
        return urlDescarga;
    }

    public void setUrlDescarga(String urlDescarga) {
        this.urlDescarga = urlDescarga;
    }
}
