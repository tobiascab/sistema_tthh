package com.coopreducto.tthh.mapper;

import com.coopreducto.tthh.dto.EmpleadoDTO;
import com.coopreducto.tthh.entity.Empleado;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper {

    public EmpleadoDTO toDTO(Empleado empleado) {
        if (empleado == null) {
            return null;
        }

        EmpleadoDTO dto = new EmpleadoDTO();

        // ID
        dto.setId(empleado.getId());

        // Información Personal
        dto.setNumeroDocumento(empleado.getNumeroDocumento());
        dto.setTipoDocumento(empleado.getTipoDocumento());
        dto.setNumeroSocio(empleado.getNumeroSocio());
        dto.setNombres(empleado.getNombres());
        dto.setApellidos(empleado.getApellidos());
        dto.setFechaNacimiento(empleado.getFechaNacimiento());
        dto.setGenero(empleado.getGenero());
        dto.setEstadoCivil(empleado.getEstadoCivil());
        dto.setNacionalidad(empleado.getNacionalidad());
        dto.setDireccion(empleado.getDireccion());
        dto.setCiudad(empleado.getCiudad());
        dto.setDepartamento(empleado.getDepartamento());
        dto.setEmail(empleado.getEmail());
        dto.setTelefono(empleado.getTelefono());
        dto.setCelular(empleado.getCelular());
        dto.setFotoUrl(empleado.getFotoUrl());

        // Contacto de Emergencia
        dto.setContactoEmergenciaNombre(empleado.getContactoEmergenciaNombre());
        dto.setContactoEmergenciaRelacion(empleado.getContactoEmergenciaRelacion());
        dto.setContactoEmergenciaTelefono(empleado.getContactoEmergenciaTelefono());

        // Información Educativa
        dto.setNivelEducativo(empleado.getNivelEducativo());
        dto.setProfesion(empleado.getProfesion());
        dto.setTituloObtenido(empleado.getTituloObtenido());
        dto.setInstitucionEducativa(empleado.getInstitucionEducativa());

        // Información Médica
        dto.setTipoSangre(empleado.getTipoSangre());
        dto.setAlergias(empleado.getAlergias());
        dto.setCondicionesMedicas(empleado.getCondicionesMedicas());
        dto.setFechaUltimoExamenMedico(empleado.getFechaUltimoExamenMedico());

        // Información Laboral
        dto.setFechaIngreso(empleado.getFechaIngreso());
        dto.setFechaEgreso(empleado.getFechaEgreso());
        dto.setCargo(empleado.getCargo());
        dto.setArea(empleado.getArea());
        dto.setSucursal(empleado.getSucursal());
        dto.setTipoContrato(empleado.getTipoContrato());
        dto.setFechaFinContrato(empleado.getFechaFinContrato());
        dto.setJornadaLaboral(empleado.getJornadaLaboral());
        dto.setHorasSemanales(empleado.getHorasSemanales());
        dto.setJefeInmediato(empleado.getJefeInmediato());
        dto.setSalario(empleado.getSalario());
        dto.setMoneda(empleado.getMoneda());
        dto.setTipoPago(empleado.getTipoPago());
        dto.setEstado(empleado.getEstado());
        dto.setMotivoBaja(empleado.getMotivoBaja());

        // Información Bancaria
        dto.setBancoNombre(empleado.getBancoNombre());
        dto.setBancoCuentaTipo(empleado.getBancoCuentaTipo());
        dto.setBancoCuentaNumero(empleado.getBancoCuentaNumero());

        // Seguridad Social
        dto.setNumeroIps(empleado.getNumeroIps());
        dto.setNumeroAfp(empleado.getNumeroAfp());
        dto.setNumeroSeguroMedico(empleado.getNumeroSeguroMedico());
        dto.setSeguroMedicoPlan(empleado.getSeguroMedicoPlan());

        // Beneficios y Descuentos
        dto.setTieneBonificacion(empleado.getTieneBonificacion());
        dto.setMontoBonificacion(empleado.getMontoBonificacion());
        dto.setTieneDescuentos(empleado.getTieneDescuentos());
        dto.setMontoDescuentos(empleado.getMontoDescuentos());
        dto.setDiasVacacionesAnuales(empleado.getDiasVacacionesAnuales());
        dto.setDiasVacacionesUsados(empleado.getDiasVacacionesUsados());
        dto.setDiasVacacionesDisponibles(empleado.getDiasVacacionesDisponibles());

        // Evaluación y Desempeño
        dto.setFechaUltimaEvaluacion(empleado.getFechaUltimaEvaluacion());
        dto.setCalificacionDesempeño(empleado.getCalificacionDesempeño());
        dto.setObservacionesDesempeño(empleado.getObservacionesDesempeño());

        // Observaciones
        dto.setObservaciones(empleado.getObservaciones());

        // Campos calculados
        dto.setNombreCompleto(empleado.getNombreCompleto());
        dto.setEdad(empleado.getEdad());
        dto.setAntiguedadAnios(empleado.getAntiguedadAnios());

        return dto;
    }

    public Empleado toEntity(EmpleadoDTO dto) {
        if (dto == null) {
            return null;
        }

        Empleado empleado = new Empleado();

        // ID (solo si existe, para updates)
        empleado.setId(dto.getId());

        // Información Personal
        empleado.setNumeroDocumento(dto.getNumeroDocumento());
        empleado.setTipoDocumento(dto.getTipoDocumento());
        empleado.setNumeroSocio(dto.getNumeroSocio());
        empleado.setNombres(dto.getNombres());
        empleado.setApellidos(dto.getApellidos());
        empleado.setFechaNacimiento(dto.getFechaNacimiento());
        empleado.setGenero(dto.getGenero());
        empleado.setEstadoCivil(dto.getEstadoCivil());
        empleado.setNacionalidad(dto.getNacionalidad());
        empleado.setDireccion(dto.getDireccion());
        empleado.setCiudad(dto.getCiudad());
        empleado.setDepartamento(dto.getDepartamento());
        empleado.setEmail(dto.getEmail());
        empleado.setTelefono(dto.getTelefono());
        empleado.setCelular(dto.getCelular());
        empleado.setFotoUrl(dto.getFotoUrl());

        // Contacto de Emergencia
        empleado.setContactoEmergenciaNombre(dto.getContactoEmergenciaNombre());
        empleado.setContactoEmergenciaRelacion(dto.getContactoEmergenciaRelacion());
        empleado.setContactoEmergenciaTelefono(dto.getContactoEmergenciaTelefono());

        // Información Educativa
        empleado.setNivelEducativo(dto.getNivelEducativo());
        empleado.setProfesion(dto.getProfesion());
        empleado.setTituloObtenido(dto.getTituloObtenido());
        empleado.setInstitucionEducativa(dto.getInstitucionEducativa());

        // Información Médica
        empleado.setTipoSangre(dto.getTipoSangre());
        empleado.setAlergias(dto.getAlergias());
        empleado.setCondicionesMedicas(dto.getCondicionesMedicas());
        empleado.setFechaUltimoExamenMedico(dto.getFechaUltimoExamenMedico());

        // Información Laboral
        empleado.setFechaIngreso(dto.getFechaIngreso());
        empleado.setFechaEgreso(dto.getFechaEgreso());
        empleado.setCargo(dto.getCargo());
        empleado.setArea(dto.getArea());
        empleado.setSucursal(dto.getSucursal());
        empleado.setTipoContrato(dto.getTipoContrato());
        empleado.setFechaFinContrato(dto.getFechaFinContrato());
        empleado.setJornadaLaboral(dto.getJornadaLaboral());
        empleado.setHorasSemanales(dto.getHorasSemanales());
        empleado.setJefeInmediato(dto.getJefeInmediato());
        empleado.setSalario(dto.getSalario());
        empleado.setMoneda(dto.getMoneda());
        empleado.setTipoPago(dto.getTipoPago());
        empleado.setEstado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO");
        empleado.setMotivoBaja(dto.getMotivoBaja());

        // Información Bancaria
        empleado.setBancoNombre(dto.getBancoNombre());
        empleado.setBancoCuentaTipo(dto.getBancoCuentaTipo());
        empleado.setBancoCuentaNumero(dto.getBancoCuentaNumero());

        // Seguridad Social
        empleado.setNumeroIps(dto.getNumeroIps());
        empleado.setNumeroAfp(dto.getNumeroAfp());
        empleado.setNumeroSeguroMedico(dto.getNumeroSeguroMedico());
        empleado.setSeguroMedicoPlan(dto.getSeguroMedicoPlan());

        // Beneficios y Descuentos
        empleado.setTieneBonificacion(dto.getTieneBonificacion());
        empleado.setMontoBonificacion(dto.getMontoBonificacion());
        empleado.setTieneDescuentos(dto.getTieneDescuentos());
        empleado.setMontoDescuentos(dto.getMontoDescuentos());
        empleado.setDiasVacacionesAnuales(dto.getDiasVacacionesAnuales());
        empleado.setDiasVacacionesUsados(dto.getDiasVacacionesUsados());

        // Calcular días disponibles automáticamente
        if (dto.getDiasVacacionesAnuales() != null && dto.getDiasVacacionesUsados() != null) {
            empleado.setDiasVacacionesDisponibles(dto.getDiasVacacionesAnuales() - dto.getDiasVacacionesUsados());
        } else {
            empleado.setDiasVacacionesDisponibles(dto.getDiasVacacionesDisponibles());
        }

        // Evaluación y Desempeño
        empleado.setFechaUltimaEvaluacion(dto.getFechaUltimaEvaluacion());
        empleado.setCalificacionDesempeño(dto.getCalificacionDesempeño());
        empleado.setObservacionesDesempeño(dto.getObservacionesDesempeño());

        // Observaciones
        empleado.setObservaciones(dto.getObservaciones());

        return empleado;
    }

    public void updateEntity(Empleado empleado, EmpleadoDTO dto) {
        if (empleado == null || dto == null) {
            return;
        }

        // No actualizar ID
        // Actualizar todos los demás campos
        empleado.setNumeroDocumento(dto.getNumeroDocumento());
        empleado.setTipoDocumento(dto.getTipoDocumento());
        empleado.setNumeroSocio(dto.getNumeroSocio());
        empleado.setNombres(dto.getNombres());
        empleado.setApellidos(dto.getApellidos());
        empleado.setFechaNacimiento(dto.getFechaNacimiento());
        empleado.setGenero(dto.getGenero());
        empleado.setEstadoCivil(dto.getEstadoCivil());
        empleado.setNacionalidad(dto.getNacionalidad());
        empleado.setDireccion(dto.getDireccion());
        empleado.setCiudad(dto.getCiudad());
        empleado.setDepartamento(dto.getDepartamento());
        empleado.setEmail(dto.getEmail());
        empleado.setTelefono(dto.getTelefono());
        empleado.setCelular(dto.getCelular());
        empleado.setFotoUrl(dto.getFotoUrl());
        empleado.setContactoEmergenciaNombre(dto.getContactoEmergenciaNombre());
        empleado.setContactoEmergenciaRelacion(dto.getContactoEmergenciaRelacion());
        empleado.setContactoEmergenciaTelefono(dto.getContactoEmergenciaTelefono());
        empleado.setNivelEducativo(dto.getNivelEducativo());
        empleado.setProfesion(dto.getProfesion());
        empleado.setTituloObtenido(dto.getTituloObtenido());
        empleado.setInstitucionEducativa(dto.getInstitucionEducativa());
        empleado.setTipoSangre(dto.getTipoSangre());
        empleado.setAlergias(dto.getAlergias());
        empleado.setCondicionesMedicas(dto.getCondicionesMedicas());
        empleado.setFechaUltimoExamenMedico(dto.getFechaUltimoExamenMedico());
        empleado.setFechaIngreso(dto.getFechaIngreso());
        empleado.setFechaEgreso(dto.getFechaEgreso());
        empleado.setCargo(dto.getCargo());
        empleado.setArea(dto.getArea());
        empleado.setSucursal(dto.getSucursal());
        empleado.setTipoContrato(dto.getTipoContrato());
        empleado.setFechaFinContrato(dto.getFechaFinContrato());
        empleado.setJornadaLaboral(dto.getJornadaLaboral());
        empleado.setHorasSemanales(dto.getHorasSemanales());
        empleado.setJefeInmediato(dto.getJefeInmediato());
        empleado.setSalario(dto.getSalario());
        empleado.setMoneda(dto.getMoneda());
        empleado.setTipoPago(dto.getTipoPago());
        empleado.setEstado(dto.getEstado());
        empleado.setMotivoBaja(dto.getMotivoBaja());
        empleado.setBancoNombre(dto.getBancoNombre());
        empleado.setBancoCuentaTipo(dto.getBancoCuentaTipo());
        empleado.setBancoCuentaNumero(dto.getBancoCuentaNumero());
        empleado.setNumeroIps(dto.getNumeroIps());
        empleado.setNumeroAfp(dto.getNumeroAfp());
        empleado.setNumeroSeguroMedico(dto.getNumeroSeguroMedico());
        empleado.setSeguroMedicoPlan(dto.getSeguroMedicoPlan());
        empleado.setTieneBonificacion(dto.getTieneBonificacion());
        empleado.setMontoBonificacion(dto.getMontoBonificacion());
        empleado.setTieneDescuentos(dto.getTieneDescuentos());
        empleado.setMontoDescuentos(dto.getMontoDescuentos());
        empleado.setDiasVacacionesAnuales(dto.getDiasVacacionesAnuales());
        empleado.setDiasVacacionesUsados(dto.getDiasVacacionesUsados());

        if (dto.getDiasVacacionesAnuales() != null && dto.getDiasVacacionesUsados() != null) {
            empleado.setDiasVacacionesDisponibles(dto.getDiasVacacionesAnuales() - dto.getDiasVacacionesUsados());
        }

        empleado.setFechaUltimaEvaluacion(dto.getFechaUltimaEvaluacion());
        empleado.setCalificacionDesempeño(dto.getCalificacionDesempeño());
        empleado.setObservacionesDesempeño(dto.getObservacionesDesempeño());
        empleado.setObservaciones(dto.getObservaciones());
    }
}
