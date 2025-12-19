package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelImportServiceImpl implements ExcelImportService {

    private final EmpleadoRepository empleadoRepository;

    @Override
    @Transactional
    public Map<String, Object> importarCumpleanios(MultipartFile file) {
        Map<String, Object> resultado = new HashMap<>();
        List<String> errores = new ArrayList<>();
        List<String> actualizados = new ArrayList<>();
        int procesados = 0;

        try (Workbook workbook = getWorkbook(file)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Buscar las columnas requeridas (flexibilidad en nombres)
            Row headerRow = sheet.getRow(0);
            int colDocumento = -1;
            int colFechaNacimiento = -1;

            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell cell = headerRow.getCell(i);
                if (cell != null) {
                    String header = getCellStringValue(cell).toLowerCase().trim();
                    if (header.contains("documento") || header.contains("cedula") || header.contains("ci")) {
                        colDocumento = i;
                    } else if (header.contains("nombre") || header.contains("colaborador")
                            || header.contains("empleado")) {
                        // colNombre = i; // Column found but not used for matching
                    } else if (header.contains("nacimiento") || header.contains("cumpleaños")
                            || header.contains("fecha_nac") || header.contains("birthday")) {
                        colFechaNacimiento = i;
                    }
                }
            }

            if (colDocumento == -1 || colFechaNacimiento == -1) {
                resultado.put("success", false);
                resultado.put("error",
                        "No se encontraron las columnas requeridas. El archivo debe tener columnas: 'Documento/Cedula/CI' y 'Fecha Nacimiento/Cumpleaños'");
                return resultado;
            }

            // Procesar filas
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                procesados++;

                try {
                    String documento = getCellStringValue(row.getCell(colDocumento)).trim();
                    LocalDate fechaNacimiento = getCellDateValue(row.getCell(colFechaNacimiento));

                    if (documento.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": Documento vacío");
                        continue;
                    }

                    if (fechaNacimiento == null) {
                        errores.add("Fila " + (i + 1) + ": Fecha de nacimiento inválida para documento " + documento);
                        continue;
                    }

                    // Buscar empleado por documento
                    Optional<Empleado> empleadoOpt = empleadoRepository.findByNumeroDocumento(documento);

                    if (empleadoOpt.isPresent()) {
                        Empleado emp = empleadoOpt.get();
                        emp.setFechaNacimiento(fechaNacimiento);
                        empleadoRepository.save(emp);
                        actualizados.add(emp.getNombres() + " " + emp.getApellidos() + " (" + documento + ")");
                    } else {
                        errores.add("Fila " + (i + 1) + ": Empleado no encontrado con documento " + documento);
                    }

                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": Error de procesamiento - " + e.getMessage());
                }
            }

            resultado.put("success", true);
            resultado.put("procesados", procesados);
            resultado.put("actualizados", actualizados.size());
            resultado.put("errores", errores.size());
            resultado.put("listaActualizados", actualizados);
            resultado.put("listaErrores", errores);

        } catch (IOException e) {
            log.error("Error al procesar archivo Excel", e);
            resultado.put("success", false);
            resultado.put("error", "Error al leer el archivo: " + e.getMessage());
        }

        return resultado;
    }

    @Override
    @Transactional
    public Map<String, Object> importarEmpleados(MultipartFile file) {
        // Implementación futura para importar empleados completos
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("success", false);
        resultado.put("error", "Función no implementada aún");
        return resultado;
    }

    private Workbook getWorkbook(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename != null && filename.endsWith(".xls")) {
            return new HSSFWorkbook(file.getInputStream());
        }
        return new XSSFWorkbook(file.getInputStream());
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null)
            return "";

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                // Remover decimales para números enteros (ej: CI)
                double value = cell.getNumericCellValue();
                if (value == Math.floor(value)) {
                    yield String.valueOf((long) value);
                }
                yield String.valueOf(value);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                try {
                    yield cell.getStringCellValue();
                } catch (Exception e) {
                    yield String.valueOf(cell.getNumericCellValue());
                }
            }
            default -> "";
        };
    }

    private LocalDate getCellDateValue(Cell cell) {
        if (cell == null)
            return null;

        try {
            if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            } else if (cell.getCellType() == CellType.STRING) {
                String dateStr = cell.getStringCellValue().trim();
                // Intentar varios formatos
                String[] patterns = { "dd/MM/yyyy", "yyyy-MM-dd", "dd-MM-yyyy", "d/M/yyyy", "MM/dd/yyyy" };
                for (String pattern : patterns) {
                    try {
                        return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(pattern));
                    } catch (Exception ignored) {
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Error parsing date: {}", e.getMessage());
        }
        return null;
    }
}
