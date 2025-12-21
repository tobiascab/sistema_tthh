package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.ModuloDTO;

import java.util.List;

public interface ModuloService {

    // CRUD básico
    List<ModuloDTO> listarTodos();

    List<ModuloDTO> listarActivos();

    ModuloDTO obtenerPorId(Long id);

    ModuloDTO obtenerPorCodigo(String codigo);

    ModuloDTO crear(ModuloDTO moduloDTO);

    ModuloDTO actualizar(Long id, ModuloDTO moduloDTO);

    void eliminar(Long id);

    // Gestión de permisos por empleado
    List<ModuloDTO> obtenerModulosEmpleado(Long empleadoId);

    void asignarModulo(Long empleadoId, Long moduloId);

    void quitarModulo(Long empleadoId, Long moduloId);

    void asignarModulosMultiples(Long empleadoId, List<Long> moduloIds);

    void sincronizarModulosEmpleado(Long empleadoId, List<Long> moduloIds);

    // Verificación de permisos
    boolean tieneAccesoModulo(Long empleadoId, String codigoModulo);

    boolean tieneAccesoSelf(Long empleadoId);
}
