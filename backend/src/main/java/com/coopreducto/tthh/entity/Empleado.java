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

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

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
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(length = 1000)
    private String observaciones; // Notas generales

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

    @Transient
    public Boolean isActivo() {
        return "ACTIVO".equals(estado);
    }
}
