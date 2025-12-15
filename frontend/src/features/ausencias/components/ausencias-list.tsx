"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    FileText,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

import { Ausencia } from "@/src/types/ausencia";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface AusenciasListProps {
    ausencias: Ausencia[];
    isLoading?: boolean;
    onCancelRequest?: (id: number) => void;
    showColaborador?: boolean;
}

type TipoAusencia = Ausencia['tipo'];

const tipoColors: Record<TipoAusencia, { bg: string; text: string; border: string }> = {
    VACACIONES: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    PERMISO: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    LICENCIA_MEDICA: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    MATERNIDAD: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    PATERNIDAD: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    DUELO: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
    OTRO: { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' }
};

const tipoLabels: Record<TipoAusencia, string> = {
    VACACIONES: 'Vacaciones',
    PERMISO: 'Permiso',
    LICENCIA_MEDICA: 'Licencia Médica',
    MATERNIDAD: 'Licencia Maternidad',
    PATERNIDAD: 'Licencia Paternidad',
    DUELO: 'Duelo',
    OTRO: 'Otro'
};

const estadoConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    PENDIENTE: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <Clock className="w-3 h-3" />,
        label: 'Pendiente'
    },
    APROBADO: {
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Aprobado'
    },
    RECHAZADO: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-3 h-3" />,
        label: 'Rechazado'
    },
    CANCELADO: {
        color: 'bg-neutral-100 text-neutral-600 border-neutral-200',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Cancelado'
    }
};

export function AusenciasList({
    ausencias,
    isLoading = false,
    onCancelRequest,
    showColaborador = false
}: AusenciasListProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-neutral-200 p-12">
                <div className="flex flex-col items-center justify-center text-neutral-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-3" />
                    <p className="text-sm">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    if (ausencias.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-neutral-200 p-12">
                <div className="flex flex-col items-center justify-center text-neutral-500">
                    <Calendar className="w-12 h-12 mb-3 text-neutral-300" />
                    <p className="font-medium">No hay solicitudes</p>
                    <p className="text-sm">Las solicitudes de ausencia aparecerán aquí</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="divide-y divide-neutral-100">
                {ausencias.map((ausencia, index) => {
                    const tipoStyle = tipoColors[ausencia.tipo];
                    const estadoStyle = estadoConfig[ausencia.estado] || estadoConfig.PENDIENTE;
                    const isExpanded = expandedId === ausencia.id;
                    const fechaInicio = parseISO(ausencia.fechaInicio);
                    const fechaFin = parseISO(ausencia.fechaFin);

                    return (
                        <motion.div
                            key={ausencia.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "transition-colors hover:bg-neutral-50/50",
                                isExpanded && "bg-neutral-50/30"
                            )}
                        >
                            {/* Main Row */}
                            <div
                                onClick={() => toggleExpand(ausencia.id)}
                                className="p-4 cursor-pointer flex items-center gap-4"
                            >
                                {/* Type Icon */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                    tipoStyle.bg,
                                    tipoStyle.border,
                                    "border"
                                )}>
                                    <Calendar className={cn("w-6 h-6", tipoStyle.text)} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "text-sm font-medium px-2 py-0.5 rounded-full",
                                            tipoStyle.bg,
                                            tipoStyle.text
                                        )}>
                                            {tipoLabels[ausencia.tipo]}
                                        </span>
                                        <Badge className={cn("gap-1", estadoStyle.color)}>
                                            {estadoStyle.icon}
                                            {estadoStyle.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                                        <span className="font-medium text-neutral-900">
                                            {format(fechaInicio, "d MMM", { locale: es })}
                                        </span>
                                        <span>→</span>
                                        <span className="font-medium text-neutral-900">
                                            {format(fechaFin, "d MMM yyyy", { locale: es })}
                                        </span>
                                        <span className="text-neutral-400">•</span>
                                        <span className="text-green-600 font-medium">
                                            {ausencia.dias} día{ausencia.dias !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    {showColaborador && ausencia.empleadoNombre && (
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {ausencia.empleadoNombre}
                                        </p>
                                    )}
                                </div>

                                {/* Expand/Collapse */}
                                <div className="flex-shrink-0">
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-2 border-t border-neutral-100 bg-neutral-50/50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Details */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                            Período
                                                        </p>
                                                        <p className="text-sm font-medium text-neutral-900">
                                                            {format(fechaInicio, "EEEE d 'de' MMMM", { locale: es })} -{" "}
                                                            {format(fechaFin, "EEEE d 'de' MMMM yyyy", { locale: es })}
                                                        </p>
                                                    </div>

                                                    {ausencia.observacion && (
                                                        <div>
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                                Observaciones
                                                            </p>
                                                            <p className="text-sm text-neutral-700">
                                                                {ausencia.observacion}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {ausencia.aprobadoPor && (
                                                        <div>
                                                            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                                                                Aprobado por
                                                            </p>
                                                            <p className="text-sm text-neutral-700">
                                                                {ausencia.aprobadoPor}
                                                                {ausencia.fechaAprobacion && (
                                                                    <span className="text-neutral-500">
                                                                        {" "}
                                                                        el {format(parseISO(ausencia.fechaAprobacion), "d/MM/yyyy", { locale: es })}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col justify-end items-end gap-2">
                                                    {ausencia.documentoAdjuntoUrl && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(ausencia.documentoAdjuntoUrl, '_blank');
                                                            }}
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            Ver Documento
                                                        </Button>
                                                    )}

                                                    {ausencia.estado === 'PENDIENTE' && onCancelRequest && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm('¿Estás seguro de cancelar esta solicitud?')) {
                                                                    onCancelRequest(ausencia.id);
                                                                }
                                                            }}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Cancelar Solicitud
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
