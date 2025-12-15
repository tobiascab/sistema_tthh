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
@Table(name = "idiomas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Idioma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 50)
    private String idioma; // ESPAÑOL, INGLES, PORTUGUES, FRANCES, ALEMAN, etc.

    @Column(nullable = false, length = 10)
    private String nivelCEFR; // A1, A2, B1, B2, C1, C2

    @Column(length = 100)
    private String certificacion;

    @Column(length = 500)
    private String documentoUrl;

    @Column
    private Boolean nativo = false;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
