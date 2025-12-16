package com.coopreducto.tthh.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface ExcelImportService {

    /**
     * Importa fechas de nacimiento desde un archivo Excel.
     * El archivo debe tener las columnas: Número Documento, Fecha Nacimiento
     * 
     * @param file Archivo Excel (.xlsx o .xls)
     * @return Resultado con estadísticas de la importación
     */
    Map<String, Object> importarCumpleanios(MultipartFile file);

    /**
     * Importa datos de empleados desde un archivo Excel.
     * 
     * @param file Archivo Excel (.xlsx o .xls)
     * @return Resultado con estadísticas de la importación
     */
    Map<String, Object> importarEmpleados(MultipartFile file);
}
