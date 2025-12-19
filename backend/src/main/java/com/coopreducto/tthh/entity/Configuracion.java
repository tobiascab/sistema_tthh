package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "configuraciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Configuracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String clave; // Ej: BIRTHDAY_SOURCE

    @Column(nullable = false, length = 255)
    private String valor; // Ej: EMPLOYEES, MANUAL

    @Column(length = 500)
    private String descripcion;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
