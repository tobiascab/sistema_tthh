import { NominaDashboard } from "@/src/features/payroll/components/nomina-dashboard";
import { RecibosList } from "@/src/features/payroll/components/recibos-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { FileText, LayoutDashboard } from "lucide-react";

export default function NominasPage() {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="bg-white border text-neutral-500 border-neutral-200 w-full md:w-auto">
                    <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 flex-1 md:flex-none">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard y Planillas
                    </TabsTrigger>
                    <TabsTrigger value="recibos" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 flex-1 md:flex-none">
                        <FileText className="w-4 h-4 mr-2" />
                        Explorador de Recibos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6 animate-in fade-in-50 duration-300">
                    <NominaDashboard />
                </TabsContent>

                <TabsContent value="recibos" className="mt-6 animate-in fade-in-50 duration-300">
                    <div className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-sm">
                            <p className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Explorador Global de Recibos
                            </p>
                            <p className="opacity-90 mt-1">
                                Utilice los filtros a continuación para buscar, visualizar y exportar recibos de salario individuales o masivos.
                            </p>
                        </div>
                        <RecibosList isAdmin />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
