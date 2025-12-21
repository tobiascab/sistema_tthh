package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuloDTO {

    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String icono;
    private String rutaMenu;
    private Integer orden;
    private Boolean activo;
    private Boolean esDefault;
    private Long moduloPadreId;
    private String moduloPadreNombre;
}
