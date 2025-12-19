package com.coopreducto.tthh.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/cumpleanios")
@RequiredArgsConstructor
public class CumpleaniosController {

    private final com.coopreducto.tthh.repository.EmpleadoRepository empleadoRepository;

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        Map<String, Object> stats = new HashMap<>();

        // Cumpleaños por mes
        Map<Integer, Long> porMes = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            porMes.put(i, 0L);
        }

        empleadoRepository.findAll().stream()
                .filter(e -> e.getFechaNacimiento() != null && "ACTIVO".equals(e.getEstado()))
                .forEach(e -> {
                    int mes = e.getFechaNacimiento().getMonthValue();
                    porMes.put(mes, porMes.get(mes) + 1);
                });

        stats.put("porMes", porMes);
        stats.put("totalActivos", empleadoRepository.countActivos());
        stats.put("esteMes", empleadoRepository.findCumpleaniosDelMes().size());

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/importar-excel")
    public ResponseEntity<Map<String, Object>> importarExcel(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        int actualizados = 0;
        int errores = 0;
        List<String> logs = new ArrayList<>();

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Saltar cabecera si existe
            if (rows.hasNext())
                rows.next();

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                try {
                    // Esperamos: Col 0: Documento, Col 1: Fecha Nacimiento (o nombre, lo ignoramos)
                    Cell cellDoc = currentRow.getCell(0);
                    Cell cellFecha = currentRow.getCell(2); // Asumimos Col 2 para fecha si Col 1 es nombre

                    if (cellDoc == null)
                        continue;

                    String doc = "";
                    if (cellDoc.getCellType() == CellType.NUMERIC) {
                        doc = String.valueOf((long) cellDoc.getNumericCellValue());
                    } else {
                        doc = cellDoc.getStringCellValue().trim();
                    }

                    if (doc.isEmpty())
                        continue;

                    final String finalDoc = doc;
                    Optional<com.coopreducto.tthh.entity.Empleado> empOpt = empleadoRepository
                            .findByNumeroDocumento(finalDoc);

                    if (empOpt.isPresent()) {
                        com.coopreducto.tthh.entity.Empleado emp = empOpt.get();
                        LocalDate fechaNac = null;

                        if (cellFecha != null) {
                            if (cellFecha.getCellType() == CellType.NUMERIC
                                    && DateUtil.isCellDateFormatted(cellFecha)) {
                                Date date = cellFecha.getDateCellValue();
                                fechaNac = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                            } else if (cellFecha.getCellType() == CellType.STRING) {
                                // Intento básico de parseo si viene como texto YYYY-MM-DD
                                fechaNac = LocalDate.parse(cellFecha.getStringCellValue());
                            }
                        }

                        if (fechaNac != null) {
                            emp.setFechaNacimiento(fechaNac);
                            empleadoRepository.save(emp);
                            actualizados++;
                        }
                    } else {
                        logs.add("No se encontró empleado con documento: " + doc);
                        errores++;
                    }
                } catch (Exception e) {
                    errores++;
                    log.error("Error procesando fila de excel", e);
                }
            }

            response.put("status", "success");
            response.put("actualizados", actualizados);
            response.put("errores", errores);
            response.put("detalles", logs);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error al importar Excel de cumpleaños", e);
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
