package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.entity.Configuracion;
import com.coopreducto.tthh.repository.ConfiguracionRepository;
import com.coopreducto.tthh.service.ConfiguracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConfiguracionServiceImpl implements ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    private static final String KEY_MODO_MANTENIMIENTO = "SYSTEM_MAINTENANCE_MODE";

    @Override
    public String getValor(String clave) {
        return configuracionRepository.findByClave(clave)
                .map(Configuracion::getValor)
                .orElse(null);
    }

    @Override
    public String getValor(String clave, String defaultValue) {
        return configuracionRepository.findByClave(clave)
                .map(Configuracion::getValor)
                .orElse(defaultValue);
    }

    @Override
    @Transactional
    public void setValor(String clave, String valor) {
        Configuracion config = configuracionRepository.findByClave(clave)
                .orElse(Configuracion.builder().clave(clave).build());

        config.setValor(valor);
        configuracionRepository.save(config);
    }

    @Override
    public boolean isModoMantenimiento() {
        String valor = getValor(KEY_MODO_MANTENIMIENTO, "false");
        return Boolean.parseBoolean(valor);
    }

    @Override
    @Transactional
    public void setModoMantenimiento(boolean activo) {
        setValor(KEY_MODO_MANTENIMIENTO, String.valueOf(activo));
    }
}
