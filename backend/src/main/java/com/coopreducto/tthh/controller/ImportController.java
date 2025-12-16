package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
public class ImportController {

    private final ExcelImportService excelImportService;

    @PostMapping("/cumpleanios")
    @PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<Map<String, Object>> importarCumpleanios(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "El archivo está vacío"));
        }

        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Solo se aceptan archivos Excel (.xlsx o .xls)"));
        }

        Map<String, Object> resultado = excelImportService.importarCumpleanios(file);

        if ((Boolean) resultado.get("success")) {
            return ResponseEntity.ok(resultado);
        } else {
            return ResponseEntity.badRequest().body(resultado);
        }
    }

    @PostMapping("/empleados")
    @PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<Map<String, Object>> importarEmpleados(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "El archivo está vacío"));
        }

        Map<String, Object> resultado = excelImportService.importarEmpleados(file);
        return ResponseEntity.ok(resultado);
    }
}
