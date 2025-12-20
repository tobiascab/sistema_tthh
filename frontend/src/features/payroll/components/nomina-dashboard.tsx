"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { GenerarPlanillaDialog } from "./generar-planilla-dialog";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import {
    Plus,
    DollarSign,
    Calendar,
    Users,
    ArrowRight,
    TrendingUp,
    FileText,
    CheckCircle2,
    Clock,
    Lock
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { payrollApi } from "@/src/lib/api/payroll";
import { MESES, ESTADOS_RECIBO } from "@/src/types/payroll";
import { useToast } from "@/src/hooks/use-toast";

export function NominaDashboard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isGenerarOpen, setIsGenerarOpen] = useState(false);

    // Obtener datos reales del dashboard
    const { data: dashboard, isLoading } = useQuery({
        queryKey: ["payroll-dashboard"],
        queryFn: () => payrollApi.getDashboardSummary(),
    });

    // Mutación para cerrar/aprobar nómina
    const closeMutation = useMutation({
        mutationFn: ({ anio, mes }: { anio: number; mes: number }) => payrollApi.cerrar(anio, mes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payroll-dashboard"] });
            toast({
                title: "Nómina Cerrada",
                description: "La planilla ha sido aprobada y los recibos están disponibles.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo cerrar la nómina.",
                variant: "destructive",
            });
        }
    });

    const nominas = dashboard?.historial || [];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(val);

    const handleExport = async (anio: number, mes: number) => {
        try {
            const blob = await payrollApi.exportPlanilla(anio, mes);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `planilla_bancaria_${mes}_${anio}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Exportación exitosa",
                description: "La planilla bancaria se ha descargado correctamente.",
            });
        } catch (error) {
            console.error("Error exporting bank sheet:", error);
            toast({
                title: "Error",
                description: "No se pudo exportar la planilla bancaria.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        Gestión de Nómina
                    </h1>
                    <p className="text-neutral-500 mt-2 text-lg">
                        Generación de planillas y control de pagos salariales.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={() => setIsGenerarOpen(true)}
                        className="bg-neutral-900 text-white hover:bg-neutral-800 h-12 px-6 rounded-xl font-bold shadow-lg shadow-neutral-900/20"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Generar Nueva Planilla
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-neutral-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                            Total Pagado (Año Actual)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900">{formatCurrency(dashboard?.totalPagadoAnio || 0)}</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Acumulado real
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-neutral-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                            Última Nómina
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900">{formatCurrency(dashboard?.ultimoMontoNeto || 0)}</div>
                        <p className="text-xs text-neutral-500 mt-1">
                            {dashboard?.mesUltimaNomina ?
                                `${MESES.find(m => m.value === dashboard.mesUltimaNomina)?.label} ${dashboard.anioUltimaNomina}` :
                                "Sin registros"}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-neutral-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                            Empleados en Planilla
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900">{dashboard?.ultimoConteoEmpleados || 0}</div>
                        <p className="text-xs text-neutral-500 mt-1">
                            En el último periodo generado
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Nominas Table */}
            <Card className="border-neutral-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
                    <CardTitle className="text-lg font-bold text-neutral-800">Historial de Planillas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Periodo</TableHead>
                                <TableHead>Fecha Generación</TableHead>
                                <TableHead>Empleados</TableHead>
                                <TableHead>Total Neto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right pr-6">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                nominas.map((nomina) => (
                                    <TableRow key={`${nomina.anio}-${nomina.mes}`} className="hover:bg-neutral-50 transition-colors">
                                        <TableCell className="pl-6 font-medium text-neutral-900">
                                            {MESES.find(m => m.value === nomina.mes)?.label} {nomina.anio}
                                        </TableCell>
                                        <TableCell className="text-neutral-500">
                                            {format(new Date(nomina.fechaGeneracion), "dd/MM/yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell className="text-neutral-500">
                                            {nomina.totalEmpleados}
                                        </TableCell>
                                        <TableCell className="font-semibold text-emerald-700">
                                            {formatCurrency(nomina.totalNeto)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={ESTADOS_RECIBO[nomina.estado as keyof typeof ESTADOS_RECIBO]?.color || "bg-neutral-50"}>
                                                {nomina.estado === 'BORRADOR' && <Clock className="w-3 h-3 mr-1" />}
                                                {nomina.estado === 'GENERADO' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {ESTADOS_RECIBO[nomina.estado as keyof typeof ESTADOS_RECIBO]?.label || nomina.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                {nomina.estado === 'BORRADOR' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                        onClick={() => closeMutation.mutate({ anio: nomina.anio, mes: nomina.mes })}
                                                        disabled={closeMutation.isPending}
                                                    >
                                                        {closeMutation.isPending ? "Cerrando..." : "Cerrar Nómina"}
                                                        <Lock className="ml-2 w-3 h-3" />
                                                    </Button>
                                                )}
                                                {(nomina.estado === 'GENERADO' || nomina.estado === 'ENVIADO') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handleExport(nomina.anio, nomina.mes)}
                                                    >
                                                        Planilla Bancaria
                                                        <FileText className="ml-2 w-3 h-3" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="hover:text-emerald-600">
                                                    Ver Detalle
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <GenerarPlanillaDialog
                open={isGenerarOpen}
                onOpenChange={setIsGenerarOpen}
            />
        </div>
    );
}
