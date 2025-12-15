"use client";

import { useAuth } from "@/src/features/auth/context/auth-context";

export function useCurrentUser() {
    const { user, hasRole } = useAuth();

    // Parsear el ID interno para llamadas a API
    const empleadoId = user?.id ? parseInt(user.id, 10) : 1;

    // El username en nuestro mock/keycloak actúa como número de socio o identificador de negocio
    const numeroSocio = user?.username || "PENDIENTE";

    return {
        user,
        empleadoId: isNaN(empleadoId) ? 1 : empleadoId, // ID interno (Long)
        numeroSocio, // Identificador de negocio (String)
        nombreCompleto: user ? `${user.nombre} ${user.apellido}` : "Usuario Invitado",
        email: user?.email,

        // Roles helper
        isAdmin: hasRole("TTHH"),
        isGerencia: hasRole("GERENCIA"),
        isAuditoria: hasRole("AUDITORIA"),
        isColaborador: hasRole("COLABORADOR"),

        // Raw roles
        roles: user?.roles || []
    };
}
