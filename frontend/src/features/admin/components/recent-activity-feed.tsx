"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    UserPlus,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileCheck,
    UserCheck,
    Award
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ActivityItem {
    id: string;
    type: 'SOLICITUD_CREADA' | 'SOLICITUD_APROBADA' | 'SOLICITUD_RECHAZADA' |
    'EMPLEADO_REGISTRADO' | 'DOCUMENTO_SUBIDO' | 'RECIBO_GENERADO' |
    'CERTIFICACION_VENCIDA' | 'VACACIONES_APROBADAS';
    title: string;
    description?: string;
    timestamp: string;
    user?: string;
    entityId?: number;
}

// Simulated activity data - in production, this would come from an API
const mockActivities: ActivityItem[] = [
    {
        id: "1",
        type: "SOLICITUD_CREADA",
        title: "Nueva solicitud de vacaciones",
        description: "Carlos Rodríguez - 10 días",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: "Carlos Rodríguez"
    },
    {
        id: "2",
        type: "SOLICITUD_APROBADA",
        title: "Solicitud aprobada",
        description: "Permiso médico - Ana García",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        user: "Admin TTHH"
    },
    {
        id: "3",
        type: "DOCUMENTO_SUBIDO",
        title: "Documento cargado",
        description: "Certificado de antecedentes - María López",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: "Admin TTHH"
    },
    {
        id: "4",
        type: "EMPLEADO_REGISTRADO",
        title: "Nuevo colaborador registrado",
        description: "Juan Pérez - Área Tecnología",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        user: "Admin TTHH"
    },
    {
        id: "5",
        type: "RECIBO_GENERADO",
        title: "Recibos de salario generados",
        description: "Diciembre 2024 - 45 empleados",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        user: "Sistema"
    }
];

const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'SOLICITUD_CREADA':
            return <Clock className="w-4 h-4" />;
        case 'SOLICITUD_APROBADA':
            return <CheckCircle className="w-4 h-4" />;
        case 'SOLICITUD_RECHAZADA':
            return <XCircle className="w-4 h-4" />;
        case 'EMPLEADO_REGISTRADO':
            return <UserPlus className="w-4 h-4" />;
        case 'DOCUMENTO_SUBIDO':
            return <FileCheck className="w-4 h-4" />;
        case 'RECIBO_GENERADO':
            return <DollarSign className="w-4 h-4" />;
        case 'CERTIFICACION_VENCIDA':
            return <AlertCircle className="w-4 h-4" />;
        case 'VACACIONES_APROBADAS':
            return <Calendar className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

const getActivityColors = (type: ActivityItem['type']) => {
    switch (type) {
        case 'SOLICITUD_APROBADA':
        case 'VACACIONES_APROBADAS':
            return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' };
        case 'SOLICITUD_RECHAZADA':
        case 'CERTIFICACION_VENCIDA':
            return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
        case 'SOLICITUD_CREADA':
            return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
        case 'EMPLEADO_REGISTRADO':
            return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
        case 'DOCUMENTO_SUBIDO':
            return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' };
        case 'RECIBO_GENERADO':
            return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
        default:
            return { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-200' };
    }
};

export function RecentActivityFeed() {
    // In production, this would fetch from an API
    const activities = mockActivities;

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
                <h3 className="font-semibold text-neutral-800">Actividad Reciente</h3>
                <p className="text-sm text-neutral-500">Últimas acciones del sistema</p>
            </div>

            <div className="divide-y divide-neutral-100">
                <AnimatePresence>
                    {activities.map((activity, index) => {
                        const colors = getActivityColors(activity.type);

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 hover:bg-neutral-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-neutral-800 text-sm">
                                            {activity.title}
                                        </p>
                                        {activity.description && (
                                            <p className="text-sm text-neutral-500 truncate">
                                                {activity.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-neutral-400">
                                                {formatDistanceToNow(new Date(activity.timestamp), {
                                                    addSuffix: true,
                                                    locale: es
                                                })}
                                            </span>
                                            {activity.user && (
                                                <>
                                                    <span className="text-neutral-300">•</span>
                                                    <span className="text-xs text-neutral-500">
                                                        {activity.user}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="p-3 border-t border-neutral-100 bg-neutral-50">
                <button className="w-full text-sm text-neutral-600 hover:text-neutral-800 font-medium transition-colors">
                    Ver toda la actividad
                </button>
            </div>
        </div>
    );
}
