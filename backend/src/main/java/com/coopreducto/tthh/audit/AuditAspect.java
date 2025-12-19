package com.coopreducto.tthh.audit;

import com.coopreducto.tthh.service.AuditoriaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditoriaService auditoriaService;

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "result")
    public void auditMethod(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String usuario = authentication != null ? authentication.getName() : "SYSTEM";

            // Get HTTP request info
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            String ipAddress = "unknown";
            String userAgent = "unknown";

            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = getClientIP(request);
                userAgent = request.getHeader("User-Agent");
                if (userAgent != null && userAgent.length() > 200) {
                    userAgent = userAgent.substring(0, 200);
                }
            }

            // Extract entity ID from result if available
            Long entidadId = extractEntityId(result);

            // Create audit log
            String detalles = String.format("%s - Método: %s",
                    auditable.descripcion(),
                    joinPoint.getSignature().getName());

            auditoriaService.logAccion(
                    usuario,
                    auditable.accion(),
                    auditable.entidad(),
                    entidadId,
                    detalles,
                    ipAddress,
                    userAgent);

        } catch (Exception e) {
            log.error("Error al crear registro de auditoría", e);
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }

        return request.getRemoteAddr();
    }

    private Long extractEntityId(Object result) {
        if (result == null) {
            return null;
        }

        try {
            // Try to get ID via reflection
            var idMethod = result.getClass().getMethod("getId");
            Object id = idMethod.invoke(result);
            if (id instanceof Long) {
                return (Long) id;
            }
        } catch (Exception e) {
            // ID not available or not accessible
        }

        return null;
    }
}
