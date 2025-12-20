import { RoleGuard } from "@/src/features/auth/components/role-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { DemografiaCharts } from "@/src/features/reportes/components/demografia-charts";
import { AusentismoChart } from "@/src/features/reportes/components/ausentismo-chart";
import { RecibosList } from "@/src/features/payroll/components/recibos-list";
import { FileText, Users, Activity } from "lucide-react";

export default function ReportesPage() {
    return (
        <RoleGuard allowedRoles={["TTHH", "GERENCIA", "AUDITORIA"]}>
            <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                        <Activity className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                            Analítica de Gestión
                        </h1>
                        <p className="text-neutral-500 text-lg">
                            Indicadores clave de desempeño y demografía organizacional.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="demografia" className="w-full">
                    <TabsList className="bg-white border text-neutral-500 border-neutral-200">
                        <TabsTrigger value="demografia" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                            <Users className="w-4 h-4 mr-2" />
                            Demografía
                        </TabsTrigger>
                        <TabsTrigger value="ausentismo" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                            <Activity className="w-4 h-4 mr-2" />
                            Ausentismo
                        </TabsTrigger>
                        <TabsTrigger value="nomina" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Nóminas
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="demografia" className="mt-6">
                        <DemografiaCharts />
                    </TabsContent>

                    <TabsContent value="ausentismo" className="mt-6">
                        <AusentismoChart />
                    </TabsContent>

                    <TabsContent value="nomina" className="mt-6">
                        <RecibosList isAdmin />
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
