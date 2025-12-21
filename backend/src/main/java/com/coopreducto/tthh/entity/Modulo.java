package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "modulos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String codigo; // "COMISIONES", "RECIBOS_SALARIO", etc.

    @Column(nullable = false, length = 100)
    private String nombre; // "Liquidación de Comisiones"

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 50)
    private String icono; // Ícono para la UI (lucide icon name)

    @Column(length = 200)
    private String rutaMenu; // "/colaborador/comisiones"

    @Column
    private Integer orden; // Para ordenar en el menú

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean esDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modulo_padre_id")
    private Modulo moduloPadre; // Para módulos jerárquicos

    @OneToMany(mappedBy = "moduloPadre", cascade = CascadeType.ALL)
    private Set<Modulo> subModulos = new HashSet<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 100)
    private String createdBy;

    public Modulo(String codigo, String nombre, String descripcion, String icono, String rutaMenu, Integer orden) {
        this(codigo, nombre, descripcion, icono, rutaMenu, orden, false);
    }

    public Modulo(String codigo, String nombre, String descripcion, String icono, String rutaMenu, Integer orden,
            boolean esDefault) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.icono = icono;
        this.rutaMenu = rutaMenu;
        this.orden = orden;
        this.esDefault = esDefault;
        this.activo = true;
    }
}
