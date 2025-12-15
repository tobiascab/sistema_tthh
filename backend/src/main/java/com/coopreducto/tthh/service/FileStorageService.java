package com.coopreducto.tthh.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface FileStorageService {

    /**
     * Almacena un archivo y retorna la ruta relativa
     */
    String almacenarArchivo(MultipartFile file, Long empleadoId, String categoria);

    /**
     * Carga un archivo como Resource
     */
    Resource cargarArchivo(String rutaArchivo);

    /**
     * Elimina un archivo
     */
    void eliminarArchivo(String rutaArchivo);

    /**
     * Obtiene la ruta completa de un archivo
     */
    Path obtenerRutaCompleta(String rutaArchivo);

    /**
     * Lista todos los archivos de un empleado
     */
    Stream<Path> listarArchivosEmpleado(Long empleadoId);

    /**
     * Valida si el archivo es permitido
     */
    boolean esArchivoPermitido(String nombreArchivo);

    /**
     * Obtiene la extensión del archivo
     */
    String obtenerExtension(String nombreArchivo);
}
