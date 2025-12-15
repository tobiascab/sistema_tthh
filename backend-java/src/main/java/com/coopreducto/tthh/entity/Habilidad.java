package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "habilidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Habilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 100)
    private String nombreHabilidad;

    @Column(nullable = false, length = 50)
    private String tipo; // TECNICA, BLANDA

    @Column(length = 100)
    private String categoria; // PROGRAMACION, LIDERAZGO, COMUNICACION, etc.

    @Column(nullable = false)
    private Integer nivel; // 1-5

    @Column
    private Integer aniosExperiencia;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column
    private Boolean certificada = false;

    @Column(length = 500)
    private String documentoUrl;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
