"use client";

import { PageHeader } from "@/src/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Clock, TrendingUp, History } from "lucide-react";
import { AsistenciaList } from "@/src/features/asistencia/components/asistencia-list";
import { ReporteTardanzas } from "@/src/features/asistencia/components/reporte-tardanzas";

export default function MarcacionesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestión de Marcaciones"
                description="Monitoreo de asistencia en tiempo real y análisis de puntualidad."
                icon={<Clock className="w-6 h-6 text-emerald-600" />}
            />

            <Tabs defaultValue="listado" className="space-y-4">
                <TabsList className="bg-white border text-neutral-500">
                    <TabsTrigger value="listado" className="data-[state=active]:text-emerald-700 data-[state=active]:bg-emerald-50">
                        <History className="w-4 h-4 mr-2" />
                        Historial Global
                    </TabsTrigger>
                    <TabsTrigger value="reportes" className="data-[state=active]:text-emerald-700 data-[state=active]:bg-emerald-50">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Reporte de Tardanzas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="listado">
                    <AsistenciaList isAdmin />
                </TabsContent>

                <TabsContent value="reportes">
                    <ReporteTardanzas />
                </TabsContent>
            </Tabs>
        </div>
    );
}
