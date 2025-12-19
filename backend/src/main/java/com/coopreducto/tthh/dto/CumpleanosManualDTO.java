package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CumpleanosManualDTO {
    private Long id;
    private String nombreCompleto;
    private LocalDate fechaNacimiento;
    private String avatarUrl;

    // Calculated field for display
    private Integer dia;
    private Integer mes;
}
