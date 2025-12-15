package com.coopreducto.tthh.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "empleados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ========================================
    // INFORMACIÓN PERSONAL
    // ========================================

    @Column(nullable = false, unique = true, length = 20)
    private String numeroDocumento;

    @Column(length = 20)
    private String tipoDocumento; // CI, RUC, PASAPORTE

    @Column(unique = true, length = 20)
    private String numeroSocio;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @Column(length = 20)
    private String genero; // MASCULINO, FEMENINO, OTRO

    @Column(length = 20)
    private String estadoCivil; // SOLTERO, CASADO, DIVORCIADO, VIUDO, UNION_LIBRE

    @Column(length = 20)
    private String nacionalidad;

    @Column(length = 200)
    private String direccion;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String departamento; // Departamento geográfico (Central, Alto Paraná, etc.)

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(length = 20)
    private String celular;

    @Column(length = 500)
    private String fotoUrl; // URL de la foto de perfil

    // ========================================
    // CONTACTO DE EMERGENCIA
    // ========================================

    @Column(length = 100)
    private String contactoEmergenciaNombre;

    @Column(length = 50)
    private String contactoEmergenciaRelacion;

    @Column(length = 20)
    private String contactoEmergenciaTelefono;

    // ========================================
    // INFORMACIÓN EDUCATIVA
    // ========================================

    @Column(length = 100)
    private String nivelEducativo; // PRIMARIA, SECUNDARIA, TERCIARIO, UNIVERSITARIO, POSTGRADO

    @Column(length = 200)
    private String profesion;

    @Column(length = 200)
    private String tituloObtenido;

    @Column(length = 200)
    private String institucionEducativa;

    // ========================================
    // INFORMACIÓN MÉDICA
    // ========================================

    @Column(length = 10)
    private String tipoSangre; // A+, A-, B+, B-, AB+, AB-, O+, O-

    @Column(length = 500)
    private String alergias;

    @Column(length = 500)
    private String condicionesMedicas;

    @Column
    private LocalDate fechaUltimoExamenMedico;

    // ========================================
    // INFORMACIÓN LABORAL
    // ========================================

    @Column(nullable = false)
    private LocalDate fechaIngreso;

    @Column
    private LocalDate fechaEgreso;

    @Column(length = 100)
    private String cargo;

    @Column(length = 100)
    private String area; // Área o departamento organizacional (RRHH, Finanzas, etc.)

    @Column(length = 100)
    private String sucursal;

    @Column(length = 50)
    private String tipoContrato; // INDEFINIDO, PLAZO_FIJO, TEMPORAL, PRACTICAS

    @Column
    private LocalDate fechaFinContrato; // Si es plazo fijo

    @Column(length = 50)
    private String jornadaLaboral; // COMPLETA, MEDIA_JORNADA, POR_HORAS

    @Column
    private Integer horasSemanales;

    @Column(length = 100)
    private String jefeInmediato; // Puede ser el nombre o ID de otro empleado

    @Column(precision = 10, scale = 2)
    private BigDecimal salario;

    @Column(length = 50)
    private String moneda; // GUARANIES, DOLARES

    @Column(length = 50)
    private String tipoPago; // MENSUAL, QUINCENAL, SEMANAL

    @Column(length = 50)
    private String estado; // ACTIVO, INACTIVO, SUSPENDIDO, VACACIONES, LICENCIA

    @Column(length = 500)
    private String motivoBaja; // Si está INACTIVO

    // ========================================
    // INFORMACIÓN BANCARIA
    // ========================================

    @Column(length = 100)
    private String bancoNombre;

    @Column(length = 50)
    private String bancoCuentaTipo; // AHORRO, CORRIENTE

    @Column(length = 50)
    private String bancoCuentaNumero;

    // ========================================
    // SEGURIDAD SOCIAL
    // ========================================

    @Column(length = 50)
    private String numeroIps; // Instituto de Previsión Social

    @Column(length = 50)
    private String numeroAfp; // AFP (si aplica)

    @Column(length = 50)
    private String numeroSeguroMedico;

    @Column(length = 100)
    private String seguroMedicoPlan;

    // ========================================
    // BENEFICIOS Y DESCUENTOS
    // ========================================

    @Column
    private Boolean tieneBonificacion;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoBonificacion;

    @Column
    private Boolean tieneDescuentos;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoDescuentos;

    @Column
    private Integer diasVacacionesAnuales;

    @Column
    private Integer diasVacacionesUsados;

    @Column
    private Integer diasVacacionesDisponibles;

    // ========================================
    // EVALUACIÓN Y DESEMPEÑO
    // ========================================

    @Column
    private LocalDate fechaUltimaEvaluacion;

    @Column(precision = 3, scale = 2)
    private BigDecimal calificacionDesempeño; // 0.00 a 5.00

    @Column(length = 500)
    private String observacionesDesempeño;

    // ========================================
    // AUDITORÍA
    // ========================================

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;

    @Column(length = 100)
    private String updatedBy;

    @Column(length = 1000)
    private String observaciones; // Notas generales

    // ========================================
    // MÉTODOS AUXILIARES
    // ========================================

    @Transient
    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }

    @Transient
    public Integer getEdad() {
        if (fechaNacimiento == null)
            return null;
        return LocalDate.now().getYear() - fechaNacimiento.getYear();
    }

    @Transient
    public Integer getAntiguedadAnios() {
        if (fechaIngreso == null)
            return null;
        return LocalDate.now().getYear() - fechaIngreso.getYear();
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

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
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

    @Transient
    public Boolean isActivo() {
        return "ACTIVO".equals(estado);
    }
}
