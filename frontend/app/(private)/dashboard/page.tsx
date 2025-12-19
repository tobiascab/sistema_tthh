"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import apiClient from "@/src/lib/api/client";
import { ausenciasApi } from "@/src/lib/api/ausencias";
import { motion } from "framer-motion";
import {
    PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend
} from 'recharts';

import {
    Calendar,
    Clock,
    TrendingUp,
    Users,
    AlertCircle,
    CheckCircle2,
    Briefcase,

    ArrowRight,
    Activity,
    DollarSign,
    Gift,
    Sun,
    Coffee,
    Building2,
    Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/src/components/ui/use-toast";
import { BirthdayManagerDialog } from "@/src/components/dashboard/birthday-manager-dialog";
import { NotificationBanner } from "@/src/components/notifications/notification-banner";

// ==========================================
// ESTILO PREMIUM EMERALD
// ==========================================
const EMERALD_THEME = {
    card: "bg-white border border-emerald-100 shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300",
    gradientHeader: "bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-8 shadow-xl shadow-emerald-900/10",
    accentIcon: "bg-emerald-50 text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100 font-medium",
    buttonPrimary: "bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all",
    chartColors: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'],
    statusColors: {
        'APROBADA': '#10b981', // Emerald 500
        'APROBADO': '#10b981', // Emerald 500
        'PENDIENTE': '#f59e0b', // Amber 500
        'RECHAZADA': '#ef4444', // Red 500
        'RECHAZADO': '#ef4444', // Red 500
    }
};

const getMesNombre = (mes: number) => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[mes - 1] || "";
};

// Utils para Charts
const getAbbreviation = (name: string) => {
    const map: Record<string, string> = {
        "CASA MATRIZ": "CC",
        "CENTRO MEDICO REDUCTO": "C.M.R",
        "SUCURSAL 5": "Suc. 5",
        "SUCURSAL CIUDAD DEL ESTE": "CDE",
        "SUCURSAL HERNANDARIAS": "Hern.",
        "SUCURSAL SAN LORENZO CENTRO": "SL",
        "SUCURSAL VILLARRICA": "VCA",
        "CENTRO DE DISTRIBUCION": "CD",
    };

    const upperName = name.toUpperCase();
    if (map[upperName]) return map[upperName];

    return name.replace(/SUCURSAL/i, "Suc.").substring(0, 18);
};

// Utils para Charts
const transformMapToData = (mapData: Record<string, number> | undefined) => {
    if (!mapData) return [];
    return Object.entries(mapData).map(([name, value]) => ({ name, value }));
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-emerald-100 shadow-lg rounded-xl text-xs">
                <p className="font-bold text-emerald-800">{data.fullName || label || data.name}</p>
                <p className="text-emerald-600">
                    {payload[0].value} {data.name === 'monto' ? 'Gs' : ''}
                </p>
            </div>
        );
    }
    return null;
};

// 1. Dashboard Administrativo (TTHH/Gerencia)
// 1. Dashboard Administrativo (TTHH/Gerencia)
function AdminDashboard() {
    const { user } = useCurrentUser();
    const router = useRouter();
    const { toast } = useToast();
    const [syncing, setSyncing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [birthdayManagerOpen, setBirthdayManagerOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: dashboardData, isLoading, refetch } = useQuery({
        queryKey: ["dashboard-admin"],
        queryFn: async () => {
            const response = await apiClient.get("/reportes/dashboard-admin");
            return response.data;
        },
    });

    const handleSync = async () => {
        try {
            setSyncing(true);
            const response = await apiClient.post('/usuarios/sync');
            const data = response.data;

            toast({
                title: "Sincronización completada",
                description: `Creados: ${data.creados}, Existentes: ${data.existentes}, Errores: ${data.errores}`,
                variant: "default",
                className: "bg-emerald-50 border-emerald-200 text-emerald-800"
            });

            // Recargar datos
            refetch();
        } catch (error) {
            console.error("Error syncing users:", error);
            toast({
                title: "Error de sincronización",
                description: "No se pudieron sincronizar los usuarios.",
                variant: "destructive",
            });
        } finally {
            setSyncing(false);
        }
    };

    // Prevent hydration mismatch
    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    // Datos procesados para gráficos
    const deptoData = dashboardData?.colaboradoresPorDepartamento
        ? Object.entries(dashboardData.colaboradoresPorDepartamento).map(([name, value]) => ({
            name: getAbbreviation(name || 'Sin asignar'),
            fullName: name || 'Sin asignar',
            value: value || 0
        }))
        : [];
    const estadoData = transformMapToData(dashboardData?.solicitudesPorEstado);
    const nominaData = dashboardData?.nominaUltimos6Meses?.map((t: any) => ({
        mes: `${t.mes} ${t.anio}`,
        monto: t.valor
    })) || [];

    const metricsConfig = [
        {
            title: "Colaboradores Activos",
            value: dashboardData?.colaboradoresActivos || 0,
            subtitle: "Gestión de talento",
            icon: Users,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
        },
        {
            title: "Solicitudes Pendientes",
            value: dashboardData?.solicitudesPendientes || 0,
            subtitle: "Requieren acción",
            icon: Clock,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            alert: (dashboardData?.solicitudesPendientes || 0) > 0
        },
        {
            title: "Nómina Estimada",
            value: "Gs " + (dashboardData?.nominaMensualEstimada?.toLocaleString('es-PY') || "0"),
            subtitle: "Mensual actual",
            icon: DollarSign,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Cumpleaños del Mes",
            value: dashboardData?.cumpleaniosMesActual || 0,
            subtitle: "Celebraciones",
            icon: Gift,
            iconBg: "bg-rose-100",
            iconColor: "text-rose-600",
        },

    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header Emerald */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={EMERALD_THEME.gradientHeader}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Activity className="w-5 h-5 text-emerald-50" />
                            </span>
                            <span className="text-emerald-100 font-medium text-sm tracking-wide uppercase">
                                Vista Gerencial
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">
                            Panel TTHH & Analytics
                        </h1>
                        <p className="text-emerald-100 opacity-90">
                            Visión estratégica y control operativo.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            className="bg-white/90 text-emerald-800 hover:bg-white hover:shadow-lg transition-all"
                            onClick={handleSync}
                            disabled={syncing}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Sincronizando...' : 'Sincronizar Usuarios'}
                        </Button>
                        <Link href="/reportes">
                            <Button variant="secondary" className="bg-white text-emerald-800 hover:bg-emerald-50">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Ver Reportes
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Push Notification Banner for Admins */}
            <NotificationBanner className="mb-4" />

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metricsConfig.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`${EMERALD_THEME.card} border-l-4 border-l-emerald-500`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                                        <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                                    </div>
                                    {metric.alert && (
                                        <div className="flex relative h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-neutral-800 tracking-tight truncate">
                                        {metric.value}
                                    </h3>
                                    <p className="font-medium text-neutral-500 text-sm">
                                        {metric.title}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Analytics Section - Updated to 3 columns to include Birthdays */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. Distribución por Departamento */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Card className={EMERALD_THEME.card}>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                                Distribución por Sucursal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {deptoData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deptoData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {deptoData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={EMERALD_THEME.chartColors[index % EMERALD_THEME.chartColors.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-400">
                                    Sin datos disponibles
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 2. Próximos Cumpleaños */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className={EMERALD_THEME.card}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-pink-500" />
                                Próximos Cumpleaños
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
                                onClick={() => setBirthdayManagerOpen(true)}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="h-[300px] overflow-y-auto mt-2">
                            {dashboardData?.proximosCumpleanios && dashboardData.proximosCumpleanios.length > 0 ? (
                                <div className="space-y-4">
                                    {dashboardData.proximosCumpleanios.map((cumple: any) => (
                                        <div key={cumple.empleadoId} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-xl transition-colors border border-transparent hover:border-neutral-100">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-neutral-100">
                                                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white text-xs font-bold">
                                                    {cumple.nombreCompleto.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-neutral-800 truncate">{cumple.nombreCompleto}</p>
                                                <p className="text-xs text-neutral-500">{cumple.dia} de {getMesNombre(cumple.mes)}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0 h-5 rounded-full ${cumple.diasRestantes === 0 ? 'bg-rose-500 text-white border-none animate-pulse' : 'bg-pink-50 text-pink-600 border-pink-100'
                                                    }`}>
                                                    {cumple.diasRestantes === 0 ? '¡HOY!' : `en ${cumple.diasRestantes}d`}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-400 py-10">
                                    <Gift className="w-8 h-8 opacity-10 mb-2" />
                                    <p className="text-sm italic">No hay cumpleaños próximos</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 2. Estado de Solicitudes (Pie/Donut) */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className={EMERALD_THEME.card}>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-600" />
                                Estado de Solicitudes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {estadoData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={estadoData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {estadoData.map((entry: any, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={EMERALD_THEME.statusColors[entry.name as keyof typeof EMERALD_THEME.statusColors] || '#94a3b8'}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-400">
                                    Sin solicitudes registradas
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 3. Evolución de Nómina (Area) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
                    <Card className={EMERALD_THEME.card}>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                Tendencia de Nómina (Últimos 6 meses)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {nominaData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={nominaData}>
                                        <defs>
                                            <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="monto"
                                            stroke="#059669"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorMonto)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-neutral-400">
                                    Datos históricos insuficientes
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Solicitudes Pendientes Recientes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className={EMERALD_THEME.card + " overflow-hidden"}>
                    <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-emerald-100 p-6">
                        <div>
                            <CardTitle className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                </div>
                                <span>Solicitudes Pendientes Recientes</span>
                            </CardTitle>
                            <p className="text-sm text-neutral-500 mt-1 ml-11">
                                Requieren atención inmediata
                            </p>
                        </div>
                        <Link href="/colaborador/solicitudes">
                            <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300">
                                Ver todas
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {dashboardData?.ultimasSolicitudes && dashboardData.ultimasSolicitudes.length > 0 ? (
                            <Table>
                                <TableHeader className="bg-emerald-50/50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-semibold">Colaborador</TableHead>
                                        <TableHead className="font-semibold">Tipo</TableHead>
                                        <TableHead className="font-semibold">Título</TableHead>
                                        <TableHead className="font-semibold">Fecha</TableHead>
                                        <TableHead className="font-semibold">Prioridad</TableHead>
                                        <TableHead className="text-right pr-6 font-semibold">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dashboardData.ultimasSolicitudes.slice(0, 10).map((solicitud: any) => {
                                        const tipoColor =
                                            solicitud.tipo === 'VACACIONES' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                solicitud.tipo === 'AUMENTO_SALARIO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    solicitud.tipo === 'PERMISO' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        solicitud.tipo === 'LICENCIA_MEDICA' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                            'bg-slate-50 text-slate-700 border-slate-200';

                                        const prioridadColor =
                                            solicitud.prioridad === 'ALTA' || solicitud.prioridad === 'URGENTE' ? 'text-rose-600 bg-rose-50 px-2 py-1 rounded font-semibold' :
                                                solicitud.prioridad === 'MEDIA' ? 'text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium' : 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium';

                                        const iniciales = solicitud.empleadoNombre?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??';

                                        return (
                                            <TableRow key={solicitud.id} className="hover:bg-emerald-50/30 transition-colors">
                                                <TableCell className="pl-6 py-4 font-medium text-neutral-800">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                                                                {iniciales}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-semibold text-neutral-800">{solicitud.empleadoNombre}</p>
                                                            <p className="text-xs text-neutral-500">Colaborador</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${tipoColor} font-medium border px-2.5 py-0.5 rounded-full whitespace-nowrap`}>
                                                        {solicitud.tipo?.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-neutral-600 font-medium max-w-[200px] truncate" title={solicitud.titulo}>
                                                    {solicitud.titulo}
                                                </TableCell>
                                                <TableCell className="text-neutral-500">
                                                    {solicitud.fechaCreacion ? new Date(solicitud.fechaCreacion).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`${prioridadColor} text-xs`}>
                                                        {solicitud.prioridad}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                                                        onClick={() => router.push(`/colaborador/solicitudes?id=${solicitud.id}`)}
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                <div className="bg-emerald-50 p-4 rounded-full mb-3">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                                </div>
                                <p className="font-medium text-neutral-600">No hay solicitudes pendientes</p>
                                <p className="text-sm mt-1 text-neutral-400">¡Todo está al día!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            <BirthdayManagerDialog
                open={birthdayManagerOpen}
                onOpenChange={setBirthdayManagerOpen}
                onConfigChange={() => refetch()}
            />
        </div>
    );
}

// 2. Dashboard del Colaborador (Emerald Style)
function ColaboradorDashboard() {
    const { numeroSocio, empleadoId } = useCurrentUser();
    const { user } = useAuth();

    const { data: ausencias, isLoading: loadingAusencias } = useQuery({
        queryKey: ["mis-ausencias", empleadoId],
        queryFn: () => ausenciasApi.getAll({ empleadoId }),
        enabled: !!empleadoId,
    });

    const { data: saldoVacaciones, isLoading: loadingSaldo } = useQuery({
        queryKey: ["saldo-vacaciones", empleadoId],
        queryFn: () => ausenciasApi.getSaldoVacaciones(empleadoId),
        enabled: !!empleadoId,
    });



    const solicitudesPendientes = ausencias?.content?.filter(a => a.estado === "PENDIENTE")?.length || 0;

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: "Buenos días", icon: Sun };
        if (hour < 18) return { text: "Buenas tardes", icon: Coffee };
        return { text: "Buenas noches", icon: Coffee };
    };

    const greet = greeting();
    const GreetIcon = greet.icon;

    return (
        <div className="space-y-8 pb-10">
            {/* Banner Emerald Colaborador */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${EMERALD_THEME.gradientHeader} relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <GreetIcon className="w-7 h-7 text-emerald-50" />
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {greet.text}, {user?.nombre || user?.username}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Badge className="bg-emerald-800/50 text-emerald-50 border-none font-medium px-3 backdrop-blur-md">
                                Socio Nº {numeroSocio}
                            </Badge>
                            <span className="text-emerald-200/50">•</span>
                            <span className="text-emerald-100 font-medium">
                                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: es })}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[180px] text-center shadow-lg">
                        <p className="text-emerald-200 font-bold text-xs tracking-wider uppercase mb-1">Días Disponibles</p>
                        <p className="text-4xl font-black text-white">
                            {loadingSaldo ? "..." : saldoVacaciones?.diasDisponibles || 0}
                        </p>
                        <p className="text-emerald-100 text-xs mt-1">Vacaciones</p>
                    </div>
                </div>
            </motion.div>

            {/* Accesos Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Solicitar Permiso", sub: "Gestionar ausencias", icon: Calendar, href: "/colaborador/ausencias", color: "text-emerald-600", bg: "bg-emerald-50" },

                    { title: "Mi Perfil", sub: "Datos personales", icon: Briefcase, href: "/colaborador/perfil", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (i * 0.1) }}
                    >
                        <Link href={item.href}>
                            <Card className={EMERALD_THEME.card + " cursor-pointer group hover:border-emerald-300"}>
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-neutral-800">{item.title}</h3>
                                        <p className="text-neutral-500 text-sm">{item.sub}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-600 transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Mis Solicitudes List */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Card className={EMERALD_THEME.card + " h-full"}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    Mis Solicitudes
                                </CardTitle>
                                {solicitudesPendientes > 0 && (
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                                        {solicitudesPendientes} pendiente{solicitudesPendientes !== 1 ? 's' : ''}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 mt-2">
                                {loadingAusencias ? (
                                    <div className="space-y-2">
                                        {[1, 2].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                                    </div>
                                ) : ausencias?.content && ausencias.content.length > 0 ? (
                                    <>
                                        {ausencias.content.slice(0, 3).map(ausencia => (
                                            <div key={ausencia.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-10 rounded-full ${ausencia.estado === 'PENDIENTE' ? 'bg-amber-500' :
                                                        ausencia.estado === 'APROBADA' ? 'bg-emerald-500' : 'bg-red-500'
                                                        }`} />
                                                    <div>
                                                        <p className="font-bold text-sm text-neutral-800">{ausencia.tipo}</p>
                                                        <p className="text-xs text-neutral-500">
                                                            {format(new Date(ausencia.fechaInicio), "dd MMM", { locale: es })} • {ausencia.diasSolicitados} días
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={`text-xs font-bold ${ausencia.estado === 'PENDIENTE' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                                    ausencia.estado === 'APROBADA' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                                                        'text-red-600 bg-red-50 border-red-200'
                                                    }`}>
                                                    {ausencia.estado}
                                                </Badge>
                                            </div>
                                        ))}
                                        <Link href="/colaborador/ausencias" className="block pt-2">
                                            <Button variant="ghost" size="sm" className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                Ver historial completo <ArrowRight className="w-3 h-3 ml-2" />
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-neutral-400 text-sm">
                                        No tienes solicitudes recientes
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>


            </div>
        </div>
    );
}

// Componente Principal
export default function DashboardPage() {
    const { user } = useAuth();
    const isAdmin = user?.roles?.some(role =>
        ["TTHH", "GERENCIA", "AUDITORIA"].includes(role)
    );

    return (
        <div>
            {isAdmin ? <AdminDashboard /> : <ColaboradorDashboard />}
        </div>
    );
}
