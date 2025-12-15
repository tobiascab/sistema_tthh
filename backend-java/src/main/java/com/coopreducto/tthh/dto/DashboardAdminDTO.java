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

    // Distribución
    private Map<String, Long> colaboradoresPorDepartamento;
    private Map<String, Long> colaboradoresPorCargo;
    private Map<String, Long> solicitudesPorTipo;
    private Map<String, Long> solicitudesPorEstado;

    // Tendencias
    private List<TendenciaMensual> nominaUltimos6Meses;
    private List<TendenciaMensual> ausenciasUltimos6Meses;
    private List<TendenciaMensual> capacitacionesUltimos6Meses;

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

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getTipo() {
            return tipo;
        }

        public void setTipo(String tipo) {
            this.tipo = tipo;
        }

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }

        public String getPrioridad() {
            return prioridad;
        }

        public void setPrioridad(String prioridad) {
            this.prioridad = prioridad;
        }

        public String getEmpleadoNombre() {
            return empleadoNombre;
        }

        public void setEmpleadoNombre(String empleadoNombre) {
            this.empleadoNombre = empleadoNombre;
        }

        public String getFechaCreacion() {
            return fechaCreacion;
        }

        public void setFechaCreacion(String fechaCreacion) {
            this.fechaCreacion = fechaCreacion;
        }

    }

    public Long getColaboradoresActivos() {
        return colaboradoresActivos;
    }

    public void setColaboradoresActivos(Long colaboradoresActivos) {
        this.colaboradoresActivos = colaboradoresActivos;
    }

    public Long getColaboradoresInactivos() {
        return colaboradoresInactivos;
    }

    public void setColaboradoresInactivos(Long colaboradoresInactivos) {
        this.colaboradoresInactivos = colaboradoresInactivos;
    }

    public BigDecimal getNominaMensualEstimada() {
        return nominaMensualEstimada;
    }

    public void setNominaMensualEstimada(BigDecimal nominaMensualEstimada) {
        this.nominaMensualEstimada = nominaMensualEstimada;
    }

    public BigDecimal getNominaMensualPagada() {
        return nominaMensualPagada;
    }

    public void setNominaMensualPagada(BigDecimal nominaMensualPagada) {
        this.nominaMensualPagada = nominaMensualPagada;
    }

    public Long getSolicitudesPendientes() {
        return solicitudesPendientes;
    }

    public void setSolicitudesPendientes(Long solicitudesPendientes) {
        this.solicitudesPendientes = solicitudesPendientes;
    }

    public Long getCertificacionesPorVencer() {
        return certificacionesPorVencer;
    }

    public void setCertificacionesPorVencer(Long certificacionesPorVencer) {
        this.certificacionesPorVencer = certificacionesPorVencer;
    }

    public Integer getHorasFormacionMes() {
        return horasFormacionMes;
    }

    public void setHorasFormacionMes(Integer horasFormacionMes) {
        this.horasFormacionMes = horasFormacionMes;
    }

    public Integer getHorasFormacionAnio() {
        return horasFormacionAnio;
    }

    public void setHorasFormacionAnio(Integer horasFormacionAnio) {
        this.horasFormacionAnio = horasFormacionAnio;
    }

    public Map<String, Long> getColaboradoresPorDepartamento() {
        return colaboradoresPorDepartamento;
    }

    public void setColaboradoresPorDepartamento(Map<String, Long> colaboradoresPorDepartamento) {
        this.colaboradoresPorDepartamento = colaboradoresPorDepartamento;
    }

    public Map<String, Long> getColaboradoresPorCargo() {
        return colaboradoresPorCargo;
    }

    public void setColaboradoresPorCargo(Map<String, Long> colaboradoresPorCargo) {
        this.colaboradoresPorCargo = colaboradoresPorCargo;
    }

    public Map<String, Long> getSolicitudesPorTipo() {
        return solicitudesPorTipo;
    }

    public void setSolicitudesPorTipo(Map<String, Long> solicitudesPorTipo) {
        this.solicitudesPorTipo = solicitudesPorTipo;
    }

    public Map<String, Long> getSolicitudesPorEstado() {
        return solicitudesPorEstado;
    }

    public void setSolicitudesPorEstado(Map<String, Long> solicitudesPorEstado) {
        this.solicitudesPorEstado = solicitudesPorEstado;
    }

    public List<TendenciaMensual> getNominaUltimos6Meses() {
        return nominaUltimos6Meses;
    }

    public void setNominaUltimos6Meses(List<TendenciaMensual> nominaUltimos6Meses) {
        this.nominaUltimos6Meses = nominaUltimos6Meses;
    }

    public List<TendenciaMensual> getAusenciasUltimos6Meses() {
        return ausenciasUltimos6Meses;
    }

    public void setAusenciasUltimos6Meses(List<TendenciaMensual> ausenciasUltimos6Meses) {
        this.ausenciasUltimos6Meses = ausenciasUltimos6Meses;
    }

    public List<TendenciaMensual> getCapacitacionesUltimos6Meses() {
        return capacitacionesUltimos6Meses;
    }

    public void setCapacitacionesUltimos6Meses(List<TendenciaMensual> capacitacionesUltimos6Meses) {
        this.capacitacionesUltimos6Meses = capacitacionesUltimos6Meses;
    }

    public List<AlertaDTO> getAlertas() {
        return alertas;
    }

    public void setAlertas(List<AlertaDTO> alertas) {
        this.alertas = alertas;
    }

    public List<HabilidadResumenDTO> getTopHabilidades() {
        return topHabilidades;
    }

    public void setTopHabilidades(List<HabilidadResumenDTO> topHabilidades) {
        this.topHabilidades = topHabilidades;
    }

    public List<SolicitudResumenDTO> getUltimasSolicitudes() {
        return ultimasSolicitudes;
    }

    public void setUltimasSolicitudes(List<SolicitudResumenDTO> ultimasSolicitudes) {
        this.ultimasSolicitudes = ultimasSolicitudes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TendenciaMensual {
        private String mes;
        private Integer anio;
        private BigDecimal valor;
        private Long cantidad;

        public String getMes() {
            return mes;
        }

        public void setMes(String mes) {
            this.mes = mes;
        }

        public Integer getAnio() {
            return anio;
        }

        public void setAnio(Integer anio) {
            this.anio = anio;
        }

        public BigDecimal getValor() {
            return valor;
        }

        public void setValor(BigDecimal valor) {
            this.valor = valor;
        }

        public Long getCantidad() {
            return cantidad;
        }

        public void setCantidad(Long cantidad) {
            this.cantidad = cantidad;
        }
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

        public String getTipo() {
            return tipo;
        }

        public void setTipo(String tipo) {
            this.tipo = tipo;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }

        public String getPrioridad() {
            return prioridad;
        }

        public void setPrioridad(String prioridad) {
            this.prioridad = prioridad;
        }

        public Long getEntidadId() {
            return entidadId;
        }

        public void setEntidadId(Long entidadId) {
            this.entidadId = entidadId;
        }

        public String getEntidadTipo() {
            return entidadTipo;
        }

        public void setEntidadTipo(String entidadTipo) {
            this.entidadTipo = entidadTipo;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HabilidadResumenDTO {
        private String nombreHabilidad;
        private Long cantidadEmpleados;
        private BigDecimal nivelPromedio;
        private String categoria;

        public String getNombreHabilidad() {
            return nombreHabilidad;
        }

        public void setNombreHabilidad(String nombreHabilidad) {
            this.nombreHabilidad = nombreHabilidad;
        }

        public Long getCantidadEmpleados() {
            return cantidadEmpleados;
        }

        public void setCantidadEmpleados(Long cantidadEmpleados) {
            this.cantidadEmpleados = cantidadEmpleados;
        }

        public BigDecimal getNivelPromedio() {
            return nivelPromedio;
        }

        public void setNivelPromedio(BigDecimal nivelPromedio) {
            this.nivelPromedio = nivelPromedio;
        }

        public String getCategoria() {
            return categoria;
        }

        public void setCategoria(String categoria) {
            this.categoria = categoria;
        }
    }
}
