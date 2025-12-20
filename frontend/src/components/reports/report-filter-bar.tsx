"use client";

import {
    Building2,
    Users,
    Filter,
    Calendar,
    FileSpreadsheet,
    FileDown,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { MESES } from "@/src/types/payroll";
import { SUCURSALES } from "@/src/constants/sucursales";

interface ReportFilterBarProps {
    onFilterChange: (filters: any) => void;
    onExportExcel: () => void;
    onExportPdf: () => void;
    sucursales?: string[];
    colaboradores?: { id: number; nombre: string }[];
    currentFilters: {
        sucursal: string;
        colaboradorId: string;
        mes: string;
        anio: number;
    };
    showAdminFilters?: boolean;
}

export function ReportFilterBar({
    onFilterChange,
    onExportExcel,
    onExportPdf,
    sucursales = ["Todas las sucursales", ...SUCURSALES],
    colaboradores = [],
    currentFilters,
    showAdminFilters = true
}: ReportFilterBarProps) {

    const handlePrevYear = () => {
        onFilterChange({ ...currentFilters, anio: currentFilters.anio - 1 });
    };

    const handleNextYear = () => {
        onFilterChange({ ...currentFilters, anio: currentFilters.anio + 1 });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
            <div className={cn(
                "grid grid-cols-1 gap-6",
                showAdminFilters ? "md:grid-cols-4" : "md:grid-cols-2 max-w-2xl"
            )}>
                {/* Sucursal */}
                {showAdminFilters && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Sucursal</label>
                        <Select
                            value={currentFilters.sucursal}
                            onValueChange={(val) => onFilterChange({ ...currentFilters, sucursal: val })}
                        >
                            <SelectTrigger className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-emerald-500">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-4 h-4 text-neutral-400" />
                                    <SelectValue placeholder="Seleccionar Sucursal" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {sucursales.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Colaborador */}
                {showAdminFilters && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Colaborador</label>
                        <Select
                            value={currentFilters.colaboradorId}
                            onValueChange={(val) => onFilterChange({ ...currentFilters, colaboradorId: val })}
                        >
                            <SelectTrigger className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-emerald-500">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-neutral-400" />
                                    <SelectValue placeholder="Todos los Colaboradores" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Colaboradores</SelectItem>
                                {colaboradores.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()}>{c.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Mes */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Mes</label>
                    <Select
                        value={currentFilters.mes}
                        onValueChange={(val) => onFilterChange({ ...currentFilters, mes: val })}
                    >
                        <SelectTrigger className="h-12 bg-neutral-50 border-neutral-100 rounded-xl focus:ring-emerald-500">
                            <div className="flex items-center gap-3">
                                <Filter className="w-4 h-4 text-neutral-400" />
                                <SelectValue placeholder="Todo el año" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todo el año</SelectItem>
                            {MESES.map(m => (
                                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Año */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Año</label>
                    <div className="flex items-center gap-2 h-12 bg-neutral-50 border border-neutral-100 rounded-xl px-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevYear}
                            className="h-8 w-8 text-neutral-500 hover:bg-white hover:text-emerald-600 rounded-lg"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center font-bold text-neutral-700">
                            {currentFilters.anio}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextYear}
                            className="h-8 w-8 text-neutral-500 hover:bg-white hover:text-emerald-600 rounded-lg"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={onExportExcel}
                    className="border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl font-bold"
                >
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" />
                    Exportar Excel
                </Button>
                <Button
                    variant="outline"
                    onClick={onExportPdf}
                    className="border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl font-bold"
                >
                    <FileDown className="w-4 h-4 mr-2 text-red-500" />
                    Exportar PDF
                </Button>
            </div>
        </div>
    );
}
