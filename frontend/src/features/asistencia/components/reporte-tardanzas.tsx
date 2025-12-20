"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { asistenciaApi } from "@/src/lib/api/asistencia";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Clock, DollarSign, TrendingUp, AlertTriangle, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { MESES } from "@/src/types/payroll";

export function ReporteTardanzas() {
    const [mes, setMes] = useState(new Date().getMonth() + 1);
    const [anio, setAnio] = useState(new Date().getFullYear());

    const { data: report, isLoading } = useQuery({
        queryKey: ["reporte-tardanzas-global", anio, mes],
        queryFn: () => asistenciaApi.getReporteGlobal(anio, mes),
    });

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(val);

    const tardanzas = report?.tardanzas || [];
    const totalDescuentosPeriodo = tardanzas.reduce((acc, curr) => acc + curr.totalDescuento, 0);
    const totalMinutosPeriodo = tardanzas.reduce((acc, curr) => acc + curr.totalMinutosRetraso, 0);

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        Impacto Económico de Puntualidad
                    </h3>
                    <p className="text-sm text-neutral-500">Resumen global de tardanzas y descuentos calculados.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={mes.toString()} onValueChange={(v) => setMes(parseInt(v))}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            {MESES.map((m) => (
                                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={anio.toString()} onValueChange={(v) => setAnio(parseInt(v))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {[2024, 2025].map((y) => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-emerald-100 bg-emerald-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-800">Total Descuentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-900">{formatCurrency(totalDescuentosPeriodo)}</div>
                        <p className="text-xs text-emerald-600 mt-1">Ahorro operativo por impuntualidad</p>
                    </CardContent>
                </Card>
                <Card className="border-amber-100 bg-amber-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-800">Minutos Perdidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-900">{totalMinutosPeriodo} min</div>
                        <p className="text-xs text-amber-600 mt-1">Tiempo total de retraso acumulado</p>
                    </CardContent>
                </Card>
                <Card className="border-neutral-100 bg-neutral-50/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-800">Colaboradores Afectados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-neutral-900">{tardanzas.length}</div>
                        <p className="text-xs text-neutral-500 mt-1">Personal con al menos una tardanza</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-neutral-200">
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Ranking de Colaboradores con más Descuentos
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-neutral-50/50">
                                <TableHead className="pl-6">Colaborador</TableHead>
                                <TableHead className="text-center">Cant. Tardanzas</TableHead>
                                <TableHead className="text-center">Minutos Totales</TableHead>
                                <TableHead className="text-right pr-6">Monto Descuento</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tardanzas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-neutral-500 italic">
                                        No hay registros de tardanzas para este periodo.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tardanzas.map((item, index) => (
                                    <TableRow key={item.empleadoId} className="hover:bg-neutral-50 transition-colors">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-neutral-900">{item.colaborador}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                                {item.cantidadTardanzas} marcas
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-mono text-neutral-600">
                                            {item.totalMinutosRetraso} min
                                        </TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-red-600">
                                            {formatCurrency(item.totalDescuento)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
