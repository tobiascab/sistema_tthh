package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(FileStorageServiceImpl.class);

    private final Path directorioBase;

    private static final List<String> EXTENSIONES_PERMITIDAS = Arrays.asList(
            "pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "gif", "txt");

    private static final long TAMANIO_MAXIMO = 10 * 1024 * 1024; // 10MB

    public FileStorageServiceImpl(@Value("${app.file-storage.base-path:uploads}") String basePath) {
        this.directorioBase = Paths.get(basePath).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.directorioBase);
            log.info("Directorio de almacenamiento creado/verificado: {}", this.directorioBase);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento", ex);
        }
    }

    @Override
    public String almacenarArchivo(MultipartFile file, Long empleadoId, String categoria) {
        // Validar archivo
        validarArchivo(file);

        // Limpiar nombre del archivo
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new RuntimeException("El nombre del archivo es requerido");
        }
        String nombreOriginal = StringUtils.cleanPath(originalFilename);
        String extension = obtenerExtension(nombreOriginal);

        // Generar nombre único
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String nombreArchivo = String.format("%s_%s_%s.%s", empleadoId, timestamp, uuid, extension);

        try {
            // Crear estructura de directorios: empleados/{empleadoId}/{categoria}
            Path directorioEmpleado = directorioBase.resolve("empleados").resolve(empleadoId.toString());
            Path directorioCategoria = directorioEmpleado.resolve(categoria.toLowerCase());
            Files.createDirectories(directorioCategoria);

            // Ruta completa del archivo
            Path rutaDestino = directorioCategoria.resolve(nombreArchivo);

            // Copiar archivo
            Files.copy(file.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);

            // Retornar ruta relativa
            String rutaRelativa = directorioBase.relativize(rutaDestino).toString().replace("\\", "/");
            log.info("Archivo almacenado exitosamente: {}", rutaRelativa);

            return rutaRelativa;

        } catch (IOException ex) {
            log.error("Error al almacenar archivo: {}", nombreOriginal, ex);
            throw new RuntimeException("No se pudo almacenar el archivo: " + nombreOriginal, ex);
        }
    }

    @Override
    public Resource cargarArchivo(String rutaArchivo) {
        try {
            Path rutaCompleta = directorioBase.resolve(rutaArchivo).normalize();
            java.net.URI uri = rutaCompleta.toUri();
            if (uri == null) {
                throw new RuntimeException("Error al obtener URI del archivo: " + rutaArchivo);
            }
            Resource resource = new UrlResource(uri);

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Archivo no encontrado o no legible: " + rutaArchivo);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Error al cargar archivo: " + rutaArchivo, ex);
        }
    }

    @Override
    public void eliminarArchivo(String rutaArchivo) {
        try {
            Path rutaCompleta = directorioBase.resolve(rutaArchivo).normalize();
            Files.deleteIfExists(rutaCompleta);
            log.info("Archivo eliminado: {}", rutaArchivo);
        } catch (IOException ex) {
            log.error("Error al eliminar archivo: {}", rutaArchivo, ex);
            throw new RuntimeException("No se pudo eliminar el archivo: " + rutaArchivo, ex);
        }
    }

    @Override
    public Path obtenerRutaCompleta(String rutaArchivo) {
        return directorioBase.resolve(rutaArchivo).normalize();
    }

    @Override
    public Stream<Path> listarArchivosEmpleado(Long empleadoId) {
        try {
            Path directorioEmpleado = directorioBase.resolve("empleados").resolve(empleadoId.toString());

            if (!Files.exists(directorioEmpleado)) {
                return Stream.empty();
            }

            return Files.walk(directorioEmpleado)
                    .filter(Files::isRegularFile);

        } catch (IOException ex) {
            throw new RuntimeException("Error al listar archivos del empleado: " + empleadoId, ex);
        }
    }

    @Override
    public boolean esArchivoPermitido(String nombreArchivo) {
        String extension = obtenerExtension(nombreArchivo);
        return EXTENSIONES_PERMITIDAS.contains(extension.toLowerCase());
    }

    @Override
    public String obtenerExtension(String nombreArchivo) {
        if (nombreArchivo == null || !nombreArchivo.contains(".")) {
            return "";
        }
        return nombreArchivo.substring(nombreArchivo.lastIndexOf(".") + 1);
    }

    private void validarArchivo(MultipartFile file) {
        // Validar que no sea nulo o vacío
        if (file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        // Validar nombre
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new RuntimeException("El nombre del archivo es requerido");
        }
        String nombreArchivo = StringUtils.cleanPath(originalFilename);
        if (nombreArchivo.contains("..")) {
            throw new RuntimeException(
                    "El nombre del archivo contiene una secuencia de ruta no válida: " + nombreArchivo);
        }

        // Validar extensión
        if (!esArchivoPermitido(nombreArchivo)) {
            throw new RuntimeException(
                    "Tipo de archivo no permitido. Extensiones permitidas: " + EXTENSIONES_PERMITIDAS);
        }

        // Validar tamaño
        if (file.getSize() > TAMANIO_MAXIMO) {
            throw new RuntimeException("El archivo excede el tamaño máximo permitido de 10MB");
        }
    }
}
