package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.PushSubscriptionDTO;
import java.util.List;

public interface WebPushService {

    /**
     * Get VAPID public key for frontend subscription
     */
    String getPublicKey();

    /**
     * Subscribe a user to push notifications
     */
    void subscribe(PushSubscriptionDTO subscription, Long usuarioId, String rolName);

    /**
     * Unsubscribe from push notifications
     */
    void unsubscribe(String endpoint);

    /**
     * Send notification to all users with a specific role
     */
    void sendToRole(String rolName, String title, String body, String url);

    /**
     * Send notification to a specific user
     */
    void sendToUser(Long usuarioId, String title, String body, String url);

    /**
     * Get all subscription endpoints for a role (for debugging)
     */
    List<String> getSubscriptionsByRole(String rolName);
}
