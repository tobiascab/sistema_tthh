package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.RolDTO;
import com.coopreducto.tthh.entity.Rol;
import com.coopreducto.tthh.repository.RolRepository;
import com.coopreducto.tthh.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {

    private final RolRepository repository;

    private RolDTO toDTO(Rol entity) {
        if (entity == null)
            return null;
        RolDTO dto = new RolDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPermisos(entity.getPermisos());
        dto.setActivo(entity.getActivo());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private Rol toEntity(RolDTO dto) {
        if (dto == null)
            return null;
        Rol entity = new Rol();
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPermisos(dto.getPermisos());
        entity.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return entity;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RolDTO> getActivos() {
        return repository.findByActivoTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RolDTO getById(Long id) {
        return repository.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public RolDTO getByNombre(String nombre) {
        return repository.findByNombre(nombre).map(this::toDTO).orElse(null);
    }

    @Override
    @Transactional
    public RolDTO create(RolDTO dto) {
        if (repository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("Ya existe un rol con ese nombre");
        }
        Rol entity = toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());
        return toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public RolDTO update(Long id, RolDTO dto) {
        return repository.findById(id).map(existing -> {
            existing.setNombre(dto.getNombre());
            existing.setDescripcion(dto.getDescripcion());
            existing.setPermisos(dto.getPermisos());
            existing.setActivo(dto.getActivo());
            existing.setUpdatedAt(LocalDateTime.now());
            return toDTO(repository.save(existing));
        }).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
