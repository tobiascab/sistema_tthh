package com.coopreducto.tthh.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class JwtService {

    @Value("${app.jwt.secret:cooperativa-reducto-jwt-secret-key-muy-segura-2024}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-hours:8}")
    private int expirationHours;

    private SecretKey getSigningKey() {
        // Asegurar que la clave tenga al menos 256 bits (32 bytes)
        String paddedSecret = jwtSecret;
        while (paddedSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            paddedSecret += jwtSecret;
        }
        return Keys.hmacShaKeyFor(paddedSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username, Long userId, List<String> roles, Long empleadoId) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(expirationHours * 3600L);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("roles", roles)
                .claim("empleadoId", empleadoId)
                .claim("iss", "sistema-tthh")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateToken(String username, Long userId, List<String> roles) {
        return generateToken(username, userId, roles, null);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token JWT inválido: {}", e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    public Long getUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        return getClaims(token).get("roles", List.class);
    }

    public Long getEmpleadoId(String token) {
        Object id = getClaims(token).get("empleadoId");
        if (id == null)
            return null;
        if (id instanceof Integer)
            return ((Integer) id).longValue();
        if (id instanceof Long)
            return (Long) id;
        return Long.parseLong(id.toString());
    }
}
