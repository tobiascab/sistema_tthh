"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FileText,
    Download,
    Mail,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { payrollApi } from "@/src/lib/api/payroll";
import { empleadosApi } from "@/src/lib/api/empleados";
import { MESES, ESTADOS_RECIBO } from "@/src/types/payroll";
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

interface RecibosListProps {
    empleadoId?: number;
    isAdmin?: boolean;
}

export function RecibosList({ empleadoId, isAdmin = false }: RecibosListProps) {
    const { toast } = useToast();
    const [filters, setFilters] = useState({
        sucursal: "Todas las sucursales",
        colaboradorId: empleadoId ? empleadoId.toString() : "all",
        mes: "all",
        anio: new Date().getFullYear()
    });

    // Obtener lista de colaboradores para el filtro (solo si es admin)
    const { data: empsPage } = useQuery({
        queryKey: ["empleados-simple-payroll"],
        queryFn: () => empleadosApi.getAll({ size: 200, estado: "ACTIVO" }),
        enabled: isAdmin
    });

    const colaboradores = useMemo(() => {
        return empsPage?.content.map(e => ({ id: e.id, nombre: e.nombreCompleto })) || [];
    }, [empsPage]);

    const { data: recibosPage, isLoading } = useQuery({
        queryKey: ["recibos", filters],
        queryFn: () => payrollApi.getAll({
            empleadoId: filters.colaboradorId !== "all" ? parseInt(filters.colaboradorId) : undefined,
            anio: filters.anio,
            mes: filters.mes !== "all" ? parseInt(filters.mes) : undefined,
            sucursal: filters.sucursal,
            size: 100
        }),
    });

    const totalMonto = useMemo(() => {
        return recibosPage?.content.reduce((sum, r) => sum + r.salarioNeto, 0) || 0;
    }, [recibosPage]);

    const handleDownload = async (id: number, periodo: string) => {
        try {
            const blob = await payrollApi.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recibo_salario_${periodo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Descarga iniciada",
                description: "El recibo se está descargando...",
            });
        } catch (error) {
            console.error("Error downloading receipt:", error);
            toast({
                title: "Error",
                description: "No se pudo descargar el recibo.",
                variant: "destructive",
            });
        }
    };

    const handleSendEmail = async (id: number) => {
        try {
            await payrollApi.sendEmail(id);
            toast({
                title: "Correo enviado",
                description: "El recibo ha sido enviado por correo electrónico.",
            });
        } catch (error) {
            console.error("Error sending email:", error);
            toast({
                title: "Error",
                description: "No se pudo enviar el correo.",
                variant: "destructive",
            });
        }
    };

    const handleExportExcel = async () => {
        try {
            toast({ title: "Excel", description: "Generando reporte Excel..." });
            const blob = await payrollApi.exportExcel(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_salarios_${filters.anio}_${filters.mes}.xlsx`;
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
            const blob = await payrollApi.exportPdf(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_salarios_${filters.anio}_${filters.mes}.pdf`;
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
                colaboradores={colaboradores}
                showAdminFilters={isAdmin && !empleadoId}
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
            />

            <ReportStatsCard
                totalMonto={totalMonto}
                cantidadRecibos={recibosPage?.totalElements || 0}
                labelMonto="TOTAL NÓMINA VISIBLE"
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
                                <TableHead>Fecha de Pago</TableHead>
                                <TableHead>Salario Neto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recibosPage?.content.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-12">
                                        <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                                        <p className="text-neutral-500 font-medium">No hay recibos registrados para este periodo</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recibosPage?.content.map((recibo) => (
                                    <TableRow key={recibo.id} className="hover:bg-neutral-50/50 transition-colors">
                                        {isAdmin && (
                                            <TableCell className="font-medium text-neutral-900">
                                                {recibo.empleadoNombre}
                                            </TableCell>
                                        )}
                                        <TableCell className="font-semibold text-neutral-700">
                                            {getMesNombre(recibo.mes)} {recibo.anio}
                                        </TableCell>
                                        <TableCell className="text-neutral-500">
                                            {format(new Date(recibo.fechaPago), "dd/MM/yyyy", { locale: es })}
                                        </TableCell>
                                        <TableCell className="font-black text-emerald-700">
                                            {formatCurrency(recibo.salarioNeto)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${ESTADOS_RECIBO[recibo.estado]?.color} border-none shadow-none`}>
                                                {ESTADOS_RECIBO[recibo.estado]?.label || recibo.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {isAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleSendEmail(recibo.id)}
                                                        className="hover:bg-neutral-100 rounded-lg"
                                                    >
                                                        <Mail className="w-4 h-4 text-neutral-500" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-neutral-200 hover:bg-neutral-50 rounded-lg"
                                                    onClick={() => handleDownload(recibo.id, `${recibo.mes}_${recibo.anio}`)}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Recibo
                                                </Button>
                                            </div>
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
