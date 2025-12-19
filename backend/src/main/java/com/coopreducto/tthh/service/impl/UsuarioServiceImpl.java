package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.UsuarioDTO;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.entity.Rol;
import com.coopreducto.tthh.entity.Usuario;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.repository.RolRepository;
import com.coopreducto.tthh.repository.UsuarioRepository;
import com.coopreducto.tthh.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repository;
    private final RolRepository rolRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;

    private UsuarioDTO toDTO(Usuario entity) {
        if (entity == null)
            return null;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setNombres(entity.getNombres());
        dto.setApellidos(entity.getApellidos());
        dto.setNombreCompleto(entity.getNombreCompleto());
        dto.setEstado(entity.getEstado());
        dto.setUltimoAcceso(entity.getUltimoAcceso());
        dto.setRequiereCambioPassword(entity.getRequiereCambioPassword());
        dto.setAvatarUrl(entity.getAvatarUrl());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getRol() != null) {
            dto.setRolId(entity.getRol().getId());
            dto.setRolNombre(entity.getRol().getNombre());
        }

        if (entity.getEmpleado() != null) {
            dto.setEmpleadoId(entity.getEmpleado().getId());
            dto.setEmpleadoNombre(entity.getEmpleado().getNombreCompleto());
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDTO getByUsername(String username) {
        return repository.findByUsername(username).map(this::toDTO).orElse(null);
    }

    @Override
    @Transactional
    public UsuarioDTO create(UsuarioDTO dto) {
        if (repository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Ya existe un usuario con ese nombre de usuario");
        }
        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        Usuario entity = new Usuario();
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        entity.setNombres(dto.getNombres());
        entity.setApellidos(dto.getApellidos());
        entity.setEstado("ACTIVO");
        entity.setRequiereCambioPassword(true);
        entity.setIntentosFallidos(0);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        if (dto.getRolId() != null) {
            Rol rol = rolRepository.findById(dto.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            entity.setRol(rol);
        }

        if (dto.getEmpleadoId() != null) {
            Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            entity.setEmpleado(empleado);
        }

        return toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public UsuarioDTO update(Long id, UsuarioDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setEmail(dto.getEmail());
            existing.setNombres(dto.getNombres());
            existing.setApellidos(dto.getApellidos());
            existing.setAvatarUrl(dto.getAvatarUrl());
            existing.setUpdatedAt(LocalDateTime.now());

            if (dto.getRolId() != null) {
                Rol rol = rolRepository.findById(dto.getRolId())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                existing.setRol(rol);
            }

            if (dto.getEmpleadoId() != null) {
                Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                        .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
                existing.setEmpleado(empleado);
            }

            return toDTO(repository.save(existing));
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void activar(Long id) {
        repository.findById(id).ifPresent(u -> {
            u.setEstado("ACTIVO");
            u.setUpdatedAt(LocalDateTime.now());
            repository.save(u);
        });
    }

    @Override
    @Transactional
    public void desactivar(Long id) {
        repository.findById(id).ifPresent(u -> {
            u.setEstado("INACTIVO");
            u.setUpdatedAt(LocalDateTime.now());
            repository.save(u);
        });
    }

    @Override
    @Transactional
    public void bloquear(Long id) {
        repository.findById(id).ifPresent(u -> {
            u.setEstado("BLOQUEADO");
            u.setBloqueadoHasta(LocalDateTime.now().plusDays(30));
            u.setUpdatedAt(LocalDateTime.now());
            repository.save(u);
        });
    }

    @Override
    @Transactional
    public void desbloquear(Long id) {
        repository.findById(id).ifPresent(u -> {
            u.setEstado("ACTIVO");
            u.setBloqueadoHasta(null);
            u.setIntentosFallidos(0);
            u.setUpdatedAt(LocalDateTime.now());
            repository.save(u);
        });
    }

    @Override
    @Transactional
    public void cambiarPassword(Long id, String currentPassword, String newPassword) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setRequiereCambioPassword(false);
        usuario.setUpdatedAt(LocalDateTime.now());
        repository.save(usuario);
    }

    @Override
    @Transactional
    public void resetearPassword(Long id) {
        repository.findById(id).ifPresent(u -> {
            String tempPassword = UUID.randomUUID().toString().substring(0, 8);
            u.setPassword(passwordEncoder.encode(tempPassword));
            u.setRequiereCambioPassword(true);
            u.setUpdatedAt(LocalDateTime.now());
            repository.save(u);
            log.info("CONTRASEÑA TEMPORAL GENERADA para el usuario {}: {}", u.getUsername(), tempPassword);
            // En entorno real aquí se enviaría el email
        });
    }

    @Override
    @Transactional
    public String generarTokenRecuperacion(String email) {
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email no encontrado"));

        String token = UUID.randomUUID().toString();
        usuario.setTokenRecuperacion(token);
        usuario.setTokenExpiracion(LocalDateTime.now().plusHours(24));
        repository.save(usuario);

        log.info("TOKEN DE RECUPERACIÓN GENERADO para el email {}: {}", email, token);
        // En entorno real aquí se enviaría el email con el link
        return token;
    }

    @Override
    @Transactional
    public void recuperarPassword(String token, String newPassword) {
        Usuario usuario = repository.findByTokenRecuperacion(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (usuario.getTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setTokenRecuperacion(null);
        usuario.setTokenExpiracion(null);
        usuario.setRequiereCambioPassword(false);
        usuario.setUpdatedAt(LocalDateTime.now());
        repository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> buscar(String search) {
        return repository.buscar(search).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> getByRol(Long rolId) {
        return repository.findByRolId(rolId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDTO> getByEstado(String estado) {
        return repository.findByEstado(estado).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countByEstado(String estado) {
        return repository.countByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByRol(Long rolId) {
        return repository.countByRolId(rolId);
    }

    @Override
    @Transactional
    public Map<String, Object> syncEmpleadosToUsuarios() {
        log.info("Iniciando sincronización de empleados a usuarios...");
        List<Empleado> empleadosActivos = empleadoRepository.findByEstado("ACTIVO");
        int creados = 0;
        int existentes = 0;
        int errores = 0;

        Rol rolColaborador = rolRepository.findByNombre("COLABORADOR")
                .orElseGet(() -> rolRepository.save(
                        Rol.builder()
                                .nombre("COLABORADOR")
                                .descripcion("Rol por defecto para empleados")
                                .activo(true)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build()));

        Rol rolGerencia = rolRepository.findByNombre("GERENCIA")
                .orElse(null);

        for (Empleado empleado : empleadosActivos) {
            try {
                // Verificar si ya tiene usuario asociado
                if (repository.findByEmpleadoId(empleado.getId()).isPresent()) {
                    existentes++;
                    continue;
                }

                // Verificar si existe usuario con el mismo documento (username)
                String username = empleado.getNumeroDocumento();
                if (username == null || username.isBlank()) {
                    log.warn("Empleado {} no tiene número de documento", empleado.getId());
                    errores++;
                    continue;
                }

                if (repository.existsByUsername(username)) {
                    log.warn("Ya existe usuario con username {} pero no está asociado al empleado {}", username,
                            empleado.getId());
                    existentes++;
                    // Aquí podríamos intentar asociarlo si la lógica de negocio lo permite,
                    // pero por seguridad solo logueamos.
                    continue;
                }

                // Crear usuario
                Usuario nuevoUsuario = new Usuario();
                nuevoUsuario.setUsername(username);
                // Password inicial es el mismo documento
                nuevoUsuario.setPassword(passwordEncoder.encode(username));
                nuevoUsuario.setNombres(empleado.getNombres());
                nuevoUsuario.setApellidos(empleado.getApellidos());

                // Email: si no tiene, generamos uno dummy o lo dejamos null si la entidad lo
                // permite (en este caso lo seteamos si existe)
                if (empleado.getEmail() != null && !repository.existsByEmail(empleado.getEmail())) {
                    nuevoUsuario.setEmail(empleado.getEmail());
                } else {
                    // Generar email dummy único si es obligatorio o null
                    nuevoUsuario.setEmail(username + "@sinemail.com");
                }

                nuevoUsuario.setEstado("ACTIVO");
                nuevoUsuario.setRequiereCambioPassword(true);
                nuevoUsuario.setIntentosFallidos(0);
                nuevoUsuario.setCreatedAt(LocalDateTime.now());
                nuevoUsuario.setUpdatedAt(LocalDateTime.now());
                nuevoUsuario.setEmpleado(empleado);

                // Asignar Rol
                if (rolGerencia != null && empleado.getCargo() != null &&
                        empleado.getCargo().toUpperCase().contains("GERENTE")) {
                    nuevoUsuario.setRol(rolGerencia);
                } else {
                    nuevoUsuario.setRol(rolColaborador);
                }

                repository.save(nuevoUsuario);
                creados++;

            } catch (Exception e) {
                log.error("Error al sincronizar empleado {}: {}", empleado.getId(), e.getMessage());
                errores++;
            }
        }

        log.info("Sincronización finalizada. Creados: {}, Existentes: {}, Errores: {}", creados, existentes, errores);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("creados", creados);
        resultado.put("existentes", existentes);
        resultado.put("errores", errores);
        resultado.put("totalProcesados", empleadosActivos.size());

        return resultado;
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return repository.count();
    }
}
