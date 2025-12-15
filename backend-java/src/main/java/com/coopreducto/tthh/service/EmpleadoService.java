package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.EmpleadoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface EmpleadoService {

    // ========================================
    // CRUD BÁSICO
    // ========================================

    EmpleadoDTO crear(EmpleadoDTO empleadoDTO);

    EmpleadoDTO actualizar(Long id, EmpleadoDTO empleadoDTO);

    EmpleadoDTO actualizarFoto(Long id, org.springframework.web.multipart.MultipartFile file);

    EmpleadoDTO obtenerPorId(Long id);

    void eliminar(Long id);

    Page<EmpleadoDTO> listarTodos(Pageable pageable);

    List<EmpleadoDTO> listarTodos();

    // ========================================
    // BÚSQUEDAS ESPECÍFICAS
    // ========================================

    EmpleadoDTO buscarPorNumeroDocumento(String numeroDocumento);

    EmpleadoDTO buscarPorNumeroSocio(String numeroSocio);

    EmpleadoDTO buscarPorEmail(String email);

    List<EmpleadoDTO> buscarPorEstado(String estado);

    Page<EmpleadoDTO> buscarPorEstado(String estado, Pageable pageable);

    Page<EmpleadoDTO> buscarPorSucursal(String sucursal, Pageable pageable);

    Page<EmpleadoDTO> buscarPorArea(String area, Pageable pageable);

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    Page<EmpleadoDTO> buscar(String search, Pageable pageable);

    Page<EmpleadoDTO> buscarConFiltros(
            String estado,
            String sucursal,
            String area,
            String cargo,
            String search,
            Pageable pageable);

    // ========================================
    // GESTIÓN DE ESTADOS
    // ========================================

    EmpleadoDTO cambiarEstado(Long id, String nuevoEstado, String motivo);

    EmpleadoDTO activar(Long id);

    EmpleadoDTO inactivar(Long id, String motivo);

    EmpleadoDTO suspender(Long id, String motivo, LocalDate fechaFin);

    // ========================================
    // CONSULTAS ESPECIALES
    // ========================================

    List<EmpleadoDTO> obtenerCumpleaniosDelMes();

    List<EmpleadoDTO> obtenerAniversariosDelMes();

    List<EmpleadoDTO> obtenerContratosProximosAVencer(Integer dias);

    List<EmpleadoDTO> obtenerEmpleadosSinExamenMedico(Integer meses);

    List<EmpleadoDTO> obtenerEmpleadosConVacacionesDisponibles();

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    Long contarActivos();

    Long contarInactivos();

    Long contarPorEstado(String estado);

    Map<String, Long> contarPorSucursal();

    Map<String, Long> contarPorArea();

    Map<String, Long> contarPorCargo();

    Map<String, Long> contarPorGenero();

    Double obtenerEdadPromedio();

    Double obtenerAntiguedadPromedio();

    Double obtenerSalarioPromedio();

    // ========================================
    // VALIDACIONES
    // ========================================

    boolean existeNumeroDocumento(String numeroDocumento);

    boolean existeNumeroSocio(String numeroSocio);

    boolean existeEmail(String email);

    void validarDatosUnicos(EmpleadoDTO empleadoDTO, Long empleadoId);

    // ========================================
    // GESTIÓN DE VACACIONES
    // ========================================

    EmpleadoDTO calcularDiasVacaciones(Long id);

    EmpleadoDTO registrarVacacionesUsadas(Long id, Integer dias);

    EmpleadoDTO reiniciarVacaciones(Long id);
}
