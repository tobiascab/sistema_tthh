package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardColaboradorDTO {

    private EmpleadoDTO empleado;
    private ReciboSalarioDTO ultimoRecibo;
    private ReciboSalarioDTO proximoPago;
    private Integer diasVacacionesDisponibles;
    private Long solicitudesActivas;
    private java.util.List<ComunicadoDTO> comunicados;
    private java.util.List<SolicitudDTO> ultimasSolicitudes;
}
