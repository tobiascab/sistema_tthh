package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cursos_capacitaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 200)
    private String nombreCurso;

    @Column(nullable = false, length = 200)
    private String institucion;

    @Column(length = 50)
    private String modalidad; // PRESENCIAL, VIRTUAL, HIBRIDO

    @Column(length = 100)
    private String categoria; // TECNICA, LIDERAZGO, SOFT_SKILLS, IDIOMAS, OTROS

    @Column
    private Integer duracionHoras;

    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFinalizacion;

    @Column(length = 500)
    private String certificadoUrl;

    @Column(length = 50)
    private String estado; // PENDIENTE, APROBADO, RECHAZADO

    @Column(precision = 5, scale = 2)
    private BigDecimal nota;

    @Column
    private Boolean aprobado;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
