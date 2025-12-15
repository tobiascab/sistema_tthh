package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.DocumentoDTO;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface DocumentoService {

    // ========================================
    // UPLOAD Y GESTIÓN DE ARCHIVOS
    // ========================================

    DocumentoDTO subirDocumento(MultipartFile file, DocumentoDTO metadataDTO);

    Resource descargarDocumento(Long id);

    void eliminarDocumento(Long id);

    // ========================================
    // CRUD DE METADATA
    // ========================================

    DocumentoDTO actualizarMetadata(Long id, DocumentoDTO dto);

    DocumentoDTO obtenerPorId(Long id);

    Page<DocumentoDTO> listarTodos(Pageable pageable);

    // ========================================
    // BÚSQUEDAS POR EMPLEADO
    // ========================================

    List<DocumentoDTO> listarPorEmpleado(Long empleadoId);

    Page<DocumentoDTO> listarPorEmpleado(Long empleadoId, Pageable pageable);

    List<DocumentoDTO> listarPorEmpleadoYCategoria(Long empleadoId, String categoria);

    Long contarPorEmpleado(Long empleadoId);

    Map<String, List<DocumentoDTO>> listarAgrupadosPorCategoria(Long empleadoId);

    // ========================================
    // BÚSQUEDAS POR CATEGORÍA Y ESTADO
    // ========================================

    List<DocumentoDTO> listarPorCategoria(String categoria);

    List<DocumentoDTO> listarPorEstado(String estado);

    Page<DocumentoDTO> listarPorEstado(String estado, Pageable pageable);

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    Page<DocumentoDTO> buscarConFiltros(
            Long empleadoId,
            String categoria,
            String estado,
            String search,
            Pageable pageable);

    // ========================================
    // VERSIONES
    // ========================================

    DocumentoDTO crearNuevaVersion(Long documentoId, MultipartFile file);

    List<DocumentoDTO> obtenerVersiones(Long documentoId);

    // ========================================
    // APROBACIÓN
    // ========================================

    List<DocumentoDTO> listarPendientesAprobacion();

    DocumentoDTO aprobarDocumento(Long id, String aprobadoPor, String comentario);

    DocumentoDTO rechazarDocumento(Long id, String comentario);

    // ========================================
    // VENCIMIENTOS Y ALERTAS
    // ========================================

    List<DocumentoDTO> listarVencidos();

    List<DocumentoDTO> listarProximosAVencer(Integer dias);

    void enviarAlertasVencimiento();

    // ========================================
    // DOCUMENTOS OBLIGATORIOS
    // ========================================

    List<String> listarDocumentosObligatoriosFaltantes(Long empleadoId);

    Map<String, Object> obtenerReporteLegajo(Long empleadoId);

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    Long contarPorCategoria(String categoria);

    Long contarPorEstado(String estado);

    Map<String, Long> contarPorCategoria();

    Map<String, Object> obtenerEstadisticasGenerales();
}
