package com.coopreducto.tthh.controller;

import com.coopreducto.tthh.dto.PushSubscriptionDTO;
import com.coopreducto.tthh.service.WebPushService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
@CrossOrigin(origins = "*")
public class PushController {

    private final WebPushService webPushService;

    public PushController(WebPushService webPushService) {
        this.webPushService = webPushService;
    }

    /**
     * Get VAPID public key for frontend subscription
     */
    @GetMapping("/vapid-public-key")
    public ResponseEntity<Map<String, String>> getVapidPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", webPushService.getPublicKey()));
    }

    /**
     * Subscribe to push notifications
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @RequestBody PushSubscriptionDTO subscription,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam(required = false, defaultValue = "TTHH") String rolName) {

        webPushService.subscribe(subscription, usuarioId, rolName);
        return ResponseEntity.ok(Map.of("message", "Subscribed successfully"));
    }

    /**
     * Unsubscribe from push notifications
     */
    @PostMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint != null) {
            webPushService.unsubscribe(endpoint);
        }
        return ResponseEntity.ok(Map.of("message", "Unsubscribed successfully"));
    }

    /**
     * Send test notification (for debugging)
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testNotification(
            @RequestParam(defaultValue = "TTHH") String rolName) {

        webPushService.sendToRole(rolName,
                "🔔 Notificación de Prueba",
                "El sistema de notificaciones está funcionando correctamente.",
                "/dashboard");

        return ResponseEntity.ok(Map.of(
                "message", "Test notification sent",
                "role", rolName,
                "subscriptions", webPushService.getSubscriptionsByRole(rolName).size()));
    }
}
