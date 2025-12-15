"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Calendar,
    Plus,
    List,
    LayoutGrid,
    Loader2,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Briefcase
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { AusenciasCalendar } from "@/src/features/ausencias/components/ausencias-calendar";
import { AusenciasList } from "@/src/features/ausencias/components/ausencias-list";
import { NuevaAusenciaDialog } from "@/src/features/ausencias/components/nueva-ausencia-dialog";
import { RoleGuard } from "@/src/features/auth/components/role-guard";
import { ausenciasApi } from "@/src/lib/api/ausencias";
import { toast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";
import { useCurrentUser } from "@/src/hooks/use-current-user";

// Premium Emerald Design Tokens
const THEME = {
    card: "bg-white border text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border-neutral-100",
    iconBg: "bg-emerald-50 text-emerald-600",
    activeTab: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
    inactiveTab: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
};

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    isLoading?: boolean;
}

function StatCard({ label, value, icon, color, trend, isLoading }: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden group`}
        >
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider">{label}</p>
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mt-1" />
                    ) : (
                        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight">{value}</p>
                    )}
                    {trend && (
                        <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${color.includes("emerald") || color.includes("green") ? "bg-emerald-50 text-emerald-600" : "bg-neutral-50 text-neutral-600"}`}>
                    {icon}
                </div>
            </div>

            {/* Decoración de fondo Premium */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-neutral-50/80 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className={`absolute bottom-0 left-0 w-full h-1 ${color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </motion.div>
    );
}

export default function AusenciasPage() {
    const queryClient = useQueryClient();
    const { empleadoId, numeroSocio, nombreCompleto } = useCurrentUser();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch ausencias del colaborador usando el ID interno para la API
    const { data: ausenciasPage, isLoading: isLoadingAusencias } = useQuery({
        queryKey: ["ausencias", "colaborador", empleadoId],
        queryFn: () => ausenciasApi.getAll({
            empleadoId,
            size: 50,
            sort: "fechaInicio,desc"
        }),
    });

    // Fetch saldo de vacaciones
    const { data: saldoVacaciones, isLoading: isLoadingSaldo } = useQuery({
        queryKey: ["saldo-vacaciones", empleadoId],
        queryFn: () => ausenciasApi.getSaldoVacaciones(empleadoId),
    });

    // Mutation para cancelar solicitud
    const cancelMutation = useMutation({
        mutationFn: (id: number) => ausenciasApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ausencias"] });
            toast({
                title: "Solicitud cancelada",
                description: "Tu solicitud ha sido cancelada correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo cancelar la solicitud.",
                variant: "destructive",
            });
        },
    });

    // Calcular estadísticas desde los datos reales
    const ausencias = ausenciasPage?.content || [];
    const pendientes = ausencias.filter(a => a.estado === 'PENDIENTE').length;
    const permisosEsteMes = ausencias.filter(a => {
        if (a.tipo !== 'PERMISO') return false;
        const fechaInicio = new Date(a.fechaInicio);
        const now = new Date();
        return fechaInicio.getMonth() === now.getMonth() &&
            fechaInicio.getFullYear() === now.getFullYear();
    }).length;

    // Transform ausencias to calendar events
    const calendarEvents = ausencias.map(a => ({
        id: a.id,
        date: a.fechaInicio,
        type: a.tipo === 'VACACIONES' ? 'VACACIONES' :
            a.tipo === 'PERMISO' ? 'PERMISO' :
                a.tipo === 'LICENCIA_MEDICA' ? 'ENFERMEDAD' :
                    'CAPACITACION',
        title: a.tipo === 'VACACIONES' ? 'Vacaciones' :
            a.tipo === 'PERMISO' ? 'Permiso' :
                a.tipo === 'LICENCIA_MEDICA' ? 'Licencia Médica' :
                    a.observaciones || a.tipo,
        empleadoNombre: a.empleadoNombre
    }) as any); // Cast temporal para evitar error de tipos estrictos en mapeo rápido

    return (
        <RoleGuard allowedRoles={["TTHH", "GERENCIA", "COLABORADOR"]}>
            <div className="space-y-8 pb-10">
                {/* Header with User Info context */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                                Gestión de Ausencias
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium border border-emerald-100">
                                <User className="w-4 h-4" />
                                <span>{nombreCompleto}</span>
                            </div>
                            <div className="text-neutral-400 font-medium">
                                Socio Nº <span className="text-neutral-900">{numeroSocio}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="bg-white border border-neutral-200 rounded-xl p-1 flex gap-1 shadow-sm">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={cn(
                                    "p-2.5 rounded-lg transition-all duration-200",
                                    viewMode === 'calendar'
                                        ? THEME.activeTab
                                        : THEME.inactiveTab
                                )}
                                title="Vista Calendario"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    "p-2.5 rounded-lg transition-all duration-200",
                                    viewMode === 'list'
                                        ? THEME.activeTab
                                        : THEME.inactiveTab
                                )}
                                title="Vista Lista"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl px-6 h-12 shadow-lg shadow-neutral-900/20 font-semibold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nueva Solicitud
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        label="Vacaciones Disponibles"
                        value={isLoadingSaldo ? "..." : `${saldoVacaciones?.diasDisponibles || 0} días`}
                        icon={<Calendar className="w-6 h-6 text-emerald-600" />}
                        color="text-emerald-600"
                        trend={saldoVacaciones?.periodoActual}
                        isLoading={isLoadingSaldo}
                    />
                    <StatCard
                        label="Vacaciones Tomadas"
                        value={isLoadingSaldo ? "..." : `${saldoVacaciones?.diasTomados || 0} días`}
                        icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
                        color="text-blue-600"
                        isLoading={isLoadingSaldo}
                    />
                    <StatCard
                        label="Permisos (Mes)"
                        value={isLoadingAusencias ? "..." : permisosEsteMes}
                        icon={<Clock className="w-6 h-6 text-purple-600" />}
                        color="text-purple-600"
                        isLoading={isLoadingAusencias}
                    />
                    <StatCard
                        label="Pendientes"
                        value={isLoadingAusencias ? "..." : pendientes}
                        icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
                        color="text-orange-600"
                        isLoading={isLoadingAusencias}
                    />
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-3xl border border-neutral-100 bg-white p-6 shadow-xl shadow-neutral-100/50 min-h-[500px]`}
                >
                    {viewMode === 'calendar' ? (
                        <AusenciasCalendar events={calendarEvents} />
                    ) : (
                        <AusenciasList
                            ausencias={ausencias}
                            isLoading={isLoadingAusencias}
                            onCancelRequest={(id) => cancelMutation.mutate(id)}
                        />
                    )}
                </motion.div>
            </div>

            {/* Dialog para nueva ausencia */}
            <NuevaAusenciaDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                empleadoId={empleadoId}
                saldoVacaciones={saldoVacaciones?.diasDisponibles || 0}
            />
        </RoleGuard>
    );
}
