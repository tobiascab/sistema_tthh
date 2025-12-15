package com.coopreducto.tthh.dto;  
  
import lombok.Data;  
import java.time.LocalDateTime;  
  
@Data  
public class NotificacionDTO {  
    private Long id;  
    private String titulo;  
    private String mensaje;  
    private boolean leido;  
    private String tipo;  
    private LocalDateTime createdAt;  
} 
