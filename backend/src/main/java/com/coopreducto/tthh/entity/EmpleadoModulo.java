package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "empleado_modulos", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "empleado_id", "modulo_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class EmpleadoModulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "modulo_id", nullable = false)
    private Modulo modulo;

    @Column(nullable = false)
    private Boolean habilitado = true; // true = tiene acceso

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime asignadoEn;

    @Column(length = 100)
    private String asignadoPor;

    public EmpleadoModulo(Empleado empleado, Modulo modulo, Boolean habilitado, String asignadoPor) {
        this.empleado = empleado;
        this.modulo = modulo;
        this.habilitado = habilitado;
        this.asignadoPor = asignadoPor;
    }
}
