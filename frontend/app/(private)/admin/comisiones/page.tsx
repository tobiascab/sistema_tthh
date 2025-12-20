"use client";

import { PageHeader } from "@/src/components/ui/page-header";
import { ComisionesList } from "@/src/features/comisiones/components/comisiones-list";
import { BadgeDollarSign } from "lucide-react";

export default function AdminComisionesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Comisiones"
                description="Administración y supervisión de liquidaciones por cumplimiento de metas y producción."
                icon={<BadgeDollarSign className="w-6 h-6 text-emerald-600" />}
            />

            <ComisionesList isAdmin />
        </div>
    );
}
