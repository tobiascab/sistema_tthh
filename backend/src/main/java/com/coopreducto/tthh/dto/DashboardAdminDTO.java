package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAdminDTO {

    // KPIs Principales
    private Long colaboradoresActivos;
    private Long colaboradoresInactivos;
    private BigDecimal nominaMensualEstimada;
    private BigDecimal nominaMensualPagada;
    private Long solicitudesPendientes;
    private Long certificacionesPorVencer;
    private Integer horasFormacionMes;
    private Integer horasFormacionAnio;

    // Cumpleaños del Mes
    private Long cumpleaniosMesActual;
    private List<CumpleaniosDTO> proximosCumpleanios;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CumpleaniosDTO {
        private Long empleadoId;
        private String nombreCompleto;
        private String cargo;
        private String sucursal;
        private Integer dia;
        private Integer mes;
        private Integer diasRestantes;
        private String fotoUrl;
    }

    // Distribución
    private Map<String, Long> colaboradoresPorDepartamento;
    private Map<String, Long> colaboradoresPorCargo;
    private Map<String, Long> solicitudesPorTipo;
    private Map<String, Long> solicitudesPorEstado;

    // Tendencias
    private List<TendenciaMensual> nominaUltimos6Meses;
    private List<TendenciaMensual> ausenciasUltimos6Meses;

    // Alertas
    private List<AlertaDTO> alertas;

    // Matriz de Habilidades (Top Skills)
    // Matriz de Habilidades (Top Skills)
    private List<HabilidadResumenDTO> topHabilidades;

    // Solicitudes recientes
    private List<SolicitudResumenDTO> ultimasSolicitudes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SolicitudResumenDTO {
        private Long id;
        private String titulo;
        private String tipo;
        private String estado;
        private String prioridad;
        private String empleadoNombre;
        private String fechaCreacion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TendenciaMensual {
        private String mes;
        private Integer anio;
        private BigDecimal valor;
        private Long cantidad;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertaDTO {
        private String tipo;
        private String mensaje;
        private String prioridad;
        private Long entidadId;
        private String entidadTipo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HabilidadResumenDTO {
        private String nombreHabilidad;
        private Long cantidadEmpleados;
        private BigDecimal nivelPromedio;
        private String categoria;
    }
}
