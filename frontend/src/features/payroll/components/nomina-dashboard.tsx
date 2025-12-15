"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { MESES } from "@/src/types/payroll";

// Mock data until we have a proper endpoint for "Payroll Runs"
const MOCK_NOMINAS = [
    { id: 1, mes: 11, anio: 2025, totalEmpleados: 148, totalNeto: 450000000, estado: "CERRADA", fechaGeneracion: "2025-11-25T10:00:00" },
    { id: 2, mes: 10, anio: 2025, totalEmpleados: 145, totalNeto: 442000000, estado: "CERRADA", fechaGeneracion: "2025-10-25T09:30:00" },
    { id: 3, mes: 9, anio: 2025, totalEmpleados: 142, totalNeto: 438000000, estado: "CERRADA", fechaGeneracion: "2025-09-26T11:15:00" },
];

export function NominaDashboard() {
    const [isGenerarOpen, setIsGenerarOpen] = useState(false);

    // In a real app, useQuery to fetch /api/payroll/nominas
    const { data: nominas = MOCK_NOMINAS, isLoading } = useQuery({
        queryKey: ["nominas"],
        queryFn: async () => {
            // Simulate API call
            await new Promise(r => setTimeout(r, 1000));
            return MOCK_NOMINAS;
        }
    });

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(val);

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
                        <div className="text-2xl font-bold text-neutral-900">{formatCurrency(1330000000)}</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12% vs año anterior
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
                        <div className="text-2xl font-bold text-neutral-900">{formatCurrency(450000000)}</div>
                        <p className="text-xs text-neutral-500 mt-1">
                            Noviembre 2025
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
                        <div className="text-2xl font-bold text-neutral-900">148</div>
                        <p className="text-xs text-neutral-500 mt-1">
                            Activos en último cierre
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
                                    <TableRow key={nomina.id} className="hover:bg-neutral-50 transition-colors">
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
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                {nomina.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" className="hover:text-emerald-600">
                                                Ver Detalle
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
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
