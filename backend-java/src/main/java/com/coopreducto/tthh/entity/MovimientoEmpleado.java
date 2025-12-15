package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_empleado")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MovimientoEmpleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @Column(nullable = false, length = 50)
    private String tipoMovimiento; // INGRESO, CAMBIO_AREA, ASCENSO, CAMBIO_SALARIO, SUSPENSION, EGRESO

    @Column(length = 100)
    private String areaAnterior;

    @Column(length = 100)
    private String areaNueva;

    @Column(length = 100)
    private String cargoAnterior;

    @Column(length = 100)
    private String cargoNuevo;

    @Column(precision = 10, scale = 2)
    private BigDecimal salarioAnterior;

    @Column(precision = 10, scale = 2)
    private BigDecimal salarioNuevo;

    @Column(nullable = false)
    private LocalDate fechaEfectiva;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(length = 500)
    private String documentoUrl;

    @Column(length = 100)
    private String autorizadoPor;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 100)
    private String createdBy;
}
