package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.PushSubscriptionDTO;
import com.coopreducto.tthh.service.WebPushService;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger; // Keep native logger just in case, or rely on slf4j annotation
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class WebPushServiceImpl implements WebPushService {

    @Value("${webpush.vapid.public-key}")
    private String publicKey;

    @Value("${webpush.vapid.private-key}")
    private String privateKey;

    @Value("${webpush.vayid.subject:mailto:admin@coopreducto.com}")
    private String subject;

    private PushService pushService;

    // In a real app, subscriptions should be stored in DB
    // For this prototype, we'll store active subscriptions in memory
    // Key: Endpoint (unique ID), Value: Subscription + User Metadata
    private static final java.util.Map<String, SubscriptionHolder> subscriptions = new java.util.concurrent.ConcurrentHashMap<>();

    @Data
    @AllArgsConstructor
    private static class SubscriptionHolder {
        private nl.martijndwars.webpush.Subscription subscription;
        private Long usuarioId;
        private String rolName;
    }

    @PostConstruct
    public void init() throws Exception {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        this.pushService = new PushService(publicKey, privateKey, subject);
    }

    @Override
    public String getPublicKey() {
        return publicKey;
    }

    @Override
    public void subscribe(PushSubscriptionDTO dto, Long usuarioId, String rolName) {
        nl.martijndwars.webpush.Subscription sub = new nl.martijndwars.webpush.Subscription(
                dto.getEndpoint(),
                new nl.martijndwars.webpush.Subscription.Keys(
                        dto.getKeys().getP256dh(),
                        dto.getKeys().getAuth()));
        subscriptions.put(dto.getEndpoint(), new SubscriptionHolder(sub, usuarioId, rolName));
        log.info("Subscribed user {} role {} endpoint {}", usuarioId, rolName, dto.getEndpoint());
    }

    @Override
    public void unsubscribe(String endpoint) {
        subscriptions.remove(endpoint);
        log.info("Unsubscribed endpoint {}", endpoint);
    }

    @Override
    public void sendToRole(String rolName, String title, String body, String url) {
        log.info("Sending push to role {}: {} - {}", rolName, title, body);
        List<SubscriptionHolder> targets = subscriptions.values().stream()
                .filter(h -> rolName.equals(h.getRolName()) || "TTHH".equals(h.getRolName())) // TTHH always sees all?
                                                                                              // Or strictly role based?
                // For now, let's send to exact match or TTHH (superadmin view)
                .toList();

        sendToTargets(targets, title, body, url);
    }

    @Override
    public void sendToUser(Long usuarioId, String title, String body, String url) {
        log.info("Sending push to user {}: {} - {}", usuarioId, title, body);
        List<SubscriptionHolder> targets = subscriptions.values().stream()
                .filter(h -> usuarioId != null && usuarioId.equals(h.getUsuarioId()))
                .toList();

        sendToTargets(targets, title, body, url);
    }

    private void sendToTargets(List<SubscriptionHolder> targets, String title, String body, String url) {
        String payload = String.format(
                "{\"title\":\"%s\",\"body\":\"%s\",\"url\":\"%s\",\"icon\":\"/icon-192x192.png\"}",
                title, body, url != null ? url : "/dashboard");

        for (SubscriptionHolder holder : targets) {
            try {
                Notification notification = new Notification(
                        holder.getSubscription(),
                        payload);
                pushService.send(notification);
            } catch (Exception e) {
                log.error("Failed to send push to {}: {}", holder.getSubscription().endpoint, e.getMessage());
                // Remove invalid subscriptions
                if (e.getMessage().contains("410") || e.getMessage().contains("404")) {
                    subscriptions.remove(holder.getSubscription().endpoint);
                }
            }
        }
    }

    @Override
    public List<String> getSubscriptionsByRole(String rolName) {
        return subscriptions.values().stream()
                .filter(h -> rolName.equals(h.getRolName()))
                .map(h -> h.getSubscription().endpoint)
                .toList();
    }
}
