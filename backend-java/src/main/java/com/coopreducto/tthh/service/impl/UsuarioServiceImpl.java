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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
            // TODO: Enviar email con contraseña temporal
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

        // TODO: Enviar email con link de recuperación
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
}
