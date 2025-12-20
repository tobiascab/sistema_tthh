package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReciboComisionDTO {
    private Long id;
    private Long empleadoId;
    private String empleadoNombre;
    private Integer anio;
    private Integer mes;
    private LocalDate fechaPago;
    private BigDecimal montoComision;
    private BigDecimal produccionMensual;
    private BigDecimal metaAlcanzadaPorcentaje;
    private String pdfUrl;
    private String estado;
    private String observaciones;
}
