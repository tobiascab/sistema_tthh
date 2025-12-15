package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.ComunicadoDTO;
import com.coopreducto.tthh.entity.Comunicado;
import com.coopreducto.tthh.repository.ComunicadoRepository;
import com.coopreducto.tthh.service.ComunicadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class ComunicadoServiceImpl implements ComunicadoService {

    private final ComunicadoRepository comunicadoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ComunicadoDTO> findActiveForDepartamento(String departamento) {
        return comunicadoRepository.findActiveComunicadosForDepartamento(departamento, LocalDateTime.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComunicadoDTO> findAll() {
        return comunicadoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ComunicadoDTO create(ComunicadoDTO comunicadoDTO) {
        Comunicado comunicado = convertToEntity(comunicadoDTO);
        comunicado.setFechaPublicacion(LocalDateTime.now());
        return convertToDTO(comunicadoRepository.save(comunicado));
    }

    @Override
    public void delete(Long id) {
        comunicadoRepository.deleteById(id);
    }

    private ComunicadoDTO convertToDTO(Comunicado entity) {
        ComunicadoDTO dto = new ComunicadoDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setContenido(entity.getContenido());
        dto.setTipo(entity.getTipo());
        dto.setPrioridad(entity.getPrioridad());
        dto.setActivo(entity.getActivo());
        dto.setFechaPublicacion(entity.getFechaPublicacion());
        dto.setFechaExpiracion(entity.getFechaExpiracion());
        dto.setImagenUrl(entity.getImagenUrl());
        dto.setDepartamentoDestino(entity.getDepartamentoDestino());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setCreatedBy(entity.getCreatedBy());
        return dto;
    }

    private Comunicado convertToEntity(ComunicadoDTO dto) {
        Comunicado entity = new Comunicado();
        entity.setTitulo(dto.getTitulo());
        entity.setContenido(dto.getContenido());
        entity.setTipo(dto.getTipo());
        entity.setPrioridad(dto.getPrioridad());
        entity.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        entity.setFechaExpiracion(dto.getFechaExpiracion());
        entity.setImagenUrl(dto.getImagenUrl());
        entity.setDepartamentoDestino(dto.getDepartamentoDestino());
        return entity;
    }
}
