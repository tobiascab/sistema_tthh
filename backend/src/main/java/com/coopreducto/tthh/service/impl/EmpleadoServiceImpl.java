package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.EmpleadoDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.mapper.EmpleadoMapper;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpleadoServiceImpl implements EmpleadoService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(EmpleadoServiceImpl.class);

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoMapper empleadoMapper;
    private final com.coopreducto.tthh.service.FileStorageService fileStorageService;

    // ========================================
    // CRUD BÁSICO
    // ========================================

    @Override
    public EmpleadoDTO actualizarFoto(Long id, org.springframework.web.multipart.MultipartFile file) {
        log.info("Actualizando foto para empleado ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        String rutaArchivo = fileStorageService.almacenarArchivo(file, id, "FOTOS");

        // Asumiendo que fileStorageService devuelve la ruta relativa, construimos la
        // URL completa si es necesario
        // O si ya es accesible, lo guardamos directo.
        // Por ahora guardamos la ruta relativa o lo que devuelva el servicio.
        empleado.setFotoUrl(rutaArchivo);

        Empleado actualizado = empleadoRepository.save(empleado);
        return empleadoMapper.toDTO(actualizado);
    }

    @Override
    public EmpleadoDTO crear(EmpleadoDTO empleadoDTO) {
        log.info("Creando empleado: {}", empleadoDTO.getNombres());

        // Validar datos únicos
        validarDatosUnicos(empleadoDTO, null);

        // Establecer estado por defecto si no viene
        if (empleadoDTO.getEstado() == null || empleadoDTO.getEstado().isBlank()) {
            empleadoDTO.setEstado("ACTIVO");
        }

        // Calcular días de vacaciones disponibles
        if (empleadoDTO.getDiasVacacionesAnuales() != null && empleadoDTO.getDiasVacacionesUsados() != null) {
            empleadoDTO.setDiasVacacionesDisponibles(
                    empleadoDTO.getDiasVacacionesAnuales() - empleadoDTO.getDiasVacacionesUsados());
        }

        Empleado empleado = empleadoMapper.toEntity(empleadoDTO);
        if (empleado == null) {
            throw new RuntimeException("Error al crear la entidad del empleado");
        }
        Empleado empleadoGuardado = empleadoRepository.save(empleado);

        log.info("Empleado creado exitosamente con ID: {}", empleadoGuardado.getId());
        return empleadoMapper.toDTO(empleadoGuardado);
    }

    @Override
    public EmpleadoDTO actualizar(Long id, EmpleadoDTO empleadoDTO) {
        log.info("Actualizando empleado ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleadoExistente = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        // Validar datos únicos (excluyendo el empleado actual)
        validarDatosUnicos(empleadoDTO, id);

        // Actualizar entidad
        empleadoMapper.updateEntity(empleadoExistente, empleadoDTO);

        if (empleadoExistente == null) {
            throw new RuntimeException("Error al actualizar el empleado");
        }
        Empleado empleadoActualizado = empleadoRepository.save(empleadoExistente);

        log.info("Empleado actualizado exitosamente: {}", id);
        return empleadoMapper.toDTO(empleadoActualizado);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpleadoDTO obtenerPorId(Long id) {
        log.debug("Obteniendo empleado por ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        return empleadoMapper.toDTO(empleado);
    }

    @Override
    public void eliminar(Long id) {
        log.info("Eliminando empleado ID: {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        if (!empleadoRepository.existsById(id)) {
            throw new RuntimeException("Empleado no encontrado con ID: " + id);
        }

        empleadoRepository.deleteById(id);
        log.info("Empleado eliminado exitosamente: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> listarTodos(Pageable pageable) {
        log.debug("Listando todos los empleados con paginación");
        if (pageable == null) {
            throw new RuntimeException("El parámetro pageable es requerido");
        }
        return empleadoRepository.findAll(pageable).map(empleadoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> listarTodos() {
        log.debug("Listando todos los empleados");
        return empleadoRepository.findAll().stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BÚSQUEDAS ESPECÍFICAS
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public EmpleadoDTO buscarPorNumeroDocumento(String numeroDocumento) {
        log.debug("Buscando empleado por número de documento: {}", numeroDocumento);

        return empleadoRepository.findByNumeroDocumento(numeroDocumento)
                .map(empleadoMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpleadoDTO buscarPorNumeroSocio(String numeroSocio) {
        log.debug("Buscando empleado por número de socio: {}", numeroSocio);

        return empleadoRepository.findByNumeroSocio(numeroSocio)
                .map(empleadoMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public EmpleadoDTO buscarPorEmail(String email) {
        log.debug("Buscando empleado por email: {}", email);

        return empleadoRepository.findByEmail(email)
                .map(empleadoMapper::toDTO)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> buscarPorEstado(String estado) {
        log.debug("Buscando empleados por estado: {}", estado);

        return empleadoRepository.findByEstado(estado).stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> buscarPorEstado(String estado, Pageable pageable) {
        log.debug("Buscando empleados por estado con paginación: {}", estado);
        return empleadoRepository.findByEstado(estado, pageable).map(empleadoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> buscarPorSucursal(String sucursal, Pageable pageable) {
        log.debug("Buscando empleados por sucursal: {}", sucursal);
        return empleadoRepository.findBySucursal(sucursal, pageable).map(empleadoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> buscarPorArea(String area, Pageable pageable) {
        log.debug("Buscando empleados por área: {}", area);
        return empleadoRepository.findByArea(area, pageable).map(empleadoMapper::toDTO);
    }

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> buscar(String search, Pageable pageable) {
        log.debug("Búsqueda de empleados: {}", search);

        if (search == null || search.isBlank()) {
            return listarTodos(pageable);
        }

        return empleadoRepository.searchEmpleados(search, pageable).map(empleadoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmpleadoDTO> buscarConFiltros(String estado, String sucursal, String area,
            String cargo, String search, Pageable pageable) {
        log.debug("Búsqueda con filtros - Estado: {}, Sucursal: {}, Área: {}, Cargo: {}, Search: {}",
                estado, sucursal, area, cargo, search);

        return empleadoRepository.findByFilters(estado, sucursal, area, cargo, search, pageable)
                .map(empleadoMapper::toDTO);
    }

    // ========================================
    // GESTIÓN DE ESTADOS
    // ========================================

    @Override
    public EmpleadoDTO cambiarEstado(Long id, String nuevoEstado, String motivo) {
        log.info("Cambiando estado del empleado {} a {}", id, nuevoEstado);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        String estadoAnterior = empleado.getEstado();
        empleado.setEstado(nuevoEstado);

        if ("INACTIVO".equals(nuevoEstado)) {
            empleado.setMotivoBaja(motivo);
            empleado.setFechaEgreso(LocalDate.now());
        }

        Empleado empleadoActualizado = empleadoRepository.save(empleado);

        log.info("Estado cambiado de {} a {} para empleado {}", estadoAnterior, nuevoEstado, id);
        return empleadoMapper.toDTO(empleadoActualizado);
    }

    @Override
    public EmpleadoDTO activar(Long id) {
        return cambiarEstado(id, "ACTIVO", null);
    }

    @Override
    public EmpleadoDTO inactivar(Long id, String motivo) {
        return cambiarEstado(id, "INACTIVO", motivo);
    }

    @Override
    public EmpleadoDTO suspender(Long id, String motivo, LocalDate fechaFin) {
        log.info("Suspendiendo empleado {} hasta {}", id, fechaFin);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        empleado.setEstado("SUSPENDIDO");
        empleado.setMotivoBaja(motivo);
        // Aquí podrías agregar un campo fechaFinSuspension si lo necesitas

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return empleadoMapper.toDTO(empleadoActualizado);
    }

    // ========================================
    // CONSULTAS ESPECIALES
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> obtenerCumpleaniosDelMes() {
        log.debug("Obteniendo cumpleaños del mes");
        return empleadoRepository.findCumpleaniosDelMes().stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> obtenerAniversariosDelMes() {
        log.debug("Obteniendo aniversarios del mes");
        return empleadoRepository.findAniversariosDelMes().stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> obtenerContratosProximosAVencer(Integer dias) {
        log.debug("Obteniendo contratos próximos a vencer en {} días", dias);
        LocalDate fecha = LocalDate.now().plusDays(dias != null ? dias : 30);

        return empleadoRepository.findContratosProximosAVencer(fecha).stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> obtenerEmpleadosSinExamenMedico(Integer meses) {
        log.debug("Obteniendo empleados sin examen médico en {} meses", meses);
        LocalDate fechaLimite = LocalDate.now().minusMonths(meses != null ? meses : 12);

        return empleadoRepository.findEmpleadosSinExamenMedicoReciente(fechaLimite).stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmpleadoDTO> obtenerEmpleadosConVacacionesDisponibles() {
        log.debug("Obteniendo empleados con vacaciones disponibles");
        return empleadoRepository.findEmpleadosConVacacionesDisponibles().stream()
                .map(empleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public Long contarActivos() {
        return empleadoRepository.countActivos();
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarInactivos() {
        return empleadoRepository.countInactivos();
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarPorEstado(String estado) {
        return empleadoRepository.countByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> contarPorSucursal() {
        List<Object[]> resultados = empleadoRepository.countBySucursal();
        Map<String, Long> mapa = new HashMap<>();
        resultados.forEach(r -> mapa.put((String) r[0], (Long) r[1]));
        return mapa;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> contarPorArea() {
        List<Object[]> resultados = empleadoRepository.countByArea();
        Map<String, Long> mapa = new HashMap<>();
        resultados.forEach(r -> mapa.put((String) r[0], (Long) r[1]));
        return mapa;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> contarPorCargo() {
        List<Object[]> resultados = empleadoRepository.countByCargo();
        Map<String, Long> mapa = new HashMap<>();
        resultados.forEach(r -> mapa.put((String) r[0], (Long) r[1]));
        return mapa;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> contarPorGenero() {
        List<Object[]> resultados = empleadoRepository.countByGenero();
        Map<String, Long> mapa = new HashMap<>();
        resultados.forEach(r -> mapa.put((String) r[0], (Long) r[1]));
        return mapa;
    }

    @Override
    @Transactional(readOnly = true)
    public Double obtenerEdadPromedio() {
        return empleadoRepository.getEdadPromedio();
    }

    @Override
    @Transactional(readOnly = true)
    public Double obtenerAntiguedadPromedio() {
        return empleadoRepository.getAntiguedadPromedio();
    }

    @Override
    @Transactional(readOnly = true)
    public Double obtenerSalarioPromedio() {
        return empleadoRepository.getSalarioPromedio();
    }

    // ========================================
    // VALIDACIONES
    // ========================================

    @Override
    @Transactional(readOnly = true)
    public boolean existeNumeroDocumento(String numeroDocumento) {
        return empleadoRepository.existsByNumeroDocumento(numeroDocumento);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeNumeroSocio(String numeroSocio) {
        return empleadoRepository.existsByNumeroSocio(numeroSocio);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return empleadoRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public void validarDatosUnicos(EmpleadoDTO empleadoDTO, Long empleadoId) {
        // Validar número de documento
        if (empleadoDTO.getNumeroDocumento() != null) {
            if (empleadoId == null) {
                // Creación
                if (empleadoRepository.existsByNumeroDocumento(empleadoDTO.getNumeroDocumento())) {
                    throw new RuntimeException("Ya existe un empleado con el número de documento: " +
                            empleadoDTO.getNumeroDocumento());
                }
            } else {
                // Actualización
                if (empleadoRepository.existsByNumeroDocumentoAndIdNot(empleadoDTO.getNumeroDocumento(), empleadoId)) {
                    throw new RuntimeException("Ya existe otro empleado con el número de documento: " +
                            empleadoDTO.getNumeroDocumento());
                }
            }
        }

        // Validar email
        if (empleadoDTO.getEmail() != null && !empleadoDTO.getEmail().isBlank()) {
            if (empleadoId == null) {
                if (empleadoRepository.existsByEmail(empleadoDTO.getEmail())) {
                    throw new RuntimeException("Ya existe un empleado con el email: " + empleadoDTO.getEmail());
                }
            } else {
                if (empleadoRepository.existsByEmailAndIdNot(empleadoDTO.getEmail(), empleadoId)) {
                    throw new RuntimeException("Ya existe otro empleado con el email: " + empleadoDTO.getEmail());
                }
            }
        }
    }

    // ========================================
    // GESTIÓN DE VACACIONES
    // ========================================

    @Override
    public EmpleadoDTO calcularDiasVacaciones(Long id) {
        log.info("Calculando días de vacaciones para empleado {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        // Calcular días disponibles
        Integer diasAnuales = empleado.getDiasVacacionesAnuales() != null ? empleado.getDiasVacacionesAnuales() : 0;
        Integer diasUsados = empleado.getDiasVacacionesUsados() != null ? empleado.getDiasVacacionesUsados() : 0;

        empleado.setDiasVacacionesDisponibles(diasAnuales - diasUsados);

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return empleadoMapper.toDTO(empleadoActualizado);
    }

    @Override
    public EmpleadoDTO registrarVacacionesUsadas(Long id, Integer dias) {
        log.info("Registrando {} días de vacaciones usadas para empleado {}", dias, id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        Integer diasUsadosActuales = empleado.getDiasVacacionesUsados() != null ? empleado.getDiasVacacionesUsados()
                : 0;

        empleado.setDiasVacacionesUsados(diasUsadosActuales + dias);

        // Recalcular disponibles
        Integer diasAnuales = empleado.getDiasVacacionesAnuales() != null ? empleado.getDiasVacacionesAnuales() : 0;
        empleado.setDiasVacacionesDisponibles(diasAnuales - empleado.getDiasVacacionesUsados());

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return empleadoMapper.toDTO(empleadoActualizado);
    }

    @Override
    public EmpleadoDTO reiniciarVacaciones(Long id) {
        log.info("Reiniciando vacaciones para empleado {}", id);

        if (id == null) {
            throw new RuntimeException("El ID del empleado es requerido");
        }
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        empleado.setDiasVacacionesUsados(0);
        empleado.setDiasVacacionesDisponibles(empleado.getDiasVacacionesAnuales());

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return empleadoMapper.toDTO(empleadoActualizado);
    }
}
