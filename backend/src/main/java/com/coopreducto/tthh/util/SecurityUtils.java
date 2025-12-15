package com.coopreducto.tthh.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtils {

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getClaimAsString("preferred_username");
        }
        return "system";
    }

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            return jwt.getClaimAsString("email");
        }
        return null;
    }

    public static Long getCurrentUserId() {
        // This assumes the user ID is stored in the token or we need to look it up
        // For now, we'll return a placeholder or parse it if it's in the token
        return 1L; // Placeholder: In a real app, you'd look up the user by email/username
    }
}
