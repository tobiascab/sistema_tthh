"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FileText,
    Download,
    Target
} from "lucide-react";

import { comisionesApi } from "@/src/lib/api/comisiones";
import { empleadosApi } from "@/src/lib/api/empleados";
import { ESTADOS_COMISION } from "@/src/types/comision";
import { MESES } from "@/src/types/payroll";
import { Button } from "@/src/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/hooks/use-toast";
import { ReportFilterBar } from "@/src/components/reports/report-filter-bar";
import { ReportStatsCard } from "@/src/components/reports/report-stats-card";

interface ComisionesListProps {
    empleadoId?: number;
    isAdmin?: boolean;
}

export function ComisionesList({ empleadoId, isAdmin = false }: ComisionesListProps) {
    const { toast } = useToast();
    const [filters, setFilters] = useState({
        sucursal: "Todas las sucursales",
        colaboradorId: empleadoId ? empleadoId.toString() : "all",
        mes: "all",
        anio: new Date().getFullYear()
    });

    // Obtener lista de colaboradores para el filtro (solo si es admin)
    const { data: empsPage } = useQuery({
        queryKey: ["empleados-simple"],
        queryFn: () => empleadosApi.getAll({ size: 200, estado: "ACTIVO" }),
        enabled: isAdmin
    });

    const colaboradores = useMemo(() => {
        return empsPage?.content.map(e => ({ id: e.id, nombre: e.nombreCompleto })) || [];
    }, [empsPage]);

    const { data: comisionesPage, isLoading } = useQuery({
        queryKey: ["comisiones", filters],
        queryFn: () => comisionesApi.getAll({
            empleadoId: filters.colaboradorId !== "all" ? parseInt(filters.colaboradorId) : undefined,
            anio: filters.anio,
            mes: filters.mes !== "all" ? parseInt(filters.mes) : undefined,
            sucursal: filters.sucursal,
            size: 100
        }),
    });

    const totalMonto = useMemo(() => {
        return comisionesPage?.content.reduce((sum, c) => sum + c.montoComision, 0) || 0;
    }, [comisionesPage]);

    const handleDownload = async (id: number, periodo: string) => {
        try {
            const blob = await comisionesApi.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `comision_${periodo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Descarga iniciada",
                description: "El recibo de comisión se está descargando...",
            });
        } catch (error) {
            console.error("Error downloading commission receipt:", error);
            toast({
                title: "Error",
                description: "No se pudo descargar el recibo de comisión.",
                variant: "destructive",
            });
        }
    };

    const handleExportExcel = async () => {
        try {
            toast({ title: "Excel", description: "Generando reporte Excel..." });
            const blob = await comisionesApi.exportExcel(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_comisiones_${filters.anio}_${filters.mes}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error exporting Excel:", error);
            toast({ title: "Error", description: "No se pudo generar el reporte Excel.", variant: "destructive" });
        }
    };

    const handleExportPdf = async () => {
        try {
            toast({ title: "PDF", description: "Generando reporte PDF..." });
            const blob = await comisionesApi.exportPdf(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_comisiones_${filters.anio}_${filters.mes}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error exporting PDF:", error);
            toast({ title: "Error", description: "No se pudo generar el reporte PDF.", variant: "destructive" });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getMesNombre = (mes: number) => {
        return MESES.find(m => m.value === mes)?.label || mes;
    };

    return (
        <div className="space-y-6">
            <ReportFilterBar
                currentFilters={filters}
                onFilterChange={setFilters}
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
                colaboradores={colaboradores}
                showAdminFilters={isAdmin && !empleadoId}
            />

            <ReportStatsCard
                totalMonto={totalMonto}
                cantidadRecibos={comisionesPage?.totalElements || 0}
                labelMonto="TOTAL COMISIONES VISIBLES"
            />

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-neutral-50/50">
                            <TableRow>
                                {isAdmin && <TableHead>Colaborador</TableHead>}
                                <TableHead>Periodo</TableHead>
                                <TableHead>Producción</TableHead>
                                <TableHead>Comisión</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comisionesPage?.content.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-12">
                                        <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                                        <p className="text-neutral-500 font-medium">No hay comisiones registradas para este periodo</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                comisionesPage?.content.map((comision) => (
                                    <TableRow key={comision.id} className="hover:bg-neutral-50/50 transition-colors">
                                        {isAdmin && (
                                            <TableCell className="font-medium text-neutral-900">
                                                {comision.empleadoNombre}
                                            </TableCell>
                                        )}
                                        <TableCell className="font-semibold text-neutral-700">
                                            {getMesNombre(comision.mes)} {comision.anio}
                                        </TableCell>
                                        <TableCell className="text-neutral-600">
                                            <div className="flex flex-col">
                                                <span>{formatCurrency(comision.produccionMensual)}</span>
                                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                                    <Target className="w-2.5 h-2.5" />
                                                    {comision.metaAlcanzadaPorcentaje}% Meta
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-black text-emerald-700">
                                            {formatCurrency(comision.montoComision)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${ESTADOS_COMISION[comision.estado]?.color} border-none shadow-none`}>
                                                {ESTADOS_COMISION[comision.estado]?.label || comision.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-neutral-200 hover:bg-neutral-50 rounded-lg"
                                                onClick={() => handleDownload(comision.id, `${comision.mes}_${comision.anio}`)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Liquidación
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
