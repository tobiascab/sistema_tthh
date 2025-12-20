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
public class PayrollDashboardDTO {
    private BigDecimal totalPagadoAnio;
    private BigDecimal ultimoMontoNeto;
    private Integer ultimoConteoEmpleados;
    private Integer mesUltimaNomina;
    private Integer anioUltimaNomina;
    private List<PayrollRunDTO> historial;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayrollRunDTO {
        private Integer mes;
        private Integer anio;
        private Integer totalEmpleados;
        private BigDecimal totalNeto;
        private String estado;
        private java.time.LocalDateTime fechaGeneracion;
    }
}
