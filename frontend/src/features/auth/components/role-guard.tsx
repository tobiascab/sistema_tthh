"use client";

import { useEffect, useState } from "react";

type Role = "TTHH" | "GERENCIA" | "AUDITORIA" | "COLABORADOR";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        // TODO: Implement proper role checking from JWT
        // For now, assume TTHH role
        const userRole: Role = "TTHH";
        setHasAccess(allowedRoles.includes(userRole));
    }, [allowedRoles]);

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                        Acceso Denegado
                    </h2>
                    <p className="text-neutral-600">
                        No tiene permisos para acceder a esta sección.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
