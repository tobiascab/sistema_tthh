package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.EmpleadoDTO;
import com.coopreducto.tthh.service.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(EmpleadoController.class);

    private final EmpleadoService empleadoService;

    // ========================================
    // CRUD BÁSICO
    // ========================================

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<EmpleadoDTO> crear(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        log.info("POST /empleados - Creando empleado: {}", empleadoDTO.getNombres());
        EmpleadoDTO creado = empleadoService.crear(empleadoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('TTHH', 'GERENCIA')")
    public ResponseEntity<EmpleadoDTO> actualizar(
            @PathVariable("id") Long id,
            @Valid @RequestBody EmpleadoDTO empleadoDTO) {
        log.info("PUT /empleados/{} - Actualizando empleado", id);
        EmpleadoDTO actualizado = empleadoService.actualizar(id, empleadoDTO);
        return ResponseEntity.ok(actualizado);
    }

    @PostMapping(value = "/{id}/foto", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EmpleadoDTO> subirFoto(
            @PathVariable("id") Long id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        log.info("POST /empleados/{}/foto", id);
        EmpleadoDTO empleado = empleadoService.actualizarFoto(id, file);
        return ResponseEntity.ok(empleado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> obtenerPorId(@PathVariable("id") Long id) {
        log.info("GET /empleados/{}", id);
        EmpleadoDTO empleado = empleadoService.obtenerPorId(id);
        return ResponseEntity.ok(empleado);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TTHH')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        log.info("DELETE /empleados/{}", id);
        empleadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<EmpleadoDTO>> listar(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /empleados - Listando con paginación, search: {}", search);
        Page<EmpleadoDTO> empleados = (search != null && !search.isBlank())
                ? empleadoService.buscar(search, pageable)
                : empleadoService.listarTodos(pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<EmpleadoDTO>> listarTodos() {
        log.info("GET /empleados/todos - Listando todos sin paginación");
        List<EmpleadoDTO> empleados = empleadoService.listarTodos();
        return ResponseEntity.ok(empleados);
    }

    // ========================================
    // BÚSQUEDAS ESPECÍFICAS
    // ========================================

    @GetMapping("/buscar/documento/{numeroDocumento}")
    public ResponseEntity<EmpleadoDTO> buscarPorDocumento(@PathVariable("numeroDocumento") String numeroDocumento) {
        log.info("GET /empleados/buscar/documento/{}", numeroDocumento);
        EmpleadoDTO empleado = empleadoService.buscarPorNumeroDocumento(numeroDocumento);
        return empleado != null ? ResponseEntity.ok(empleado) : ResponseEntity.notFound().build();
    }

    @GetMapping("/buscar/socio/{numeroSocio}")
    public ResponseEntity<EmpleadoDTO> buscarPorSocio(@PathVariable("numeroSocio") String numeroSocio) {
        log.info("GET /empleados/buscar/socio/{}", numeroSocio);
        EmpleadoDTO empleado = empleadoService.buscarPorNumeroSocio(numeroSocio);
        return empleado != null ? ResponseEntity.ok(empleado) : ResponseEntity.notFound().build();
    }

    @GetMapping("/buscar/email/{email}")
    public ResponseEntity<EmpleadoDTO> buscarPorEmail(@PathVariable("email") String email) {
        log.info("GET /empleados/buscar/email/{}", email);
        EmpleadoDTO empleado = empleadoService.buscarPorEmail(email);
        return empleado != null ? ResponseEntity.ok(empleado) : ResponseEntity.notFound().build();
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<Page<EmpleadoDTO>> listarPorEstado(
            @PathVariable("estado") String estado,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /empleados/estado/{}", estado);
        Page<EmpleadoDTO> empleados = empleadoService.buscarPorEstado(estado, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/sucursal/{sucursal}")
    public ResponseEntity<Page<EmpleadoDTO>> listarPorSucursal(
            @PathVariable("sucursal") String sucursal,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /empleados/sucursal/{}", sucursal);
        Page<EmpleadoDTO> empleados = empleadoService.buscarPorSucursal(sucursal, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/area/{area}")
    public ResponseEntity<Page<EmpleadoDTO>> listarPorArea(
            @PathVariable("area") String area,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("GET /empleados/area/{}", area);
        Page<EmpleadoDTO> empleados = empleadoService.buscarPorArea(area, pageable);
        return ResponseEntity.ok(empleados);
    }

    // ========================================
    // BÚSQUEDA AVANZADA
    // ========================================

    @GetMapping("/buscar")
    public ResponseEntity<Page<EmpleadoDTO>> buscar(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "estado", required = false) String estado,
            @RequestParam(value = "sucursal", required = false) String sucursal,
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "cargo", required = false) String cargo,
            @PageableDefault(size = 20, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {

        log.info("GET /empleados/buscar - search: {}, estado: {}, sucursal: {}, area: {}, cargo: {}",
                search, estado, sucursal, area, cargo);

        Page<EmpleadoDTO> empleados = empleadoService.buscarConFiltros(
                estado, sucursal, area, cargo, search, pageable);

        return ResponseEntity.ok(empleados);
    }

    // ========================================
    // GESTIÓN DE ESTADOS
    // ========================================

    @PatchMapping("/{id}/estado")
    public ResponseEntity<EmpleadoDTO> cambiarEstado(
            @PathVariable("id") Long id,
            @RequestParam("estado") String estado,
            @RequestParam(value = "motivo", required = false) String motivo) {
        log.info("PATCH /empleados/{}/estado - Nuevo estado: {}", id, estado);
        EmpleadoDTO empleado = empleadoService.cambiarEstado(id, estado, motivo);
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<EmpleadoDTO> activar(@PathVariable("id") Long id) {
        log.info("PATCH /empleados/{}/activar", id);
        EmpleadoDTO empleado = empleadoService.activar(id);
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/inactivar")
    public ResponseEntity<EmpleadoDTO> inactivar(
            @PathVariable("id") Long id,
            @RequestParam("motivo") String motivo) {
        log.info("PATCH /empleados/{}/inactivar", id);
        EmpleadoDTO empleado = empleadoService.inactivar(id, motivo);
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/suspender")
    public ResponseEntity<EmpleadoDTO> suspender(
            @PathVariable("id") Long id,
            @RequestParam("motivo") String motivo,
            @RequestParam("fechaFin") LocalDate fechaFin) {
        log.info("PATCH /empleados/{}/suspender hasta {}", id, fechaFin);
        EmpleadoDTO empleado = empleadoService.suspender(id, motivo, fechaFin);
        return ResponseEntity.ok(empleado);
    }

    // ========================================
    // CONSULTAS ESPECIALES
    // ========================================

    @GetMapping("/cumpleanios")
    public ResponseEntity<List<EmpleadoDTO>> obtenerCumpleaniosDelMes() {
        log.info("GET /empleados/cumpleanios");
        List<EmpleadoDTO> empleados = empleadoService.obtenerCumpleaniosDelMes();
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/aniversarios")
    public ResponseEntity<List<EmpleadoDTO>> obtenerAniversariosDelMes() {
        log.info("GET /empleados/aniversarios");
        List<EmpleadoDTO> empleados = empleadoService.obtenerAniversariosDelMes();
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/contratos-vencer")
    public ResponseEntity<List<EmpleadoDTO>> obtenerContratosProximosAVencer(
            @RequestParam(value = "dias", defaultValue = "30") Integer dias) {
        log.info("GET /empleados/contratos-vencer?dias={}", dias);
        List<EmpleadoDTO> empleados = empleadoService.obtenerContratosProximosAVencer(dias);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/sin-examen-medico")
    public ResponseEntity<List<EmpleadoDTO>> obtenerSinExamenMedico(
            @RequestParam(value = "meses", defaultValue = "12") Integer meses) {
        log.info("GET /empleados/sin-examen-medico?meses={}", meses);
        List<EmpleadoDTO> empleados = empleadoService.obtenerEmpleadosSinExamenMedico(meses);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/con-vacaciones")
    public ResponseEntity<List<EmpleadoDTO>> obtenerConVacaciones() {
        log.info("GET /empleados/con-vacaciones");
        List<EmpleadoDTO> empleados = empleadoService.obtenerEmpleadosConVacacionesDisponibles();
        return ResponseEntity.ok(empleados);
    }

    // ========================================
    // ESTADÍSTICAS
    // ========================================

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        log.info("GET /empleados/estadisticas");

        Map<String, Object> estadisticas = Map.of(
                "activos", empleadoService.contarActivos(),
                "inactivos", empleadoService.contarInactivos(),
                "porSucursal", empleadoService.contarPorSucursal(),
                "porArea", empleadoService.contarPorArea(),
                "porCargo", empleadoService.contarPorCargo(),
                "porGenero", empleadoService.contarPorGenero(),
                "edadPromedio", empleadoService.obtenerEdadPromedio(),
                "antiguedadPromedio", empleadoService.obtenerAntiguedadPromedio(),
                "salarioPromedio", empleadoService.obtenerSalarioPromedio());

        return ResponseEntity.ok(estadisticas);
    }

    @GetMapping("/estadisticas/count")
    public ResponseEntity<Map<String, Long>> obtenerContadores() {
        log.info("GET /empleados/estadisticas/count");

        Map<String, Long> contadores = Map.of(
                "activos", empleadoService.contarActivos(),
                "inactivos", empleadoService.contarInactivos());

        return ResponseEntity.ok(contadores);
    }

    // ========================================
    // VALIDACIONES
    // ========================================

    @GetMapping("/validar/documento/{numeroDocumento}")
    public ResponseEntity<Map<String, Boolean>> validarDocumento(
            @PathVariable("numeroDocumento") String numeroDocumento) {
        boolean existe = empleadoService.existeNumeroDocumento(numeroDocumento);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @GetMapping("/validar/socio/{numeroSocio}")
    public ResponseEntity<Map<String, Boolean>> validarSocio(@PathVariable("numeroSocio") String numeroSocio) {
        boolean existe = empleadoService.existeNumeroSocio(numeroSocio);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @GetMapping("/validar/email/{email}")
    public ResponseEntity<Map<String, Boolean>> validarEmail(@PathVariable("email") String email) {
        boolean existe = empleadoService.existeEmail(email);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    // ========================================
    // GESTIÓN DE VACACIONES
    // ========================================

    @PatchMapping("/{id}/vacaciones/calcular")
    public ResponseEntity<EmpleadoDTO> calcularVacaciones(@PathVariable("id") Long id) {
        log.info("PATCH /empleados/{}/vacaciones/calcular", id);
        EmpleadoDTO empleado = empleadoService.calcularDiasVacaciones(id);
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/vacaciones/usar")
    public ResponseEntity<EmpleadoDTO> usarVacaciones(
            @PathVariable("id") Long id,
            @RequestParam("dias") Integer dias) {
        log.info("PATCH /empleados/{}/vacaciones/usar?dias={}", id, dias);
        EmpleadoDTO empleado = empleadoService.registrarVacacionesUsadas(id, dias);
        return ResponseEntity.ok(empleado);
    }

    @PatchMapping("/{id}/vacaciones/reiniciar")
    public ResponseEntity<EmpleadoDTO> reiniciarVacaciones(@PathVariable("id") Long id) {
        log.info("PATCH /empleados/{}/vacaciones/reiniciar", id);
        EmpleadoDTO empleado = empleadoService.reiniciarVacaciones(id);
        return ResponseEntity.ok(empleado);
    }
}
