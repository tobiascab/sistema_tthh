package com.coopreducto.tthh.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditoriaDTO {

    private Long id;

    @NotBlank(message = "El usuario es requerido")
    @Size(max = 100, message = "El usuario no puede exceder 100 caracteres")
    private String usuario;

    @NotBlank(message = "La acción es requerida")
    @Pattern(regexp = "CREATE|UPDATE|DELETE|READ|LOGIN|LOGOUT", message = "Acción inválida")
    private String accion;

    @NotBlank(message = "La entidad es requerida")
    @Size(max = 100, message = "La entidad no puede exceder 100 caracteres")
    private String entidad;

    private Long entidadId;

    @Size(max = 5000, message = "Los detalles no pueden exceder 5000 caracteres")
    private String detalles;

    @Size(max = 50, message = "La dirección IP no puede exceder 50 caracteres")
    private String ipAddress;

    @Size(max = 200, message = "El user agent no puede exceder 200 caracteres")
    private String userAgent;

    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getEntidad() { return entidad; }
    public void setEntidad(String entidad) { this.entidad = entidad; }

    public Long getEntidadId() { return entidadId; }
    public void setEntidadId(Long entidadId) { this.entidadId = entidadId; }

    public String getDetalles() { return detalles; }
    public void setDetalles(String detalles) { this.detalles = detalles; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
