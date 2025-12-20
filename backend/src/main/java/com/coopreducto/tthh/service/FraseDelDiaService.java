package com.coopreducto.tthh.service;

import com.coopreducto.tthh.entity.FraseDelDia;
import com.coopreducto.tthh.repository.FraseDelDiaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraseDelDiaService {

    private final FraseDelDiaRepository fraseDelDiaRepository;

    // Frases por defecto si no hay ninguna en la BD
    private static final String[] FRASES_DEFAULT = {
            "Fomenta el feedback continuo para un equipo más comprometido y eficiente.",
            "Un reconocimiento a tiempo vale más que mil palabras.",
            "La comunicación clara evita el 80% de los conflictos laborales.",
            "Invertir en el desarrollo del equipo es invertir en el futuro.",
            "El bienestar de los colaboradores impacta directamente en la productividad.",
            "Escucha activa: la herramienta más poderosa del líder.",
            "Celebra los pequeños logros, construyen grandes equipos.",
            "La diversidad de pensamiento impulsa la innovación."
    };

    /**
     * Obtiene la frase del día (basada en el día del mes para consistencia)
     */
    public FraseDelDia obtenerFraseDelDia() {
        List<FraseDelDia> frasesActivas = fraseDelDiaRepository.findAllActivas();

        if (frasesActivas.isEmpty()) {
            // Retornar frase por defecto
            int index = LocalDate.now().getDayOfMonth() % FRASES_DEFAULT.length;
            return FraseDelDia.builder()
                    .id(0L)
                    .texto(FRASES_DEFAULT[index])
                    .autor("Equipo de HR")
                    .activa(true)
                    .build();
        }

        // Seleccionar basado en el día del mes para consistencia diaria
        int index = LocalDate.now().getDayOfMonth() % frasesActivas.size();
        return frasesActivas.get(index);
    }

    /**
     * Obtiene todas las frases (activas e inactivas) para gestión admin
     */
    public List<FraseDelDia> obtenerTodas() {
        return fraseDelDiaRepository.findAll();
    }

    /**
     * Obtiene solo las frases activas
     */
    public List<FraseDelDia> obtenerActivas() {
        return fraseDelDiaRepository.findAllActivas();
    }

    /**
     * Crea una nueva frase
     */
    @Transactional
    public FraseDelDia crear(FraseDelDia frase) {
        if (frase.getOrden() == null || frase.getOrden() == 0) {
            frase.setOrden((int) fraseDelDiaRepository.count() + 1);
        }
        if (frase.getActiva() == null) {
            frase.setActiva(true);
        }
        return fraseDelDiaRepository.save(frase);
    }

    /**
     * Actualiza una frase existente
     */
    @Transactional
    public FraseDelDia actualizar(Long id, FraseDelDia fraseActualizada) {
        return fraseDelDiaRepository.findById(id)
                .map(frase -> {
                    frase.setTexto(fraseActualizada.getTexto());
                    frase.setAutor(fraseActualizada.getAutor());
                    frase.setActiva(fraseActualizada.getActiva());
                    if (fraseActualizada.getOrden() != null) {
                        frase.setOrden(fraseActualizada.getOrden());
                    }
                    return fraseDelDiaRepository.save(frase);
                })
                .orElseThrow(() -> new RuntimeException("Frase no encontrada con id: " + id));
    }

    /**
     * Elimina una frase
     */
    @Transactional
    public void eliminar(Long id) {
        fraseDelDiaRepository.deleteById(id);
    }

    /**
     * Activa/Desactiva una frase
     */
    @Transactional
    public FraseDelDia toggleActiva(Long id) {
        return fraseDelDiaRepository.findById(id)
                .map(frase -> {
                    frase.setActiva(!frase.getActiva());
                    return fraseDelDiaRepository.save(frase);
                })
                .orElseThrow(() -> new RuntimeException("Frase no encontrada con id: " + id));
    }

    /**
     * Inicializa frases por defecto si la tabla está vacía
     */
    @Transactional
    public void inicializarFrasesDefault() {
        if (fraseDelDiaRepository.count() == 0) {
            log.info("📝 Inicializando frases del día por defecto...");
            for (int i = 0; i < FRASES_DEFAULT.length; i++) {
                FraseDelDia frase = FraseDelDia.builder()
                        .texto(FRASES_DEFAULT[i])
                        .autor("Equipo de HR")
                        .activa(true)
                        .orden(i + 1)
                        .build();
                fraseDelDiaRepository.save(frase);
            }
            log.info("✅ {} frases del día inicializadas", FRASES_DEFAULT.length);
        }
    }
}
