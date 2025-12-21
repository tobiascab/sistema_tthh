package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.ModuloDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.EmpleadoModulo;
import com.coopreducto.tthh.entity.Modulo;
import com.coopreducto.tthh.repository.EmpleadoModuloRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.repository.ModuloRepository;
import com.coopreducto.tthh.repository.UsuarioRepository;
import com.coopreducto.tthh.security.JwtService;
import com.coopreducto.tthh.service.ModuloService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ModuloServiceImpl implements ModuloService {

    private final ModuloRepository moduloRepository;
    private final EmpleadoModuloRepository empleadoModuloRepository;
    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @Override
    @Transactional(readOnly = true)
    public List<ModuloDTO> listarTodos() {
        return moduloRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModuloDTO> listarActivos() {
        return moduloRepository.findByActivoTrueOrderByOrdenAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ModuloDTO obtenerPorId(Long id) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado con ID: " + id));
        return convertToDTO(modulo);
    }

    @Override
    @Transactional(readOnly = true)
    public ModuloDTO obtenerPorCodigo(String codigo) {
        Modulo modulo = moduloRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado con código: " + codigo));
        return convertToDTO(modulo);
    }

    @Override
    public ModuloDTO crear(ModuloDTO moduloDTO) {
        if (moduloRepository.existsByCodigo(moduloDTO.getCodigo())) {
            throw new RuntimeException("Ya existe un módulo con el código: " + moduloDTO.getCodigo());
        }

        Modulo modulo = convertToEntity(moduloDTO);
        Modulo saved = moduloRepository.save(modulo);
        return convertToDTO(saved);
    }

    @Override
    public ModuloDTO actualizar(Long id, ModuloDTO moduloDTO) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado con ID: " + id));

        updateEntityFromDTO(modulo, moduloDTO);
        Modulo updated = moduloRepository.save(modulo);
        return convertToDTO(updated);
    }

    @Override
    public void eliminar(Long id) {
        if (!moduloRepository.existsById(id)) {
            throw new RuntimeException("Módulo no encontrado con ID: " + id);
        }
        moduloRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ModuloDTO> obtenerModulosEmpleado(Long empleadoId) {
        log.debug("🔍 Obteniendo módulos para empleado ID: {}", empleadoId);

        // Módulos asignados explícitamente
        List<Modulo> modulosAsignados = empleadoModuloRepository.findByEmpleadoIdAndHabilitadoTrue(empleadoId)
                .stream()
                .map(EmpleadoModulo::getModulo)
                .collect(Collectors.toList());

        // Módulos por defecto (base para todos)
        List<Modulo> modulosDefault = moduloRepository.findByEsDefaultTrue();
        log.debug("📦 Módulos default encontrados: {}", modulosDefault.size());

        // Combinar evitando duplicados por ID
        Map<Long, Modulo> modulosUnicos = new java.util.HashMap<>();
        modulosDefault.forEach(m -> modulosUnicos.put(m.getId(), m));
        modulosAsignados.forEach(m -> modulosUnicos.put(m.getId(), m));

        List<ModuloDTO> response = modulosUnicos.values().stream()
                .sorted(java.util.Comparator.comparing(Modulo::getOrden))
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        log.debug("✅ Total módulos devueltos para empleado {}: {}. Códigos: {}",
                empleadoId, response.size(),
                response.stream().map(ModuloDTO::getCodigo).collect(Collectors.joining(", ")));
        return response;
    }

    @Override
    public void asignarModulo(Long empleadoId, Long moduloId) {
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + empleadoId));

        Modulo modulo = moduloRepository.findById(moduloId)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado con ID: " + moduloId));

        // Verificar si ya existe la asignación
        empleadoModuloRepository.findByEmpleadoIdAndModuloId(empleadoId, moduloId)
                .ifPresentOrElse(
                        em -> {
                            if (!em.getHabilitado()) {
                                em.setHabilitado(true);
                                empleadoModuloRepository.save(em);
                            }
                        },
                        () -> {
                            String currentUser = com.coopreducto.tthh.util.SecurityUtils.getCurrentUsername();
                            EmpleadoModulo nuevoEM = new EmpleadoModulo(empleado, modulo, true, currentUser);
                            empleadoModuloRepository.save(nuevoEM);
                        });
    }

    @Override
    public void quitarModulo(Long empleadoId, Long moduloId) {
        empleadoModuloRepository.deleteByEmpleadoIdAndModuloId(empleadoId, moduloId);
    }

    @Override
    public void asignarModulosMultiples(Long empleadoId, List<Long> moduloIds) {
        for (Long moduloId : moduloIds) {
            asignarModulo(empleadoId, moduloId);
        }
    }

    @Override
    public void sincronizarModulosEmpleado(Long empleadoId, List<Long> moduloIds) {
        log.info("🔄 Sincronizando módulos para empleado {}: {}", empleadoId, moduloIds);
        // Eliminar todos los módulos actuales
        empleadoModuloRepository.deleteAllByEmpleadoId(empleadoId);

        // Asignar los nuevos módulos
        if (moduloIds != null && !moduloIds.isEmpty()) {
            asignarModulosMultiples(empleadoId, moduloIds);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean tieneAccesoModulo(Long empleadoId, String codigoModulo) {
        // Si el módulo es default, todos tienen acceso
        Optional<Modulo> moduloOpt = moduloRepository.findByCodigo(codigoModulo);
        if (moduloOpt.isPresent() && Boolean.TRUE.equals(moduloOpt.get().getEsDefault())) {
            return true;
        }

        return empleadoModuloRepository.existsByEmpleadoIdAndModuloCodigoAndHabilitadoTrue(empleadoId, codigoModulo);
    }

    // Métodos de conversión
    private ModuloDTO convertToDTO(Modulo modulo) {
        ModuloDTO dto = new ModuloDTO();
        dto.setId(modulo.getId());
        dto.setCodigo(modulo.getCodigo());
        dto.setNombre(modulo.getNombre());
        dto.setDescripcion(modulo.getDescripcion());
        dto.setIcono(modulo.getIcono());
        dto.setRutaMenu(modulo.getRutaMenu());
        dto.setOrden(modulo.getOrden());
        dto.setActivo(modulo.getActivo());
        dto.setEsDefault(modulo.getEsDefault());

        if (modulo.getModuloPadre() != null) {
            dto.setModuloPadreId(modulo.getModuloPadre().getId());
            dto.setModuloPadreNombre(modulo.getModuloPadre().getNombre());
        }

        return dto;
    }

    @Override
    public boolean tieneAccesoSelf(Long empleadoId) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            return false;

        // El empleadoId puede venir del token o del Usuario logueado
        // Para simplificar, usamos el JwtService si el token está disponible
        if (auth instanceof org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken) {
            String token = ((org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken) auth)
                    .getToken().getTokenValue();
            Long tokenEmpleadoId = jwtService.getEmpleadoId(token);
            return empleadoId.equals(tokenEmpleadoId);
        }

        // Si es autenticación por Usuario local (Spring Security estándar)
        String username = null;
        if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            username = ((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername();
        } else if (auth.getPrincipal() instanceof String) {
            username = (String) auth.getPrincipal();
        }

        if (username != null) {
            return usuarioRepository.findByUsername(username)
                    .map(u -> u.getEmpleado() != null && u.getEmpleado().getId().equals(empleadoId))
                    .orElse(false);
        }

        return false;
    }

    private Modulo convertToEntity(ModuloDTO dto) {
        Modulo modulo = new Modulo();
        updateEntityFromDTO(modulo, dto);
        return modulo;
    }

    private void updateEntityFromDTO(Modulo modulo, ModuloDTO dto) {
        modulo.setCodigo(dto.getCodigo());
        modulo.setNombre(dto.getNombre());
        modulo.setDescripcion(dto.getDescripcion());
        modulo.setIcono(dto.getIcono());
        modulo.setRutaMenu(dto.getRutaMenu());
        modulo.setOrden(dto.getOrden());
        modulo.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        modulo.setEsDefault(dto.getEsDefault() != null ? dto.getEsDefault() : false);

        if (dto.getModuloPadreId() != null) {
            Modulo moduloPadre = moduloRepository.findById(dto.getModuloPadreId())
                    .orElse(null);
            modulo.setModuloPadre(moduloPadre);
        }
    }
}
