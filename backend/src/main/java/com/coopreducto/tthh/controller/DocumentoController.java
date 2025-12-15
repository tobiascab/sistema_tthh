package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.DocumentoDTO;
import com.coopreducto.tthh.service.DocumentoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DocumentoController.class);

    private final DocumentoService documentoService;
    private final ObjectMapper objectMapper;

    // ========================================
    // UPLOAD Y DESCARGA
    // ========================================

    @PostMapping(value = "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoDTO> subirDocumento(
            @RequestParam("file") MultipartFile file,
            @RequestParam("metadata") String metadataJson) {

        log.info("POST /documentos/subir - Archivo: {}", file.getOriginalFilename());

        try {
            // Parsear JSON de metadata
            DocumentoDTO metadata = objectMapper.readValue(metadataJson, DocumentoDTO.class);

            DocumentoDTO documentoCreado = documentoService.subirDocumento(file, metadata);
            return ResponseEntity.status(HttpStatus.CREATED).body(documentoCreado);

        } catch (Exception e) {
            log.error("Error al subir documento", e);
            throw new RuntimeException("Error al procesar la solicitud: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/descargar")
    public ResponseEntity<Resource> descargarDocumento(@PathVariable Long id) {
        log.info("GET /documentos/{}/descargar", id);

        DocumentoDTO documento = documentoService.obtenerPorId(id);
        Resource resource = documentoService.descargarDocumento(id);

        String mimeType = documento.getMimeType() != null ? documento.getMimeType() : "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(java.util.Objects.requireNonNull(mimeType)))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + documento.getNombreArchivo() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDocumento(@PathVariable Long id) {
        log.info("DELETE /documentos/{}", id);
        documentoService.eliminarDocumento(id);
        return ResponseEntity.noContent().build();
    }

    // ========================================
    // CRUD DE METADATA
    // ========================================

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoDTO> actualizarMetadata(
            @PathVariable Long id,
            @Valid @RequestBody DocumentoDTO dto) {
        log.info("PUT /documentos/{}", id);
        DocumentoDTO actualizado = documentoService.actualizarMetadata(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoDTO> obtenerPorId(@PathVariable Long id) {
        log.info("GET /documentos/{}", id);
        DocumentoDTO documento = documentoService.obtenerPorId(id);
        return ResponseEntity.ok(documento);
    }

    @GetMapping
    public ResponseEntity<Page<DocumentoDTO>> listarTodos(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /documentos");
        Page<DocumentoDTO> documentos = documentoService.listarTodos(pageable);
        return ResponseEntity.ok(documentos);
    }

    // ========================================
    // BÚSQUEDAS POR EMPLEADO
    // ========================================

    @GetMapping("/empleado/{empleadoId}")
    public ResponseEntity<List<DocumentoDTO>> listarPorEmpleado(@PathVariable Long empleadoId) {
        log.info("GET /documentos/empleado/{}", empleadoId);
        List<DocumentoDTO> documentos = documentoService.listarPorEmpleado(empleadoId);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/empleado/{empleadoId}/paginado")
    public ResponseEntity<Page<DocumentoDTO>> listarPorEmpleadoPaginado(
            @PathVariable Long empleadoId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /documentos/empleado/{}/paginado", empleadoId);
        Page<DocumentoDTO> documentos = documentoService.listarPorEmpleado(empleadoId, pageable);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/empleado/{empleadoId}/categoria/{categoria}")
    public ResponseEntity<List<DocumentoDTO>> listarPorEmpleadoYCategoria(
            @PathVariable Long empleadoId,
            @PathVariable String categoria) {
        log.info("GET /documentos/empleado/{}/categoria/{}", empleadoId, categoria);
        List<DocumentoDTO> documentos = documentoService.listarPorEmpleadoYCategoria(empleadoId, categoria);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/empleado/{empleadoId}/agrupados")
    public ResponseEntity<Map<String, List<DocumentoDTO>>> listarAgrupadosPorCategoria(
            @PathVariable Long empleadoId) {
        log.info("GET /documentos/empleado/{}/agrupados", empleadoId);
        Map<String, List<DocumentoDTO>> agrupados = documentoService.listarAgrupadosPorCategoria(empleadoId);
        return ResponseEntity.ok(agrupados);
    }

    @GetMapping("/empleado/{empleadoId}/count")
    public ResponseEntity<Map<String, Long>> contarPorEmpleado(@PathVariable Long empleadoId) {
        Long count = documentoService.contarPorEmpleado(empleadoId);
        return ResponseEntity.ok(Map.of("total", count));
    }

    // ========================================
    // BÚSQUEDAS POR CATEGORÍA Y ESTADO
    // ========================================

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<DocumentoDTO>> listarPorCategoria(@PathVariable String categoria) {
        log.info("GET /documentos/categoria/{}", categoria);
        List<DocumentoDTO> documentos = documentoService.listarPorCategoria(categoria);
        return ResponseEntity.ok(documentos);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<Page<DocumentoDTO>> listarPorEstado(
            @PathVariable String estado,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /documentos/estado/{}", estado);
        Page<DocumentoDTO> documentos = documentoService.listarPorEstado(estado, pageable);
        return ResponseEntity.ok(documentos);
    }

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    @GetMapping("/buscar")
    public ResponseEntity<Page<DocumentoDTO>> buscar(
            @RequestParam(required = false) Long empleadoId,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("GET /documentos/buscar - empleadoId: {}, categoria: {}, estado: {}, search: {}",
                empleadoId, categoria, estado, search);

        Page<DocumentoDTO> documentos = documentoService.buscarConFiltros(
                empleadoId, categoria, estado, search, pageable);

        return ResponseEntity.ok(documentos);
    }

    // ========================================
    // VERSIONES
    // ========================================

    @PostMapping(value = "/{id}/nueva-version", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoDTO> crearNuevaVersion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        log.info("POST /documentos/{}/nueva-version", id);
        DocumentoDTO nuevaVersion = documentoService.crearNuevaVersion(id, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaVersion);
    }

    @GetMapping("/{id}/versiones")
    public ResponseEntity<List<DocumentoDTO>> obtenerVersiones(@PathVariable Long id) {
        log.info("GET /documentos/{}/versiones", id);
        List<DocumentoDTO> versiones = documentoService.obtenerVersiones(id);
        return ResponseEntity.ok(versiones);
    }

    // ========================================
    // APROBACIÓN
    // ========================================

    @GetMapping("/pendientes-aprobacion")
    public ResponseEntity<List<DocumentoDTO>> listarPendientesAprobacion() {
        log.info("GET /documentos/pendientes-aprobacion");
        List<DocumentoDTO> pendientes = documentoService.listarPendientesAprobacion();
        return ResponseEntity.ok(pendientes);
    }

    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<DocumentoDTO> aprobarDocumento(
            @PathVariable Long id,
            @RequestParam String aprobadoPor,
            @RequestParam(required = false) String comentario) {

        log.info("PATCH /documentos/{}/aprobar", id);
        DocumentoDTO aprobado = documentoService.aprobarDocumento(id, aprobadoPor, comentario);
        return ResponseEntity.ok(aprobado);
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<DocumentoDTO> rechazarDocumento(
            @PathVariable Long id,
            @RequestParam String comentario) {

        log.info("PATCH /documentos/{}/rechazar", id);
        DocumentoDTO rechazado = documentoService.rechazarDocumento(id, comentario);
        return ResponseEntity.ok(rechazado);
    }

    // ========================================
    // VENCIMIENTOS Y ALERTAS
    // ========================================

    @GetMapping("/vencidos")
    public ResponseEntity<List<DocumentoDTO>> listarVencidos() {
        log.info("GET /documentos/vencidos");
        List<DocumentoDTO> vencidos = documentoService.listarVencidos();
        return ResponseEntity.ok(vencidos);
    }

    @GetMapping("/proximos-a-vencer")
    public ResponseEntity<List<DocumentoDTO>> listarProximosAVencer(
            @RequestParam(defaultValue = "30") Integer dias) {
        log.info("GET /documentos/proximos-a-vencer?dias={}", dias);
        List<DocumentoDTO> proximos = documentoService.listarProximosAVencer(dias);
        return ResponseEntity.ok(proximos);
    }

    @PostMapping("/enviar-alertas")
    public ResponseEntity<Void> enviarAlertasVencimiento() {
        log.info("POST /documentos/enviar-alertas");
        documentoService.enviarAlertasVencimiento();
        return ResponseEntity.ok().build();
    }

    // ========================================
    // DOCUMENTOS OBLIGATORIOS Y REPORTES
    // ========================================

    @GetMapping("/empleado/{empleadoId}/faltantes")
    public ResponseEntity<List<String>> listarDocumentosFaltantes(@PathVariable Long empleadoId) {
        log.info("GET /documentos/empleado/{}/faltantes", empleadoId);
        List<String> faltantes = documentoService.listarDocumentosObligatoriosFaltantes(empleadoId);
        return ResponseEntity.ok(faltantes);
    }

    @GetMapping("/empleado/{empleadoId}/reporte-legajo")
    public ResponseEntity<Map<String, Object>> obtenerReporteLegajo(@PathVariable Long empleadoId) {
        log.info("GET /documentos/empleado/{}/reporte-legajo", empleadoId);
        Map<String, Object> reporte = documentoService.obtenerReporteLegajo(empleadoId);
        return ResponseEntity.ok(reporte);
    }

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        log.info("GET /documentos/estadisticas");
        Map<String, Object> estadisticas = documentoService.obtenerEstadisticasGenerales();
        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/estadisticas/por-categoria")
    public ResponseEntity<Map<String, Long>> contarPorCategoria() {
        log.info("GET /documentos/estadisticas/por-categoria");
        Map<String, Long> contadores = documentoService.contarPorCategoria();
        return ResponseEntity.ok(contadores);
    }
}
