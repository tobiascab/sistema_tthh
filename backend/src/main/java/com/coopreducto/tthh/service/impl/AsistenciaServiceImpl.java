package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.AsistenciaDTO;
import com.coopreducto.tthh.entity.Asistencia;
import com.coopreducto.tthh.entity.Empleado;
import com.coopreducto.tthh.mapper.AsistenciaMapper;
import com.coopreducto.tthh.repository.AsistenciaRepository;
import com.coopreducto.tthh.repository.EmpleadoRepository;
import com.coopreducto.tthh.service.AsistenciaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
@SuppressWarnings("null")
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AsistenciaMapper asistenciaMapper;

    // Horario de entrada predeterminado: 08:00 AM
    private static final LocalTime HORARIO_ENTRADA = LocalTime.of(8, 0);

    @Override
    @Transactional(readOnly = true)
    public Page<AsistenciaDTO> listarTodas(Pageable pageable) {
        return asistenciaRepository.findAll(pageable)
                .map(asistenciaMapper::toDTO);
    }

    @Override
    public AsistenciaDTO registrarAsistencia(AsistenciaDTO dto) {
        log.info("Registrando asistencia manual para empleado: {}", dto.getEmpleadoId());

        // Verificar existencia de empleado
        Empleado empleado = empleadoRepository.findById(dto.getEmpleadoId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado: " + dto.getEmpleadoId()));

        Asistencia asistencia = asistenciaMapper.toEntity(dto);
        asistencia.setEmpleado(empleado);

        // Calcular retraso si es necesario
        calcularRetraso(asistencia);

        Asistencia guardado = asistenciaRepository.save(asistencia);
        return asistenciaMapper.toDTO(guardado);
    }

    @Override
    public AsistenciaDTO actualizarAsistencia(Long id, AsistenciaDTO dto) {
        Asistencia asistencia = asistenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada: " + id));

        asistencia.setTipo(dto.getTipo());
        asistencia.setHoraEntrada(dto.getHoraEntrada());
        asistencia.setHoraSalida(dto.getHoraSalida());
        asistencia.setObservaciones(dto.getObservaciones());

        calcularRetraso(asistencia);

        return asistenciaMapper.toDTO(asistenciaRepository.save(asistencia));
    }

    @Override
    public void eliminarAsistencia(Long id) {
        if (!asistenciaRepository.existsById(id)) {
            throw new RuntimeException("Asistencia no encontrada: " + id);
        }
        asistenciaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public AsistenciaDTO obtenerPorId(Long id) {
        return asistenciaRepository.findById(id)
                .map(asistenciaMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AsistenciaDTO> listarPorEmpleado(Long empleadoId, Pageable pageable) {
        return asistenciaRepository.findByEmpleadoId(empleadoId, pageable)
                .map(asistenciaMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerReporteMensual(Long empleadoId, int anio, int mes) {
        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());

        return asistenciaMapper.toDTOList(
                asistenciaRepository.findByEmpleadoIdAndRangoFecha(empleadoId, inicio, fin));
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarTardanzas(Long empleadoId, int anio, int mes) {
        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return asistenciaRepository.countTardanzas(empleadoId, inicio, fin);
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarAusencias(Long empleadoId, int anio, int mes) {
        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());
        return asistenciaRepository.countAusencias(empleadoId, inicio, fin);
    }

    @Override
    public AsistenciaDTO marcarReloj(Long empleadoId, String tipoMarca) {
        log.info("Marcando reloj para empleado: {} - Tipo: {}", empleadoId, tipoMarca);

        LocalDate hoy = LocalDate.now();
        LocalDateTime ahora = LocalDateTime.now();
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Asistencia asistencia = asistenciaRepository.findByEmpleadoIdAndFecha(empleadoId, hoy)
                .orElse(new Asistencia());

        if (asistencia.getId() == null) {
            // Nueva asistencia (Entrada)
            asistencia.setEmpleado(empleado);
            asistencia.setFecha(hoy);
            asistencia.setHoraEntrada(ahora);
            asistencia.setTipo("PRESENTE");
            calcularRetraso(asistencia);
        } else {
            // Ya existe (Salida)
            asistencia.setHoraSalida(ahora);
        }

        return asistenciaMapper.toDTO(asistenciaRepository.save(asistencia));
    }

    @Override
    public AsistenciaDTO justificar(Long id, String motivo, String documentoUrl) {
        Asistencia asistencia = asistenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada"));

        asistencia.setJustificado(true);
        asistencia.setObservaciones((asistencia.getObservaciones() != null ? asistencia.getObservaciones() + ". " : "")
                + "Justificación: " + motivo);
        if (documentoUrl != null) {
            asistencia.setDocumentoJustificacion(documentoUrl);
        }

        return asistenciaMapper.toDTO(asistenciaRepository.save(asistencia));
    }

    @Override
    @Transactional(readOnly = true)
    public com.coopreducto.tthh.dto.AttendanceGlobalReportDTO obtenerReporteGlobal(int anio, int mes) {
        log.info("Generando reporte global de asistencia para {}-{}", anio, mes);
        List<Empleado> empleados = empleadoRepository.findAll();
        List<com.coopreducto.tthh.dto.AttendanceGlobalReportDTO.ColaboradorTardanzaDTO> listado = new ArrayList<>();

        for (Empleado e : empleados) {
            Long minutos = asistenciaRepository.sumMinutosRetrasoMensual(e.getId(), mes, anio);
            Long cantTardanzas = asistenciaRepository.countTardanzasMensual(e.getId(), mes, anio);

            if (minutos > 0 || cantTardanzas > 0) {
                BigDecimal salario = e.getSalario() != null ? e.getSalario() : BigDecimal.ZERO;
                BigDecimal salarioDiario = salario.divide(new BigDecimal("30"), 2, RoundingMode.HALF_UP);
                BigDecimal salarioHora = salarioDiario.divide(new BigDecimal("8"), 2, RoundingMode.HALF_UP);
                BigDecimal salarioMinuto = salarioHora.divide(new BigDecimal("60"), 2, RoundingMode.HALF_UP);
                BigDecimal descuento = salarioMinuto.multiply(BigDecimal.valueOf(minutos));

                listado.add(com.coopreducto.tthh.dto.AttendanceGlobalReportDTO.ColaboradorTardanzaDTO.builder()
                        .empleadoId(e.getId())
                        .colaborador(e.getNombreCompleto())
                        .cantidadTardanzas(cantTardanzas.intValue())
                        .totalMinutosRetraso(minutos)
                        .totalDescuento(descuento)
                        .build());
            }
        }

        // Ordenar por total descuento (descendente)
        listado.sort(Comparator
                .comparing(com.coopreducto.tthh.dto.AttendanceGlobalReportDTO.ColaboradorTardanzaDTO::getTotalDescuento)
                .reversed());

        return com.coopreducto.tthh.dto.AttendanceGlobalReportDTO.builder()
                .anio(anio)
                .mes(mes)
                .tardanzas(listado)
                .build();
    }

    private void calcularRetraso(Asistencia asistencia) {
        if (asistencia.getHoraEntrada() != null && asistencia.getEmpleado() != null) {
            LocalTime horaEstablecida = asistencia.getEmpleado().getHorarioEntrada();
            if (horaEstablecida == null) {
                horaEstablecida = LocalTime.of(8, 0); // Fallback predeterminado
            }

            LocalTime horaLlegada = asistencia.getHoraEntrada().toLocalTime();
            if (horaLlegada.isAfter(horaEstablecida)) {
                long minutos = ChronoUnit.MINUTES.between(horaEstablecida, horaLlegada);
                asistencia.setMinutosRetraso((int) minutos);
                asistencia.setTipo("TARDANZA");
            } else {
                asistencia.setMinutosRetraso(0);
                if ("TARDANZA".equals(asistencia.getTipo())) {
                    asistencia.setTipo("PRESENTE");
                }
            }
        }
    }
}
