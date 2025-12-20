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
@Table(name = "recibos_comision")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ReciboComision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer mes;

    @Column(nullable = false)
    private LocalDate fechaPago;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montoComision;

    @Column(precision = 12, scale = 2)
    private BigDecimal produccionMensual; // Valor total producido/vendido

    @Column(precision = 10, scale = 2)
    private BigDecimal metaAlcanzadaPorcentaje; // % de meta cumplida

    @Column(length = 500)
    private String pdfUrl;

    @Column(length = 50, nullable = false)
    private String estado; // BORRADOR, GENERADO, ENVIADO, DESCARGADO

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;

    // Getters and Setters (Lombok @Data handles them, but standardizing for
    // consistency if needed)
}
