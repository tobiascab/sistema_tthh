"use client";

import { useAuth } from "@/src/features/auth/context/auth-context";

export function useCurrentUser() {
    const { user, hasRole } = useAuth();

    // Use the real empleadoId from user object, fallback to localStorage if available
    const empleadoId = user?.empleadoId ||
        (typeof window !== 'undefined' ? parseInt(localStorage.getItem('empleadoId') || '0', 10) : 0) ||
        (user?.id ? parseInt(user.id, 10) : 0);

    // El username en nuestro mock/keycloak actúa como número de socio o identificador de negocio
    const numeroSocio = user?.username || "PENDIENTE";

    return {
        user,
        empleadoId: isNaN(empleadoId) ? 0 : empleadoId, // ID interno (Long) - 0 means not linked
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
