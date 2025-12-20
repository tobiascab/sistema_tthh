package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.ConfiguracionDTO;
import com.coopreducto.tthh.dto.CumpleanosManualDTO;
import com.coopreducto.tthh.entity.Configuracion;
import com.coopreducto.tthh.entity.CumpleanosManual;
import com.coopreducto.tthh.repository.ConfiguracionRepository;
import com.coopreducto.tthh.repository.CumpleanosManualRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.CumpleanosService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CumpleanosServiceImpl implements CumpleanosService {

    private final ConfiguracionRepository configRepository;
    private final CumpleanosManualRepository manualRepository;
    private final EmpleadoRepository empleadoRepository;

    private static final String CONFIG_KEY = "BIRTHDAY_SOURCE";
    private static final String VALUE_EMPLOYEES = "EMPLOYEES";
    private static final String VALUE_MANUAL = "MANUAL";

    @Override
    @Transactional(readOnly = true)
    public ConfiguracionDTO getConfiguracion() {
        Configuracion config = configRepository.findByClave(CONFIG_KEY)
                .orElse(Configuracion.builder()
                        .clave(CONFIG_KEY)
                        .valor(VALUE_EMPLOYEES)
                        .descripcion("Fuente de datos para cumpleaños: EMPLOYEES o MANUAL (Default en memoria)")
                        .updatedAt(LocalDateTime.now())
                        .build());

        return toConfigDTO(config);
    }

    @Override
    @Transactional
    public ConfiguracionDTO setConfiguracion(String valor) {
        Configuracion config = configRepository.findByClave(CONFIG_KEY)
                .orElse(Configuracion.builder()
                        .clave(CONFIG_KEY)
                        .descripcion("Fuente de datos para cumpleaños: EMPLOYEES o MANUAL")
                        .build());

        config.setValor(valor);
        config.setUpdatedAt(LocalDateTime.now());

        return toConfigDTO(configRepository.save(config));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CumpleanosManualDTO> getAllManual() {
        return manualRepository.findAll().stream()
                .map(this::toManualDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CumpleanosManualDTO createManual(CumpleanosManualDTO dto) {
        CumpleanosManual entity = new CumpleanosManual();
        entity.setNombreCompleto(dto.getNombreCompleto());
        entity.setFechaNacimiento(dto.getFechaNacimiento());
        entity.setAvatarUrl(dto.getAvatarUrl());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        return toManualDTO(manualRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteManual(Long id) {
        manualRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<CumpleanosManualDTO> getCumpleanosDelMes() {
        String source = getConfiguracion().getValor();
        int currentMonth = LocalDate.now().getMonthValue();

        if (VALUE_MANUAL.equals(source)) {
            return manualRepository.findByMes(currentMonth).stream()
                    .map(this::toManualDTO)
                    .collect(Collectors.toList());
        } else {
            // Default: EMPLOYEES
            // Mapeamos Empleado a CumpleanosManualDTO para uniformidad
            return empleadoRepository.findCumpleaniosDelMes().stream()
                    .map(emp -> CumpleanosManualDTO.builder()
                            .id(emp.getId()) // ID del empleado
                            .nombreCompleto(emp.getNombres() + " " + emp.getApellidos())
                            .fechaNacimiento(emp.getFechaNacimiento())
                            .avatarUrl(emp.getFotoUrl())
                            .dia(emp.getFechaNacimiento().getDayOfMonth())
                            .mes(emp.getFechaNacimiento().getMonthValue())
                            .build())
                    .collect(Collectors.toList());
        }
    }

    @Override
    @Transactional
    public List<CumpleanosManualDTO> getProximos(int limit) {
        String source = getConfiguracion().getValor();

        if (VALUE_MANUAL.equals(source)) {
            // Lógica en memoria para manuales (asumiendo volumen bajo)
            List<CumpleanosManual> all = manualRepository.findAll();
            return filterProximos(all, limit).stream()
                    .map(this::toManualDTO)
                    .collect(Collectors.toList());
        } else {
            // Default: EMPLOYEES
            return empleadoRepository.findProximosCumpleanios(limit).stream()
                    .map(emp -> CumpleanosManualDTO.builder()
                            .id(emp.getId())
                            .nombreCompleto(emp.getNombres() + " " + emp.getApellidos())
                            .fechaNacimiento(emp.getFechaNacimiento())
                            .avatarUrl(emp.getFotoUrl())
                            .dia(emp.getFechaNacimiento().getDayOfMonth())
                            .mes(emp.getFechaNacimiento().getMonthValue())
                            .build())
                    .collect(Collectors.toList());
        }
    }

    private List<CumpleanosManual> filterProximos(List<CumpleanosManual> all, int limit) {
        LocalDate hoy = LocalDate.now();
        return all.stream()
                .filter(c -> c.getFechaNacimiento() != null)
                .sorted((c1, c2) -> {
                    LocalDate next1 = getNextBirthday(c1.getFechaNacimiento(), hoy);
                    LocalDate next2 = getNextBirthday(c2.getFechaNacimiento(), hoy);
                    return next1.compareTo(next2);
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    private LocalDate getNextBirthday(LocalDate birthDate, LocalDate today) {
        LocalDate next = birthDate.withYear(today.getYear());
        if (next.isBefore(today)) {
            next = next.plusYears(1);
        }
        return next;
    }

    // Mappers helpers
    private ConfiguracionDTO toConfigDTO(Configuracion entity) {
        return ConfiguracionDTO.builder()
                .id(entity.getId())
                .clave(entity.getClave())
                .valor(entity.getValor())
                .descripcion(entity.getDescripcion())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    private CumpleanosManualDTO toManualDTO(CumpleanosManual entity) {
        return CumpleanosManualDTO.builder()
                .id(entity.getId())
                .nombreCompleto(entity.getNombreCompleto())
                .fechaNacimiento(entity.getFechaNacimiento())
                .avatarUrl(entity.getAvatarUrl())
                .dia(entity.getFechaNacimiento() != null ? entity.getFechaNacimiento().getDayOfMonth() : null)
                .mes(entity.getFechaNacimiento() != null ? entity.getFechaNacimiento().getMonthValue() : null)
                .build();
    }
}
