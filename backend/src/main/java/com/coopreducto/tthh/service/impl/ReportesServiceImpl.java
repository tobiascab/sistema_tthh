package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.DashboardAdminDTO;
import com.coopreducto.tthh.repository.*;
import com.coopreducto.tthh.service.ReportesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportesServiceImpl implements ReportesService {

    private final EmpleadoRepository empleadoRepository;
    private final SolicitudRepository solicitudRepository;
    private final CertificacionProfesionalRepository certificacionRepository;
    private final AsistenciaRepository asistenciaRepository;

    @Override
    public DashboardAdminDTO getDashboardAdmin() {
        try {
            DashboardAdminDTO dashboard = new DashboardAdminDTO();

            // KPIs Principales
            dashboard.setColaboradoresActivos(empleadoRepository.countByEstado("ACTIVO"));
            dashboard.setColaboradoresInactivos(empleadoRepository.countByEstado("INACTIVO"));

            // Solicitudes pendientes
            dashboard.setSolicitudesPendientes(solicitudRepository.countByEstado("PENDIENTE"));

            // Certificaciones por vencer (próximos 30 días)
            LocalDate hoy = LocalDate.now();
            LocalDate en30Dias = hoy.plusDays(30);
            try {
                dashboard.setCertificacionesPorVencer(
                        (long) certificacionRepository.findProximasAVencer(hoy, en30Dias).size());
            } catch (Exception e) {
                log.warn("Error al contar certificaciones por vencer: {}", e.getMessage());
                dashboard.setCertificacionesPorVencer(0L);
            }

            // Distribución por departamento (Real)
            List<Object[]> sucStats = empleadoRepository.countBySucursal();
            Map<String, Long> porSucursal = new HashMap<>();
            for (Object[] row : sucStats) {
                porSucursal.put((String) row[0], (Long) row[1]);
            }
            // Mapeamos sucursal a departamento para el dashboard por ahora
            dashboard.setColaboradoresPorDepartamento(porSucursal);

            // Solicitudes por estado
            Map<String, Long> porEstado = new HashMap<>();
            porEstado.put("PENDIENTE", dashboard.getSolicitudesPendientes());
            porEstado.put("APROBADA", solicitudRepository.countByEstado("APROBADA"));
            porEstado.put("RECHAZADA", solicitudRepository.countByEstado("RECHAZADA"));
            dashboard.setSolicitudesPorEstado(porEstado);

            // Alertas
            List<DashboardAdminDTO.AlertaDTO> alertas = new ArrayList<>();
            if (dashboard.getSolicitudesPendientes() > 0) {
                alertas.add(new DashboardAdminDTO.AlertaDTO(
                        "SOLICITUD_PENDIENTE",
                        "Hay " + dashboard.getSolicitudesPendientes() + " solicitudes pendientes de revisión",
                        "ALTA",
                        null,
                        "SOLICITUD"));
            }
            if (dashboard.getCertificacionesPorVencer() > 0) {
                alertas.add(new DashboardAdminDTO.AlertaDTO(
                        "CERTIFICACION_VENCIMIENTO",
                        dashboard.getCertificacionesPorVencer() + " certificaciones vencen en los próximos 30 días",
                        "MEDIA",
                        null,
                        "CERTIFICACION"));
            }
            dashboard.setAlertas(alertas);

            // Cumpleaños del Mes
            List<com.coopreducto.tthh.entity.Empleado> cumpleanieros = empleadoRepository.findCumpleaniosDelMes();
            dashboard.setCumpleaniosMesActual((long) cumpleanieros.size());

            List<DashboardAdminDTO.CumpleaniosDTO> proximosCumples = new ArrayList<>();
            for (com.coopreducto.tthh.entity.Empleado emp : cumpleanieros) {
                proximosCumples.add(new DashboardAdminDTO.CumpleaniosDTO(
                        emp.getId(),
                        emp.getNombres() + " " + emp.getApellidos(),
                        emp.getCargo(),
                        emp.getSucursal(),
                        emp.getFechaNacimiento().getDayOfMonth(),
                        emp.getFechaNacimiento().getMonthValue(),
                        null // fotoUrl
                ));
            }
            dashboard.setProximosCumpleanios(proximosCumples);

            // Calcular nómina mensual estimada (suma de todos los salarios de empleados
            // activos)
            BigDecimal nominaTotal = empleadoRepository.findAll().stream()
                    .filter(e -> "ACTIVO".equals(e.getEstado()))
                    .map(e -> e.getSalario() != null ? e.getSalario() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dashboard.setNominaMensualEstimada(nominaTotal);

            // Simular nómina pagada (95% de la estimada como ejemplo)
            dashboard.setNominaMensualPagada(nominaTotal.multiply(new BigDecimal("0.95")));

            // Generar tendencia de nómina últimos 6 meses con variaciones realistas
            List<DashboardAdminDTO.TendenciaMensual> nominaHistorica = new ArrayList<>();
            java.time.YearMonth mesActual = java.time.YearMonth.now();
            Random rand = new Random(42); // Seed fijo para consistencia
            String[] nombresMeses = { "", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov",
                    "Dic" };

            for (int i = 5; i >= 0; i--) {
                java.time.YearMonth mes = mesActual.minusMonths(i);
                // Variación de ±5% sobre la nómina base para simular cambios
                double variacion = 0.95 + (rand.nextDouble() * 0.10); // 0.95 a 1.05
                BigDecimal nominaMes = nominaTotal.multiply(new BigDecimal(variacion));

                nominaHistorica.add(new DashboardAdminDTO.TendenciaMensual(
                        nombresMeses[mes.getMonthValue()],
                        mes.getYear(),
                        nominaMes,
                        dashboard.getColaboradoresActivos()));
            }
            dashboard.setNominaUltimos6Meses(nominaHistorica);

            // Solicitudes por tipo
            Map<String, Long> porTipo = new HashMap<>();
            porTipo.put("VACACIONES", solicitudRepository.countByTipo("VACACIONES"));
            porTipo.put("PERMISO", solicitudRepository.countByTipo("PERMISO"));
            porTipo.put("CONSTANCIA_LABORAL", solicitudRepository.countByTipo("CONSTANCIA_LABORAL"));
            porTipo.put("AUMENTO_SALARIO", solicitudRepository.countByTipo("AUMENTO_SALARIO"));
            dashboard.setSolicitudesPorTipo(porTipo);

            // Últimas solicitudes pendientes (Top 20)
            List<DashboardAdminDTO.SolicitudResumenDTO> ultimas = new ArrayList<>();
            try {
                // Necesitamos importar Solicitud si no está, asumimos que sí o usamos FQN
                List<com.coopreducto.tthh.entity.Solicitud> pendientes = solicitudRepository
                        .findTop20ByEstadoOrderByCreatedAtDesc("PENDIENTE");
                for (com.coopreducto.tthh.entity.Solicitud s : pendientes) {
                    ultimas.add(new DashboardAdminDTO.SolicitudResumenDTO(
                            s.getId(),
                            s.getTitulo(),
                            s.getTipo(),
                            s.getEstado(),
                            s.getPrioridad(),
                            s.getEmpleado() != null
                                    ? s.getEmpleado().getNombres() + " " + s.getEmpleado().getApellidos()
                                    : "Sin asignar",
                            s.getCreatedAt().toString()));
                }
            } catch (Exception ex) {
                log.error("Error cargando solicitudes pendientes: " + ex.getMessage());
            }
            dashboard.setUltimasSolicitudes(ultimas);

            // Defaults for other fields
            dashboard.setHorasFormacionMes(0);
            dashboard.setHorasFormacionAnio(0);
            dashboard.setColaboradoresPorCargo(new HashMap<>());
            dashboard.setAusenciasUltimos6Meses(new ArrayList<>());

            dashboard.setTopHabilidades(new ArrayList<>());

            return dashboard;
        } catch (

        Exception e) {
            log.error("Error al obtener dashboard admin", e);
            // Retornar un dashboard vacío en lugar de fallar
            DashboardAdminDTO emptyDashboard = new DashboardAdminDTO();
            emptyDashboard.setColaboradoresActivos(0L);
            emptyDashboard.setColaboradoresInactivos(0L);
            emptyDashboard.setNominaMensualEstimada(BigDecimal.ZERO);
            emptyDashboard.setNominaMensualPagada(BigDecimal.ZERO);
            emptyDashboard.setSolicitudesPendientes(0L);
            emptyDashboard.setCertificacionesPorVencer(0L);
            emptyDashboard.setHorasFormacionMes(0);
            emptyDashboard.setHorasFormacionAnio(0);
            emptyDashboard.setCumpleaniosMesActual(0L);
            emptyDashboard.setProximosCumpleanios(new ArrayList<>());
            emptyDashboard.setColaboradoresPorDepartamento(new HashMap<>());
            emptyDashboard.setColaboradoresPorCargo(new HashMap<>());
            emptyDashboard.setSolicitudesPorTipo(new HashMap<>());
            emptyDashboard.setSolicitudesPorEstado(new HashMap<>());
            emptyDashboard.setNominaUltimos6Meses(new ArrayList<>());
            emptyDashboard.setAusenciasUltimos6Meses(new ArrayList<>());
            emptyDashboard.setAlertas(new ArrayList<>());
            emptyDashboard.setTopHabilidades(new ArrayList<>());
            emptyDashboard.setUltimasSolicitudes(new ArrayList<>());
            return emptyDashboard;
        }
    }

    @Override
    public Map<String, Object> getReporteNomina(Integer anio, Integer mes) {
        // En una fase posterior se conectará con ReciboSalarioRepository
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("anio", anio);
        reporte.put("mes", mes);
        reporte.put("totalPagado", BigDecimal.ZERO);
        reporte.put("empleados", List.of());
        return reporte;
    }

    @Override
    public Map<String, Object> getReporteAusentismo(LocalDate fechaInicio, LocalDate fechaFin) {
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);

        Long total = asistenciaRepository.countAusenciasGlobal(fechaInicio, fechaFin);
        reporte.put("totalAusencias", total != null ? total : 0);

        List<Object[]> stats = asistenciaRepository.countByTipoAndRangoFecha(fechaInicio, fechaFin);
        Map<String, Long> porTipo = new HashMap<>();
        for (Object[] row : stats) {
            porTipo.put((String) row[0], (Long) row[1]);
        }
        reporte.put("porTipo", porTipo);

        return reporte;
    }

    @Override
    public Map<String, Object> getSkillsMatrix() {
        // En una fase posterior se conectará con HabilidadesRepository
        Map<String, Object> matrix = new HashMap<>();
        matrix.put("habilidades", List.of());
        return matrix;
    }

    @Override
    public Map<String, Object> getReporteDemografia() {
        Map<String, Object> reporte = new HashMap<>();

        // Género
        List<Object[]> generoStats = empleadoRepository.countByGenero();
        Map<String, Long> porGenero = new HashMap<>();
        for (Object[] row : generoStats) {
            String genero = (String) row[0];
            porGenero.put(genero != null ? genero : "NO ESPECIFICADO", (Long) row[1]);
        }
        reporte.put("porGenero", porGenero);

        // Edad (cálculo optimizado en DB)
        Map<String, Long> porEdad = new HashMap<>();
        LocalDate hoy = LocalDate.now();

        // 20-30 años
        porEdad.put("20-30", empleadoRepository.countByFechaNacimientoBetweenAndEstado(
                hoy.minusYears(30), hoy.minusYears(20), "ACTIVO"));

        // 30-40 años
        porEdad.put("30-40", empleadoRepository.countByFechaNacimientoBetweenAndEstado(
                hoy.minusYears(40), hoy.minusYears(30), "ACTIVO"));

        // 40-50 años
        porEdad.put("40-50", empleadoRepository.countByFechaNacimientoBetweenAndEstado(
                hoy.minusYears(50), hoy.minusYears(40), "ACTIVO"));

        // 50+ años
        porEdad.put("50+", empleadoRepository.countByFechaNacimientoBeforeAndEstado(
                hoy.minusYears(50), "ACTIVO"));

        // <20 años
        porEdad.put("<20", empleadoRepository.countByFechaNacimientoAfterAndEstado(
                hoy.minusYears(20), "ACTIVO"));

        // Adaptar a la salida requerida (Map<String, Integer> es lo que espera el
        // legacy code conceptualmente, pero el controller devuelve Map<String, Object>)
        // Simplemente pasamos esto como parte del reporte
        reporte.put("porEdad", porEdad);

        // Sucursal
        List<Object[]> sucursalStats = empleadoRepository.countBySucursal();
        Map<String, Long> porSucursal = new HashMap<>();
        for (Object[] row : sucursalStats) {
            porSucursal.put((String) row[0], (Long) row[1]);
        }
        reporte.put("porSucursal", porSucursal);

        return reporte;
    }

    @Override
    public byte[] exportarReporteExcel(String tipoReporte, Map<String, Object> parametros) {
        log.info("Generando reporte Excel: {}", tipoReporte);
        return new byte[0];
    }

    @Override
    public byte[] exportarReportePDF(String tipoReporte, Map<String, Object> parametros) {
        log.info("Generando reporte PDF: {}", tipoReporte);
        return new byte[0];
    }
}
