package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.DashboardAdminDTO;

import java.time.LocalDate;
import java.util.Map;

public interface ReportesService {

    DashboardAdminDTO getDashboardAdmin();

    Map<String, Object> getReporteNomina(Integer anio, Integer mes);

    Map<String, Object> getReporteAusentismo(LocalDate fechaInicio, LocalDate fechaFin);

    Map<String, Object> getSkillsMatrix();

    Map<String, Object> getReporteDemografia();

    byte[] exportarReporteExcel(String tipoReporte, Map<String, Object> parametros);

    byte[] exportarReportePDF(String tipoReporte, Map<String, Object> parametros);
}
