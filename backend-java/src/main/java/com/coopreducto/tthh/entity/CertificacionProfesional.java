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
@Table(name = "certificaciones_profesionales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CertificacionProfesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 200)
    private String nombreCertificacion;

    @Column(nullable = false, length = 200)
    private String entidadCertificadora;

    @Column(length = 100)
    private String numeroCertificado;

    @Column(nullable = false)
    private LocalDate fechaObtencion;

    @Column
    private LocalDate fechaVencimiento;

    @Column
    private Boolean vigente = true;

    @Column(length = 500)
    private String documentoUrl;

    @Column(length = 50)
    private String estado; // VIGENTE, VENCIDA, RENOVACION_PENDIENTE

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column
    private Boolean alertaEnviada = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
