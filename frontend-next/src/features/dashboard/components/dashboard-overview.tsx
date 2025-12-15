"use client";

import { Users, Calendar, FileText, TrendingUp } from "lucide-react";

const stats = [
    {
        title: "Total Empleados",
        value: "248",
        change: "+12%",
        icon: Users,
        color: "bg-primary",
    },
    {
        title: "Solicitudes Pendientes",
        value: "15",
        change: "-5%",
        icon: Calendar,
        color: "bg-accent",
    },
    {
        title: "Legajos Activos",
        value: "235",
        change: "+3%",
        icon: FileText,
        color: "bg-secondary",
    },
    {
        title: "Tasa de Asistencia",
        value: "94.5%",
        change: "+2.1%",
        icon: TrendingUp,
        color: "bg-primary",
    },
];

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-neutral-600">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                        Actividad Reciente
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-800">
                                        Nueva solicitud de vacaciones
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Hace 2 horas
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                        Próximos Vencimientos
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-neutral-800">
                                        Renovación de contrato
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        En 5 días
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
