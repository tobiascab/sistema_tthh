package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Empleado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    // Información del Documento
    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, length = 100)
    private String categoria; // CONTRACTUAL, PERSONAL, EDUCATIVO, MEDICO, OTRO

    @Column(length = 100)
    private String tipo; // Contrato, CI, Título, Certificado Médico, etc.

    @Column(nullable = false, length = 500)
    private String rutaArchivo; // Ruta en el sistema de archivos o S3

    @Column(nullable = false, length = 100)
    private String nombreArchivo;

    @Column(length = 50)
    private String extension; // pdf, docx, jpg, png

    @Column(length = 20)
    private String mimeType; // application/pdf, image/jpeg, etc.

    @Column
    private Long tamanioBytes;

    // Control de versiones
    @Column
    private Integer version; // 1, 2, 3...

    @Column
    private Long documentoPadreId; // ID del documento original si es una versión

    // Estado y Vencimiento
    @Column(length = 50)
    private String estado; // PENDIENTE, APROBADO, RECHAZADO, VENCIDO, VIGENTE

    @Column
    private LocalDate fechaEmision;

    @Column
    private LocalDate fechaVencimiento;

    @Column
    private Boolean requiereAprobacion;

    @Column
    private Boolean estaAprobado;

    @Column(length = 100)
    private String aprobadoPor;

    @Column
    private LocalDateTime fechaAprobacion;

    @Column(length = 500)
    private String comentarioAprobacion;

    // Alertas
    @Column
    private Boolean alertaEnviada; // Para documentos próximos a vencer

    @Column
    private Integer diasAlertaVencimiento; // Días antes del vencimiento para alertar

    // Metadata adicional
    @Column(length = 100)
    private String entidadEmisora; // Institución que emitió el documento

    @Column(length = 100)
    private String numeroDocumento; // Número de certificado, título, etc.

    @Column
    private Boolean esObligatorio; // Si es obligatorio en el legajo

    @Column
    private Boolean esConfidencial;

    // Auditoría
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String uploadedBy; // Usuario que subió el archivo

    @Column(length = 500)
    private String observaciones;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
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

    // Métodos auxiliares
    @Transient
    public Boolean estaVencido() {
        if (fechaVencimiento == null)
            return false;
        return LocalDate.now().isAfter(fechaVencimiento);
    }

    @Transient
    public Boolean proximoAVencer(Integer dias) {
        if (fechaVencimiento == null)
            return false;
        LocalDate fechaLimite = LocalDate.now().plusDays(dias);
        return fechaVencimiento.isBefore(fechaLimite) && !estaVencido();
    }

    @Transient
    public String getTamanioFormateado() {
        if (tamanioBytes == null)
            return "0 KB";
        double kb = tamanioBytes / 1024.0;
        if (kb < 1024) {
            return String.format("%.2f KB", kb);
        } else {
            double mb = kb / 1024.0;
            return String.format("%.2f MB", mb);
        }
    }
}
