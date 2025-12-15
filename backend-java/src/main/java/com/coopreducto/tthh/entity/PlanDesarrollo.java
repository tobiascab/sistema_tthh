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
@Table(name = "plan_desarrollo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PlanDesarrollo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false)
    private Integer anio;

    @Column(length = 50)
    private String estado; // BORRADOR, ACTIVO, COMPLETADO, CANCELADO

    @Column(columnDefinition = "TEXT")
    private String objetivos;

    @Column(columnDefinition = "TEXT")
    private String cursosRecomendados;

    @Column(columnDefinition = "TEXT")
    private String gapsDetectados;

    @Column
    private Integer progreso = 0; // 0-100

    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaObjetivo;

    @Column(columnDefinition = "TEXT")
    private String comentariosSupervisor;

    @Column(length = 100)
    private String supervisorId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
