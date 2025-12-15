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
@Table(name = "formacion_academica")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FormacionAcademica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 50)
    private String nivel; // PRIMARIA, SECUNDARIA, TECNICO, UNIVERSITARIO, POSTGRADO, DOCTORADO

    @Column(nullable = false, length = 200)
    private String institucion;

    @Column(length = 200)
    private String titulo;

    @Column(length = 100)
    private String especialidad;

    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFinalizacion;

    @Column
    private Boolean enCurso = false;

    @Column(length = 500)
    private String documentoUrl;

    @Column(length = 50)
    private String estado; // PENDIENTE, APROBADO, RECHAZADO

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(length = 100)
    private String verificadoPor;

    @Column
    private LocalDateTime fechaVerificacion;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
