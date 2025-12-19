package com.coopreducto.tthh.service.impl;

import com.coopreducto.tthh.dto.PushSubscriptionDTO;
import com.coopreducto.tthh.service.WebPushService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class WebPushServiceImpl implements WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushServiceImpl.class);

    @Override
    public String getPublicKey() {
        return "BMkXmF5cR7hy3J9s_1hT7e0_y5p5t5r5e5w5q5a5s5d5f5g5h5j5k5l";
    }

    @Override
    public void subscribe(PushSubscriptionDTO dto, Long usuarioId, String rolName) {
        log.info("Push subscription received (Dummy due to missing lib): {}", dto.getEndpoint());
    }

    @Override
    public void unsubscribe(String endpoint) {
        log.info("Push unsubscribe received (Dummy due to missing lib): {}", endpoint);
    }

    @Override
    public void sendToRole(String rolName, String title, String body, String url) {
        log.info("Sending push to role {} (Dummy due to missing lib): {} - {}", rolName, title, body);
    }

    @Override
    public void sendToUser(Long usuarioId, String title, String body, String url) {
        log.info("Sending push to user {} (Dummy due to missing lib): {} - {}", usuarioId, title, body);
    }

    @Override
    public List<String> getSubscriptionsByRole(String rolName) {
        return Collections.emptyList();
    }
}
