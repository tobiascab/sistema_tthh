package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.DocumentoDTO;
import com.coopreducto.tthh.entity.Documento;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.mapper.DocumentoMapper;
import com.coopreducto.tthh.repository.DocumentoRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.DocumentoService;
import com.coopreducto.tthh.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentoServiceImpl implements DocumentoService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DocumentoServiceImpl.class);

    private final DocumentoRepository documentoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final DocumentoMapper documentoMapper;
    private final FileStorageService fileStorageService;

    // ========================================
    // UPLOAD Y GESTIÓN DE ARCHIVOS
    // ========================================

    @Override
    public DocumentoDTO subirDocumento(MultipartFile file, DocumentoDTO metadataDTO) {
        log.info("Subiendo documento para empleado ID: {}", metadataDTO.getEmpleadoId());

        // Validar empleado existe
        Long empleadoIdValue = metadataDTO.getEmpleadoId();
        if (empleadoIdValue == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        // Verificar que el empleado existe
        if (!empleadoRepository.existsById(empleadoIdValue)) {
            throw new RuntimeException("Empleado no encontrado: " + empleadoIdValue);
        }

        // Almacenar archivo físicamente
        String rutaArchivo = fileStorageService.almacenarArchivo(
                file,
                metadataDTO.getEmpleadoId(),
                metadataDTO.getCategoria());

        // Completar metadata del DTO
        metadataDTO.setRutaArchivo(rutaArchivo);
        metadataDTO.setNombreArchivo(file.getOriginalFilename());
        metadataDTO.setExtension(fileStorageService.obtenerExtension(file.getOriginalFilename()));
        metadataDTO.setMimeType(file.getContentType());
        metadataDTO.setTamanioBytes(file.getSize());
        metadataDTO.setVersion(1);
        metadataDTO.setEstado("VIGENTE");

        // Crear entidad y guardar
        Documento documento = documentoMapper.toEntity(metadataDTO);
        if (documento == null) {
            throw new RuntimeException("Error al crear la entidad del documento");
        }
        Documento documentoGuardado = documentoRepository.save(documento);

        log.info("Documento creado exitosamente con ID: {}", documentoGuardado.getId());
        return documentoMapper.toDTO(documentoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource descargarDocumento(Long id) {
        log.info("Descargando documento ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        return fileStorageService.cargarArchivo(documento.getRutaArchivo());
    }

    @Override
    public void eliminarDocumento(Long id) {
        log.info("Eliminando documento ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        // Eliminar archivo físico
        try {
            fileStorageService.eliminarArchivo(documento.getRutaArchivo());
        } catch (Exception e) {
            log.error("Error al eliminar archivo físico: {}", documento.getRutaArchivo(), e);
        }

        // Eliminar registro
        documentoRepository.delete(documento);
        log.info("Documento eliminado exitosamente: {}", id);
    }

    // ========================================
    // CRUD DE METADATA
    // ========================================

    @Override
    public DocumentoDTO actualizarMetadata(Long id, DocumentoDTO dto) {
        log.info("Actualizando metadata del documento ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        documentoMapper.updateEntity(documento, dto);
        if (documento == null) {
            throw new RuntimeException("Error al actualizar el documento");
        }
        Documento documentoActualizado = documentoRepository.save(documento);

        return documentoMapper.toDTO(documentoActualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentoDTO obtenerPorId(Long id) {
        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        return documentoMapper.toDTO(documento);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoDTO> listarTodos(Pageable pageable) {
        if (pageable == null) {
            throw new RuntimeException("El parámetro pageable es requerido");
        }
        return documentoRepository.findAll(pageable).map(documentoMapper::toDTO);
    }

    // ========================================
    // BÚSQUEDAS POR EMPLEADO
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarPorEmpleado(Long empleadoId) {
        log.info("Listando documentos del empleado ID: {}", empleadoId);

        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        return documentoRepository.findByEmpleadoOrderByCreatedAtDesc(empleado).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoDTO> listarPorEmpleado(Long empleadoId, Pageable pageable) {
        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        return documentoRepository.findByEmpleado(empleado, pageable).map(documentoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarPorEmpleadoYCategoria(Long empleadoId, String categoria) {
        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        return documentoRepository.findByEmpleadoAndCategoria(empleado, categoria).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarPorEmpleado(Long empleadoId) {
        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        return documentoRepository.countByEmpleado(empleado);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<DocumentoDTO>> listarAgrupadosPorCategoria(Long empleadoId) {
        log.info("Listando documentos agrupados por categoría para empleado ID: {}", empleadoId);

        List<DocumentoDTO> documentos = listarPorEmpleado(empleadoId);

        return documentos.stream()
                .collect(Collectors.groupingBy(DocumentoDTO::getCategoria));
    }

    // ========================================
    // BÚSQUEDAS POR CATEGORÍA Y ESTADO
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarPorCategoria(String categoria) {
        return documentoRepository.findByCategoria(categoria).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarPorEstado(String estado) {
        return documentoRepository.findByEstado(estado).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoDTO> listarPorEstado(String estado, Pageable pageable) {
        return documentoRepository.findByEstado(estado, pageable).map(documentoMapper::toDTO);
    }

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public Page<DocumentoDTO> buscarConFiltros(Long empleadoId, String categoria,
            String estado, String search, Pageable pageable) {
        return documentoRepository.findByFilters(empleadoId, categoria, estado, search, pageable)
                .map(documentoMapper::toDTO);
    }

    // ========================================
    // VERSIONES
    // ========================================

    @Override
    public DocumentoDTO crearNuevaVersion(Long documentoId, MultipartFile file) {
        log.info("Creando nueva versión del documento ID: {}", documentoId);

        if (documentoId == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documentoOriginal = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento original no encontrado: " + documentoId));

        // Obtener siguiente número de versión
        Integer maxVersion = documentoRepository.findMaxVersion(documentoId);
        Integer nuevaVersion = (maxVersion != null ? maxVersion : 1) + 1;

        // Crear DTO con metadata del original
        DocumentoDTO nuevoDocumentoDTO = documentoMapper.toDTO(documentoOriginal);
        nuevoDocumentoDTO.setId(null); // Nuevo ID
        nuevoDocumentoDTO.setVersion(nuevaVersion);
        nuevoDocumentoDTO.setDocumentoPadreId(documentoId);

        // Subir nuevo archivo
        return subirDocumento(file, nuevoDocumentoDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> obtenerVersiones(Long documentoId) {
        return documentoRepository.findByDocumentoPadreId(documentoId).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // APROBACIÓN
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarPendientesAprobacion() {
        return documentoRepository.findPendientesAprobacion().stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentoDTO aprobarDocumento(Long id, String aprobadoPor, String comentario) {
        log.info("Aprobando documento ID: {} por {}", id, aprobadoPor);

        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        documento.setEstaAprobado(true);
        documento.setAprobadoPor(aprobadoPor);
        documento.setFechaAprobacion(LocalDateTime.now());
        documento.setComentarioAprobacion(comentario);
        documento.setEstado("APROBADO");

        Documento documentoActualizado = documentoRepository.save(documento);
        return documentoMapper.toDTO(documentoActualizado);
    }

    @Override
    public DocumentoDTO rechazarDocumento(Long id, String comentario) {
        log.info("Rechazando documento ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del documento es requerido");
        }
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado: " + id));

        documento.setEstaAprobado(false);
        documento.setComentarioAprobacion(comentario);
        documento.setEstado("RECHAZADO");

        Documento documentoActualizado = documentoRepository.save(documento);
        return documentoMapper.toDTO(documentoActualizado);
    }

    // ========================================
    // VENCIMIENTOS Y ALERTAS
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarVencidos() {
        return documentoRepository.findVencidos().stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoDTO> listarProximosAVencer(Integer dias) {
        LocalDate fechaLimite = LocalDate.now().plusDays(dias != null ? dias : 30);
        return documentoRepository.findProximosAVencer(fechaLimite).stream()
                .map(documentoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void enviarAlertasVencimiento() {
        log.info("Enviando alertas de vencimiento...");

        List<Documento> proximosAVencer = documentoRepository.findProximosAVencer(LocalDate.now().plusDays(30));

        for (Documento documento : proximosAVencer) {
            // Aquí se implementaría el envío de email/notificación
            log.info("Alerta: Documento {} vence el {}",
                    documento.getNombre(),
                    documento.getFechaVencimiento());

            documento.setAlertaEnviada(true);
            documentoRepository.save(documento);
        }

        log.info("Alertas enviadas para {} documentos", proximosAVencer.size());
    }

    // ========================================
    // DOCUMENTOS OBLIGATORIOS
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<String> listarDocumentosObligatoriosFaltantes(Long empleadoId) {
        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        return documentoRepository.findDocumentosObligatoriosFaltantes(empleado);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerReporteLegajo(Long empleadoId) {
        log.info("Generando reporte de legajo para empleado ID: {}", empleadoId);

        if (empleadoId == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + empleadoId));

        Map<String, Object> reporte = new HashMap<>();

        // Información básica
        reporte.put("empleadoId", empleadoId);
        reporte.put("empleadoNombre", empleado.getNombreCompleto());
        reporte.put("empleadoDocumento", empleado.getNumeroDocumento());

        // Contadores
        Long totalDocumentos = contarPorEmpleado(empleadoId);
        reporte.put("totalDocumentos", totalDocumentos);

        // Documentos por categoría
        Map<String, List<DocumentoDTO>> porCategoria = listarAgrupadosPorCategoria(empleadoId);
        Map<String, Integer> contadoresPorCategoria = new HashMap<>();
        porCategoria.forEach((cat, docs) -> contadoresPorCategoria.put(cat, docs.size()));
        reporte.put("documentosPorCategoria", contadoresPorCategoria);

        // Documentos obligatorios faltantes
        List<String> faltantes = listarDocumentosObligatoriosFaltantes(empleadoId);
        reporte.put("documentosFaltantes", faltantes);
        reporte.put("legajoCompleto", faltantes.isEmpty());

        // Documentos vencidos o próximos a vencer
        List<DocumentoDTO> todosDocumentos = listarPorEmpleado(empleadoId);
        long vencidos = todosDocumentos.stream()
                .filter(d -> d.getEstaVencido() != null && d.getEstaVencido())
                .count();
        long proximosAVencer = todosDocumentos.stream()
                .filter(d -> d.getDiasParaVencer() != null && d.getDiasParaVencer() <= 30)
                .count();

        reporte.put("documentosVencidos", vencidos);
        reporte.put("documentosProximosAVencer", proximosAVencer);

        // Últimos documentos agregados
        List<DocumentoDTO> ultimos = todosDocumentos.stream()
                .sorted((d1, d2) -> d2.getCreatedAt().compareTo(d1.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
        reporte.put("ultimosDocumentos", ultimos);

        return reporte;
    }

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public Long contarPorCategoria(String categoria) {
        return documentoRepository.countByCategoria(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarPorEstado(String estado) {
        return documentoRepository.countByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> contarPorCategoria() {
        List<Object[]> resultados = documentoRepository.countByCategoria();
        Map<String, Long> mapa = new HashMap<>();
        resultados.forEach(r -> mapa.put((String) r[0], (Long) r[1]));
        return mapa;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();

        estadisticas.put("totalDocumentos", documentoRepository.count());
        estadisticas.put("documentosPorCategoria", contarPorCategoria());
        estadisticas.put("documentosVencidos", listarVencidos().size());
        estadisticas.put("documentosProximosAVencer", listarProximosAVencer(30).size());
        estadisticas.put("pendientesAprobacion", listarPendientesAprobacion().size());

        return estadisticas;
    }
}
