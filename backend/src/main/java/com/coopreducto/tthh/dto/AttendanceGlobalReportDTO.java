package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceGlobalReportDTO {
    private Integer mes;
    private Integer anio;
    private List<ColaboradorTardanzaDTO> tardanzas;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColaboradorTardanzaDTO {
        private Long empleadoId;
        private String colaborador;
        private Integer cantidadTardanzas;
        private Long totalMinutosRetraso;
        private BigDecimal totalDescuento;
    }
}
