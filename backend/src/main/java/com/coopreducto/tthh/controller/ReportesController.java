package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.DashboardAdminDTO;
import com.coopreducto.tthh.service.ReportesService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
public class ReportesController {

    private final ReportesService reportesService;

    @GetMapping("/dashboard-admin")
    public ResponseEntity<DashboardAdminDTO> getDashboardAdmin() {
        return ResponseEntity.ok(reportesService.getDashboardAdmin());
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("PONG");
    }

    @GetMapping("/nomina")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<Map<String, Object>> getReporteNomina(
            @RequestParam("anio") Integer anio,
            @RequestParam("mes") Integer mes) {
        return ResponseEntity.ok(reportesService.getReporteNomina(anio, mes));
    }

    @GetMapping("/ausentismo")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Map<String, Object>> getReporteAusentismo(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(reportesService.getReporteAusentismo(fechaInicio, fechaFin));
    }

    @GetMapping("/skills-matrix")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Map<String, Object>> getSkillsMatrix() {
        return ResponseEntity.ok(reportesService.getSkillsMatrix());
    }

    @GetMapping("/demografia")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA', 'AUDITORIA')")
    public ResponseEntity<Map<String, Object>> getReporteDemografia() {
        return ResponseEntity.ok(reportesService.getReporteDemografia());
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    @SuppressWarnings("null")
    public ResponseEntity<byte[]> exportarExcel(
            @RequestParam("tipoReporte") String tipoReporte,
            @RequestParam Map<String, Object> parametros) {
        byte[] excel = reportesService.exportarReporteExcel(tipoReporte, parametros);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"reporte_" + tipoReporte + ".xlsx\"")
                .body(excel);
    }

    @GetMapping("/export/pdf")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    @SuppressWarnings("null")
    public ResponseEntity<byte[]> exportarPDF(
            @RequestParam("tipoReporte") String tipoReporte,
            @RequestParam Map<String, Object> parametros) {
        byte[] pdf = reportesService.exportarReportePDF(tipoReporte, parametros);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"reporte_" + tipoReporte + ".pdf\"")
                .body(pdf);
    }
}
