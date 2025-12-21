package com.coopreducto.tthh.service;

public interface ConfiguracionService {
    String getValor(String clave);

    String getValor(String clave, String defaultValue);

    void setValor(String clave, String valor);

    boolean isModoMantenimiento();

    void setModoMantenimiento(boolean activo);
}
