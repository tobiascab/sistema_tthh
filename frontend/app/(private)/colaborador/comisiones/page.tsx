"use client";

import { PageHeader } from "@/src/components/ui/page-header";
import { ComisionesList } from "@/src/features/comisiones/components/comisiones-list";
import { BadgeDollarSign } from "lucide-react";
import { useAuth } from "@/src/features/auth/context/auth-context";

export default function MisComisionesPage() {
    const { user, hasAnyRole } = useAuth();
    const isAdmin = hasAnyRole(["TTHH", "GERENCIA"]);

    // Si es administrador, no restringimos por ID (para que aparezcan los filtros globales)
    // Si es colaborador normal, restringimos a su ID.
    const targetEmpleadoId = isAdmin ? undefined : user?.empleadoId;

    return (
        <div className="space-y-6">
            <PageHeader
                title={isAdmin ? "Gestión de Comisiones" : "Mis Comisiones"}
                description={isAdmin
                    ? "Administración global de liquidaciones y metas."
                    : "Visualiza tus liquidaciones de comisiones por producción y cumplimiento de metas."}
                icon={<BadgeDollarSign className="w-6 h-6 text-emerald-600" />}
            />

            <ComisionesList
                empleadoId={targetEmpleadoId}
                isAdmin={isAdmin}
            />
        </div>
    );
}
