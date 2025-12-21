package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.AuthResponseDTO;
import com.coopreducto.tthh.dto.LoginRequestDTO;
import com.coopreducto.tthh.entity.Usuario;
import com.coopreducto.tthh.repository.UsuarioRepository;
import com.coopreducto.tthh.security.JwtService;
import com.coopreducto.tthh.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponseDTO login(LoginRequestDTO request) {
        log.info("Intento de login para usuario: {}", request.getUsername());

        // Buscar usuario por username o email
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .or(() -> usuarioRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> {
                    log.warn("Usuario no encontrado: {}", request.getUsername());
                    return new RuntimeException("Credenciales inválidas");
                });

        // Verificar estado del usuario
        if (!"ACTIVO".equalsIgnoreCase(usuario.getEstado())) {
            log.warn("Usuario inactivo: {}", request.getUsername());
            throw new RuntimeException("Usuario inactivo o bloqueado");
        }

        // Verificar bloqueo temporal
        if (usuario.getBloqueadoHasta() != null && usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            log.warn("Usuario bloqueado hasta: {}", usuario.getBloqueadoHasta());
            throw new RuntimeException("Usuario bloqueado temporalmente. Intente más tarde.");
        }

        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            // Incrementar intentos fallidos
            int intentos = (usuario.getIntentosFallidos() != null ? usuario.getIntentosFallidos() : 0) + 1;
            usuario.setIntentosFallidos(intentos);

            // Bloquear después de 5 intentos
            if (intentos >= 5) {
                usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(15));
                log.warn("Usuario bloqueado por múltiples intentos fallidos: {}", request.getUsername());
            }

            usuarioRepository.save(usuario);
            throw new RuntimeException("Credenciales inválidas");
        }

        // Login exitoso - resetear intentos
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // Obtener roles
        List<String> roles = usuario.getRol() != null
                ? List.of(usuario.getRol().getNombre())
                : List.of("COLABORADOR");

        // Generar token con empleadoId si está disponible
        Long empleadoId = usuario.getEmpleado() != null ? usuario.getEmpleado().getId() : null;
        String token = jwtService.generateToken(usuario.getUsername(), usuario.getId(), roles, empleadoId);

        log.info("Login exitoso para usuario: {}", request.getUsername());

        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(8L * 3600L) // 8 horas en segundos
                .user(AuthResponseDTO.UserInfoDTO.builder()
                        .id(usuario.getId())
                        .username(usuario.getUsername())
                        .email(usuario.getEmail())
                        .nombres(usuario.getNombres())
                        .apellidos(usuario.getApellidos())
                        .avatarUrl(usuario.getAvatarUrl())
                        .roles(roles)
                        .empleadoId(usuario.getEmpleado() != null ? usuario.getEmpleado().getId() : null)
                        .build())
                .build();
    }

    @Override
    public AuthResponseDTO refreshToken(String token) {
        // Por ahora, simplemente regeneramos el token si es válido
        if (jwtService.validateToken(token)) {
            String username = jwtService.getUsername(token);
            Long userId = jwtService.getUserId(token);
            List<String> roles = jwtService.getRoles(token);

            Long empleadoId = jwtService.getEmpleadoId(token);
            String newToken = jwtService.generateToken(username, userId, roles, empleadoId);

            return AuthResponseDTO.builder()
                    .token(newToken)
                    .tokenType("Bearer")
                    .expiresIn(8L * 3600L)
                    .build();
        }
        throw new RuntimeException("Token inválido para refresh");
    }

    @Override
    public void logout(String token) {
        // En una implementación más robusta, aquí añadiríamos el token a una blacklist
        log.info("Logout ejecutado para token");
    }
}
