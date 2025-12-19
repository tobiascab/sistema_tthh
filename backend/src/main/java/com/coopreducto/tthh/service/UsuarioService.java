package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.UsuarioDTO;
import java.util.List;
import java.util.Map;

public interface UsuarioService {
    List<UsuarioDTO> getAll();

    UsuarioDTO getById(Long id);

    UsuarioDTO getByUsername(String username);

    UsuarioDTO create(UsuarioDTO dto);

    UsuarioDTO update(Long id, UsuarioDTO dto);

    void delete(Long id);

    // Gestión de estado
    void activar(Long id);

    void desactivar(Long id);

    void bloquear(Long id);

    void desbloquear(Long id);

    // Gestión de contraseña
    void cambiarPassword(Long id, String currentPassword, String newPassword);

    void resetearPassword(Long id);

    String generarTokenRecuperacion(String email);

    void recuperarPassword(String token, String newPassword);

    // Búsquedas
    List<UsuarioDTO> buscar(String search);

    List<UsuarioDTO> getByRol(Long rolId);

    List<UsuarioDTO> getByEstado(String estado);

    // Estadísticas
    long countByEstado(String estado);

    long countByRol(Long rolId);

    // Sincronización
    Map<String, Object> syncEmpleadosToUsuarios();

    long count();
}
