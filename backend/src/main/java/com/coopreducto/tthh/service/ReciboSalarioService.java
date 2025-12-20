package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.ReciboSalarioDTO;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;

public interface ReciboSalarioService {

    Page<ReciboSalarioDTO> findByEmpleadoAndAnio(Long empleadoId, Integer anio, Pageable pageable);

    ReciboSalarioDTO findById(Long id);

    ReciboSalarioDTO create(ReciboSalarioDTO reciboDTO);

    Resource getPdfResource(Long id);

    void sendByEmail(Long id);

    ReciboSalarioDTO findUltimoRecibo(Long empleadoId);

    ReciboSalarioDTO findProximoPago(Long empleadoId);

    void generarNominaMensual(Integer anio, Integer mes);

    void cerrarNomina(Integer anio, Integer mes);

    BigDecimal calcularAguinaldoProyectado(Long empleadoId);

    com.coopreducto.tthh.dto.PayrollDashboardDTO getDashboardSummary();

    Resource exportarPlanillaBancaria(Integer anio, Integer mes);

    Page<ReciboSalarioDTO> findByFilters(String sucursal, Long empleadoId, Integer mes, Integer anio,
            Pageable pageable);

    Resource exportarExcel(String sucursal, Long empleadoId, Integer mes, Integer anio);

    Resource exportarPdf(String sucursal, Long empleadoId, Integer mes, Integer anio);
}
