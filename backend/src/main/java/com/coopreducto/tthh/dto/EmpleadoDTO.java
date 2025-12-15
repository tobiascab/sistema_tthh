package com.coopreducto.tthh.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoDTO {

    private Long id;

    // ========================================
    // INFORMACIÓN PERSONAL
    // ========================================

    @NotBlank(message = "El número de documento es requerido")
    @Size(max = 20, message = "El número de documento no puede exceder 20 caracteres")
    private String numeroDocumento;

    @Size(max = 20, message = "El tipo de documento no puede exceder 20 caracteres")
    private String tipoDocumento;

    @Size(max = 20, message = "El número de socio no puede exceder 20 caracteres")
    private String numeroSocio;

    @NotBlank(message = "Los nombres son requeridos")
    @Size(max = 100, message = "Los nombres no pueden exceder 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son requeridos")
    @Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
    private String apellidos;

    @NotNull(message = "La fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @Size(max = 20, message = "El género no puede exceder 20 caracteres")
    private String genero;

    @Size(max = 20, message = "El estado civil no puede exceder 20 caracteres")
    private String estadoCivil;

    @Size(max = 20, message = "La nacionalidad no puede exceder 20 caracteres")
    private String nacionalidad;

    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String direccion;

    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;

    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    private String departamento;

    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Size(max = 20, message = "El celular no puede exceder 20 caracteres")
    private String celular;

    @Size(max = 500, message = "La URL de la foto no puede exceder 500 caracteres")
    private String fotoUrl;

    // ========================================
    // CONTACTO DE EMERGENCIA
    // ========================================

    @Size(max = 100, message = "El nombre del contacto de emergencia no puede exceder 100 caracteres")
    private String contactoEmergenciaNombre;

    @Size(max = 50, message = "La relación del contacto de emergencia no puede exceder 50 caracteres")
    private String contactoEmergenciaRelacion;

    @Size(max = 20, message = "El teléfono del contacto de emergencia no puede exceder 20 caracteres")
    private String contactoEmergenciaTelefono;

    // ========================================
    // INFORMACIÓN EDUCATIVA
    // ========================================

    @Size(max = 100, message = "El nivel educativo no puede exceder 100 caracteres")
    private String nivelEducativo;

    @Size(max = 200, message = "La profesión no puede exceder 200 caracteres")
    private String profesion;

    @Size(max = 200, message = "El título obtenido no puede exceder 200 caracteres")
    private String tituloObtenido;

    @Size(max = 200, message = "La institución educativa no puede exceder 200 caracteres")
    private String institucionEducativa;

    // ========================================
    // INFORMACIÓN MÉDICA
    // ========================================

    @Size(max = 10, message = "El tipo de sangre no puede exceder 10 caracteres")
    private String tipoSangre;

    @Size(max = 500, message = "Las alergias no pueden exceder 500 caracteres")
    private String alergias;

    @Size(max = 500, message = "Las condiciones médicas no pueden exceder 500 caracteres")
    private String condicionesMedicas;

    @PastOrPresent(message = "La fecha del último examen médico no puede ser futura")
    private LocalDate fechaUltimoExamenMedico;

    // ========================================
    // INFORMACIÓN LABORAL
    // ========================================

    @NotNull(message = "La fecha de ingreso es requerida")
    @PastOrPresent(message = "La fecha de ingreso no puede ser futura")
    private LocalDate fechaIngreso;

    @PastOrPresent(message = "La fecha de egreso no puede ser futura")
    private LocalDate fechaEgreso;

    @Size(max = 100, message = "El cargo no puede exceder 100 caracteres")
    private String cargo;

    @Size(max = 100, message = "El área no puede exceder 100 caracteres")
    private String area;

    @Size(max = 100, message = "La sucursal no puede exceder 100 caracteres")
    private String sucursal;

    @Size(max = 50, message = "El tipo de contrato no puede exceder 50 caracteres")
    private String tipoContrato;

    private LocalDate fechaFinContrato;

    @Size(max = 50, message = "La jornada laboral no puede exceder 50 caracteres")
    private String jornadaLaboral;

    @Min(value = 1, message = "Las horas semanales deben ser al menos 1")
    @Max(value = 168, message = "Las horas semanales no pueden exceder 168")
    private Integer horasSemanales;

    @Size(max = 100, message = "El jefe inmediato no puede exceder 100 caracteres")
    private String jefeInmediato;

    @DecimalMin(value = "0.0", message = "El salario no puede ser negativo")
    private BigDecimal salario;

    @Size(max = 50, message = "La moneda no puede exceder 50 caracteres")
    private String moneda;

    @Size(max = 50, message = "El tipo de pago no puede exceder 50 caracteres")
    private String tipoPago;

    @NotBlank(message = "El estado es requerido")
    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;

    @Size(max = 500, message = "El motivo de baja no puede exceder 500 caracteres")
    private String motivoBaja;

    // ========================================
    // INFORMACIÓN BANCARIA
    // ========================================

    @Size(max = 100, message = "El nombre del banco no puede exceder 100 caracteres")
    private String bancoNombre;

    @Size(max = 50, message = "El tipo de cuenta no puede exceder 50 caracteres")
    private String bancoCuentaTipo;

    @Size(max = 50, message = "El número de cuenta no puede exceder 50 caracteres")
    private String bancoCuentaNumero;

    // ========================================
    // SEGURIDAD SOCIAL
    // ========================================

    @Size(max = 50, message = "El número de IPS no puede exceder 50 caracteres")
    private String numeroIps;

    @Size(max = 50, message = "El número de AFP no puede exceder 50 caracteres")
    private String numeroAfp;

    @Size(max = 50, message = "El número de seguro médico no puede exceder 50 caracteres")
    private String numeroSeguroMedico;

    @Size(max = 100, message = "El plan de seguro médico no puede exceder 100 caracteres")
    private String seguroMedicoPlan;

    // ========================================
    // BENEFICIOS Y DESCUENTOS
    // ========================================

    private Boolean tieneBonificacion;

    @DecimalMin(value = "0.0", message = "El monto de bonificación no puede ser negativo")
    private BigDecimal montoBonificacion;

    private Boolean tieneDescuentos;

    @DecimalMin(value = "0.0", message = "El monto de descuentos no puede ser negativo")
    private BigDecimal montoDescuentos;

    @Min(value = 0, message = "Los días de vacaciones no pueden ser negativos")
    private Integer diasVacacionesAnuales;

    @Min(value = 0, message = "Los días de vacaciones usados no pueden ser negativos")
    private Integer diasVacacionesUsados;

    @Min(value = 0, message = "Los días de vacaciones disponibles no pueden ser negativos")
    private Integer diasVacacionesDisponibles;

    // ========================================
    // EVALUACIÓN Y DESEMPEÑO
    // ========================================

    @PastOrPresent(message = "La fecha de la última evaluación no puede ser futura")
    private LocalDate fechaUltimaEvaluacion;

    @DecimalMin(value = "0.00", message = "La calificación de desempeño debe ser al menos 0.00")
    @DecimalMax(value = "5.00", message = "La calificación de desempeño no puede exceder 5.00")
    private BigDecimal calificacionDesempeño;

    @Size(max = 500, message = "Las observaciones de desempeño no pueden exceder 500 caracteres")
    private String observacionesDesempeño;

    // ========================================
    // OTROS
    // ========================================

    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;

    // ========================================
    // CAMPOS CALCULADOS (solo lectura)
    // ========================================

    private String nombreCompleto;
    private Integer edad;
    private Integer antiguedadAnios;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(String tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroSocio() {
        return numeroSocio;
    }

    public void setNumeroSocio(String numeroSocio) {
        this.numeroSocio = numeroSocio;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getContactoEmergenciaNombre() {
        return contactoEmergenciaNombre;
    }

    public void setContactoEmergenciaNombre(String contactoEmergenciaNombre) {
        this.contactoEmergenciaNombre = contactoEmergenciaNombre;
    }

    public String getContactoEmergenciaRelacion() {
        return contactoEmergenciaRelacion;
    }

    public void setContactoEmergenciaRelacion(String contactoEmergenciaRelacion) {
        this.contactoEmergenciaRelacion = contactoEmergenciaRelacion;
    }

    public String getContactoEmergenciaTelefono() {
        return contactoEmergenciaTelefono;
    }

    public void setContactoEmergenciaTelefono(String contactoEmergenciaTelefono) {
        this.contactoEmergenciaTelefono = contactoEmergenciaTelefono;
    }

    public String getNivelEducativo() {
        return nivelEducativo;
    }

    public void setNivelEducativo(String nivelEducativo) {
        this.nivelEducativo = nivelEducativo;
    }

    public String getProfesion() {
        return profesion;
    }

    public void setProfesion(String profesion) {
        this.profesion = profesion;
    }

    public String getTituloObtenido() {
        return tituloObtenido;
    }

    public void setTituloObtenido(String tituloObtenido) {
        this.tituloObtenido = tituloObtenido;
    }

    public String getInstitucionEducativa() {
        return institucionEducativa;
    }

    public void setInstitucionEducativa(String institucionEducativa) {
        this.institucionEducativa = institucionEducativa;
    }

    public String getTipoSangre() {
        return tipoSangre;
    }

    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getCondicionesMedicas() {
        return condicionesMedicas;
    }

    public void setCondicionesMedicas(String condicionesMedicas) {
        this.condicionesMedicas = condicionesMedicas;
    }

    public LocalDate getFechaUltimoExamenMedico() {
        return fechaUltimoExamenMedico;
    }

    public void setFechaUltimoExamenMedico(LocalDate fechaUltimoExamenMedico) {
        this.fechaUltimoExamenMedico = fechaUltimoExamenMedico;
    }

    public LocalDate getFechaEgreso() {
        return fechaEgreso;
    }

    public void setFechaEgreso(LocalDate fechaEgreso) {
        this.fechaEgreso = fechaEgreso;
    }

    public String getTipoContrato() {
        return tipoContrato;
    }

    public void setTipoContrato(String tipoContrato) {
        this.tipoContrato = tipoContrato;
    }

    public LocalDate getFechaFinContrato() {
        return fechaFinContrato;
    }

    public void setFechaFinContrato(LocalDate fechaFinContrato) {
        this.fechaFinContrato = fechaFinContrato;
    }

    public Integer getHorasSemanales() {
        return horasSemanales;
    }

    public void setHorasSemanales(Integer horasSemanales) {
        this.horasSemanales = horasSemanales;
    }

    public String getJefeInmediato() {
        return jefeInmediato;
    }

    public void setJefeInmediato(String jefeInmediato) {
        this.jefeInmediato = jefeInmediato;
    }

    public String getMotivoBaja() {
        return motivoBaja;
    }

    public void setMotivoBaja(String motivoBaja) {
        this.motivoBaja = motivoBaja;
    }

    public String getBancoNombre() {
        return bancoNombre;
    }

    public void setBancoNombre(String bancoNombre) {
        this.bancoNombre = bancoNombre;
    }

    public String getBancoCuentaTipo() {
        return bancoCuentaTipo;
    }

    public void setBancoCuentaTipo(String bancoCuentaTipo) {
        this.bancoCuentaTipo = bancoCuentaTipo;
    }

    public String getBancoCuentaNumero() {
        return bancoCuentaNumero;
    }

    public void setBancoCuentaNumero(String bancoCuentaNumero) {
        this.bancoCuentaNumero = bancoCuentaNumero;
    }

    public String getNumeroIps() {
        return numeroIps;
    }

    public void setNumeroIps(String numeroIps) {
        this.numeroIps = numeroIps;
    }

    public String getNumeroAfp() {
        return numeroAfp;
    }

    public void setNumeroAfp(String numeroAfp) {
        this.numeroAfp = numeroAfp;
    }

    public String getNumeroSeguroMedico() {
        return numeroSeguroMedico;
    }

    public void setNumeroSeguroMedico(String numeroSeguroMedico) {
        this.numeroSeguroMedico = numeroSeguroMedico;
    }

    public String getSeguroMedicoPlan() {
        return seguroMedicoPlan;
    }

    public void setSeguroMedicoPlan(String seguroMedicoPlan) {
        this.seguroMedicoPlan = seguroMedicoPlan;
    }

    public Boolean getTieneBonificacion() {
        return tieneBonificacion;
    }

    public void setTieneBonificacion(Boolean tieneBonificacion) {
        this.tieneBonificacion = tieneBonificacion;
    }

    public BigDecimal getMontoBonificacion() {
        return montoBonificacion;
    }

    public void setMontoBonificacion(BigDecimal montoBonificacion) {
        this.montoBonificacion = montoBonificacion;
    }

    public Boolean getTieneDescuentos() {
        return tieneDescuentos;
    }

    public void setTieneDescuentos(Boolean tieneDescuentos) {
        this.tieneDescuentos = tieneDescuentos;
    }

    public BigDecimal getMontoDescuentos() {
        return montoDescuentos;
    }

    public void setMontoDescuentos(BigDecimal montoDescuentos) {
        this.montoDescuentos = montoDescuentos;
    }

    public Integer getDiasVacacionesAnuales() {
        return diasVacacionesAnuales;
    }

    public void setDiasVacacionesAnuales(Integer diasVacacionesAnuales) {
        this.diasVacacionesAnuales = diasVacacionesAnuales;
    }

    public Integer getDiasVacacionesUsados() {
        return diasVacacionesUsados;
    }

    public void setDiasVacacionesUsados(Integer diasVacacionesUsados) {
        this.diasVacacionesUsados = diasVacacionesUsados;
    }

    public Integer getDiasVacacionesDisponibles() {
        return diasVacacionesDisponibles;
    }

    public void setDiasVacacionesDisponibles(Integer diasVacacionesDisponibles) {
        this.diasVacacionesDisponibles = diasVacacionesDisponibles;
    }

    public LocalDate getFechaUltimaEvaluacion() {
        return fechaUltimaEvaluacion;
    }

    public void setFechaUltimaEvaluacion(LocalDate fechaUltimaEvaluacion) {
        this.fechaUltimaEvaluacion = fechaUltimaEvaluacion;
    }

    public BigDecimal getCalificacionDesempeño() {
        return calificacionDesempeño;
    }

    public void setCalificacionDesempeño(BigDecimal calificacionDesempeño) {
        this.calificacionDesempeño = calificacionDesempeño;
    }

    public String getObservacionesDesempeño() {
        return observacionesDesempeño;
    }

    public void setObservacionesDesempeño(String observacionesDesempeño) {
        this.observacionesDesempeño = observacionesDesempeño;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public Integer getAntiguedadAnios() {
        return antiguedadAnios;
    }

    public void setAntiguedadAnios(Integer antiguedadAnios) {
        this.antiguedadAnios = antiguedadAnios;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getSucursal() {
        return sucursal;
    }

    public void setSucursal(String sucursal) {
        this.sucursal = sucursal;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getTipoPago() {
        return tipoPago;
    }

    public void setTipoPago(String tipoPago) {
        this.tipoPago = tipoPago;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getJornadaLaboral() {
        return jornadaLaboral;
    }

    public void setJornadaLaboral(String jornadaLaboral) {
        this.jornadaLaboral = jornadaLaboral;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }
}
