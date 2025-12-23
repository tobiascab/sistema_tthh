"use client";

import { SolicitudesList } from "@/src/features/solicitudes/components/solicitudes-list";
import { useCurrentUser } from "@/src/hooks/use-current-user";

export default function SolicitudesPage() {
    const { empleadoId, isAdmin, isGerencia, isAuditoria } = useCurrentUser();
    const isAdminOrManager = isAdmin || isGerencia || isAuditoria;

    return (
        <div className="space-y-6">
            <SolicitudesList empleadoId={isAdminOrManager ? undefined : empleadoId} />
        </div>
    );
}
