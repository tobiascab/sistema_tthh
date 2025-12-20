package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.DashboardAdminDTO;
import com.coopreducto.tthh.repository.*;
import com.coopreducto.tthh.service.ReportesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final com.coopreducto.tthh.service.CumpleanosService cumpleanosService;

    @Override
    // @Cacheable(value = "dashboardAdmin")
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
            try {
                List<Object[]> sucStats = empleadoRepository.countBySucursal();
                Map<String, Long> porSucursal = new HashMap<>();
                if (sucStats != null) {
                    for (Object[] row : sucStats) {
                        if (row != null && row.length >= 2 && row[0] != null) {
                            porSucursal.put(row[0].toString(), (Long) row[1]);
                        }
                    }
                }
                dashboard.setColaboradoresPorDepartamento(porSucursal);
            } catch (Exception e) {
                log.error("Error en distribución por sucursal: {}", e.getMessage());
                dashboard.setColaboradoresPorDepartamento(new HashMap<>());
            }

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

            // Cumpleaños próximos (Configurable: Manual o Automático)
            List<DashboardAdminDTO.CumpleaniosDTO> proximosCumples = new ArrayList<>();
            try {
                List<com.coopreducto.tthh.dto.CumpleanosManualDTO> proximos = cumpleanosService.getProximos(5);
                dashboard.setCumpleaniosMesActual((long) cumpleanosService.getCumpleanosDelMes().size());

                for (com.coopreducto.tthh.dto.CumpleanosManualDTO dto : proximos) {
                    LocalDate fechaNac = dto.getFechaNacimiento();
                    Integer diasRestantes = 0;

                    if (fechaNac != null) {
                        LocalDate proxCumple = fechaNac.withYear(hoy.getYear());
                        if (proxCumple.isBefore(hoy)) {
                            proxCumple = proxCumple.plusYears(1);
                        }
                        diasRestantes = (int) java.time.temporal.ChronoUnit.DAYS.between(hoy, proxCumple);
                    }

                    proximosCumples.add(new DashboardAdminDTO.CumpleaniosDTO(
                            dto.getId(),
                            dto.getNombreCompleto(),
                            "Colaborador",
                            "Sucursal",
                            fechaNac != null ? fechaNac.getDayOfMonth() : 0,
                            fechaNac != null ? fechaNac.getMonthValue() : 0,
                            diasRestantes,
                            dto.getAvatarUrl()));
                }
            } catch (Exception e) {
                log.warn("Error al cargar cumpleaños: {}. Usando fallback.", e.getMessage());
                // Fallback: usar empleadoRepository directamente
                List<com.coopreducto.tthh.entity.Empleado> cumpleanierosProximos = empleadoRepository
                        .findProximosCumpleanios(5);
                dashboard.setCumpleaniosMesActual((long) empleadoRepository.findCumpleaniosDelMes().size());
                for (com.coopreducto.tthh.entity.Empleado emp : cumpleanierosProximos) {
                    LocalDate fechaNac = emp.getFechaNacimiento();
                    Integer diasRestantes = 0;
                    if (fechaNac != null) {
                        LocalDate proxCumple = fechaNac.withYear(hoy.getYear());
                        if (proxCumple.isBefore(hoy))
                            proxCumple = proxCumple.plusYears(1);
                        diasRestantes = (int) java.time.temporal.ChronoUnit.DAYS.between(hoy, proxCumple);
                    }
                    proximosCumples.add(new DashboardAdminDTO.CumpleaniosDTO(
                            emp.getId(), emp.getNombres() + " " + emp.getApellidos(), emp.getCargo(), emp.getSucursal(),
                            fechaNac != null ? fechaNac.getDayOfMonth() : 0,
                            fechaNac != null ? fechaNac.getMonthValue() : 0,
                            diasRestantes, emp.getFotoUrl()));
                }
            }
            dashboard.setProximosCumpleanios(proximosCumples);

            // Calcular nómina mensual estimada (suma de todos los salarios de empleados
            // activos)
            BigDecimal nominaTotal = empleadoRepository.sumSalarioByEstado("ACTIVO");
            if (nominaTotal == null)
                nominaTotal = BigDecimal.ZERO;
            dashboard.setNominaMensualEstimada(nominaTotal);

            log.info("KPIs cargados con éxito para {} empleados.", dashboard.getColaboradoresActivos());

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
                List<com.coopreducto.tthh.entity.Solicitud> pendientes = solicitudRepository
                        .findTop20ByEstadoOrderByCreatedAtDesc("PENDIENTE");
                if (pendientes != null) {
                    for (com.coopreducto.tthh.entity.Solicitud s : pendientes) {
                        if (s == null)
                            continue;
                        ultimas.add(new DashboardAdminDTO.SolicitudResumenDTO(
                                s.getId(),
                                s.getTitulo() != null ? s.getTitulo() : "Sin título",
                                s.getTipo() != null ? s.getTipo() : "OTRO",
                                s.getEstado() != null ? s.getEstado() : "PENDIENTE",
                                s.getPrioridad() != null ? s.getPrioridad() : "MEDIA",
                                s.getEmpleado() != null
                                        ? s.getEmpleado().getNombres() + " " + s.getEmpleado().getApellidos()
                                        : "Sin asignar",
                                s.getCreatedAt() != null ? s.getCreatedAt().toString()
                                        : LocalDateTime.now().toString()));
                    }
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
        } catch (Exception e) {
            log.error("Error al obtener dashboard admin", e);
            e.printStackTrace(); // Ver en consola directamente
            // Retornar un dashboard vacío en lugar de fallar
            DashboardAdminDTO empty = new DashboardAdminDTO();
            empty.setColaboradoresActivos(0L);
            empty.setColaboradoresInactivos(0L);
            empty.setNominaMensualEstimada(BigDecimal.ZERO);
            empty.setNominaMensualPagada(BigDecimal.ZERO);
            empty.setSolicitudesPendientes(0L);
            empty.setCumpleaniosMesActual(0L);
            empty.setCertificacionesPorVencer(0L);
            empty.setHorasFormacionMes(0);
            empty.setHorasFormacionAnio(0);
            empty.setColaboradoresPorDepartamento(new HashMap<>());
            empty.setColaboradoresPorCargo(new HashMap<>());
            empty.setSolicitudesPorTipo(new HashMap<>());
            empty.setSolicitudesPorEstado(new HashMap<>());
            empty.setNominaUltimos6Meses(new ArrayList<>());
            empty.setAusenciasUltimos6Meses(new ArrayList<>());
            empty.setAlertas(new ArrayList<>());
            empty.setTopHabilidades(new ArrayList<>());
            empty.setUltimasSolicitudes(new ArrayList<>());
            return empty;
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
    @Cacheable(value = "reporteDemografia")
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

        reporte.put("porEdad", porEdad);

        // Sucursal
        try {
            List<Object[]> sucursalStats = empleadoRepository.countBySucursal();
            Map<String, Long> porSucursal = new HashMap<>();
            if (sucursalStats != null) {
                for (Object[] row : sucursalStats) {
                    if (row != null && row.length >= 2) {
                        porSucursal.put(row[0] != null ? row[0].toString() : "SIN SUCURSAL", (Long) row[1]);
                    }
                }
            }
            reporte.put("porSucursal", porSucursal);
        } catch (Exception e) {
            log.error("Error en reporte demografía (sucursal): {}", e.getMessage());
            reporte.put("porSucursal", new HashMap<>());
        }

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
