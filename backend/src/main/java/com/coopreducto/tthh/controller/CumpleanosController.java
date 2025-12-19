package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.ConfiguracionDTO;
import com.coopreducto.tthh.dto.CumpleanosManualDTO;
import com.coopreducto.tthh.service.CumpleanosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cumpleanos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CumpleanosController {

    private final CumpleanosService service;

    @GetMapping("/config")
    public ResponseEntity<ConfiguracionDTO> getConfig() {
        return ResponseEntity.ok(service.getConfiguracion());
    }

    @PostMapping("/config")
    public ResponseEntity<ConfiguracionDTO> setConfig(@RequestBody Map<String, String> body) {
        String valor = body.get("valor");
        if (valor == null || (!valor.equals("EMPLOYEES") && !valor.equals("MANUAL"))) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.setConfiguracion(valor));
    }

    @GetMapping("/mes")
    public ResponseEntity<List<CumpleanosManualDTO>> getDelMes() {
        return ResponseEntity.ok(service.getCumpleanosDelMes());
    }

    @GetMapping("/manual")
    public ResponseEntity<List<CumpleanosManualDTO>> getAllManual() {
        return ResponseEntity.ok(service.getAllManual());
    }

    @PostMapping("/manual")
    public ResponseEntity<CumpleanosManualDTO> createManual(@RequestBody CumpleanosManualDTO dto) {
        return ResponseEntity.ok(service.createManual(dto));
    }

    @DeleteMapping("/manual/{id}")
    public ResponseEntity<Void> deleteManual(@PathVariable Long id) {
        service.deleteManual(id);
        return ResponseEntity.ok().build();
    }
}
