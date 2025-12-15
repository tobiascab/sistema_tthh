"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    FileText,
    DollarSign,
    TrendingUp,
    Award,
    Star,
    Briefcase
} from "lucide-react";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import { es } from "date-fns/locale";

interface EmpleadoStatsCardProps {
    empleado: {
        fechaIngreso?: string;
        diasVacacionesDisponibles?: number;
        diasVacacionesUsados?: number;
        diasVacacionesAnuales?: number;
        salario?: number;
        estado?: string;
        cargo?: string;
        area?: string;
    };
    documentosCount?: number;
    solicitudesPendientes?: number;
    certificacionesCount?: number;
}

export function EmpleadoStatsCard({
    empleado,
    documentosCount = 0,
    solicitudesPendientes = 0,
    certificacionesCount = 0
}: EmpleadoStatsCardProps) {
    // Calculate seniority
    const calcularAntiguedad = () => {
        if (!empleado.fechaIngreso) return { years: 0, months: 0 };
        const fechaIngreso = new Date(empleado.fechaIngreso);
        const now = new Date();
        const years = differenceInYears(now, fechaIngreso);
        const months = differenceInMonths(now, fechaIngreso) % 12;
        return { years, months };
    };

    const antiguedad = calcularAntiguedad();

    const stats = [
        {
            label: "Antigüedad",
            value: `${antiguedad.years}a ${antiguedad.months}m`,
            icon: Briefcase,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            label: "Vacaciones Disponibles",
            value: `${empleado.diasVacacionesDisponibles || 0} días`,
            icon: Calendar,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            label: "Documentos",
            value: documentosCount.toString(),
            icon: FileText,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
        },
        {
            label: "Solicitudes Pendientes",
            value: solicitudesPendientes.toString(),
            icon: Clock,
            color: solicitudesPendientes > 0 ? "bg-orange-500" : "bg-neutral-400",
            bgColor: solicitudesPendientes > 0 ? "bg-orange-50" : "bg-neutral-50",
            textColor: solicitudesPendientes > 0 ? "text-orange-700" : "text-neutral-600"
        },
        {
            label: "Certificaciones",
            value: certificacionesCount.toString(),
            icon: Award,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-700"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.bgColor} rounded-xl p-4 border border-neutral-100 hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${stat.color} rounded-lg`}>
                            <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500">{stat.label}</p>
                            <p className={`text-lg font-bold ${stat.textColor}`}>{stat.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
