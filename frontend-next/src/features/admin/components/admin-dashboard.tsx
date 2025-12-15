"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Users,
    DollarSign,
    Clock,
    AlertTriangle,
    TrendingUp,
    FileText,
    Award,
    Calendar,
    UserPlus,
    ArrowUpRight,
    Briefcase,
    Building2
} from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    LineChart,
    Line
} from "recharts";
import { reportesApi, DashboardAdminDTO } from "@/src/lib/api/reportes";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth/context/auth-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

const COLORS = ['#16a34a', '#2563eb', '#dc2626', '#f59e0b', '#8b5cf6', '#06b6d4'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function AdminDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: dashboardData, isLoading, error } = useQuery<DashboardAdminDTO>({
        queryKey: ["admin-dashboard"],
        queryFn: () => reportesApi.getDashboardAdmin(),
        refetchInterval: 60000,
        retry: 2,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-64 text-center bg-red-50 rounded-xl border border-red-200 p-8"
            >
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-800">Error al cargar el dashboard</h3>
                <p className="text-neutral-600 mb-4">No se pudieron obtener los datos. Verifica que el backend esté activo.</p>
                <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                    Reintentar
                </Button>
            </motion.div>
        );
    }

    // Transform data for charts with fallbacks
    const departamentosData = dashboardData?.colaboradoresPorDepartamento
        ? Object.entries(dashboardData.colaboradoresPorDepartamento).map(([name, value]) => ({
            name: name || 'Sin asignar',
            value: value || 0
        }))
        : [];

    const solicitudesData = dashboardData?.solicitudesPorEstado
        ? Object.entries(dashboardData.solicitudesPorEstado).map(([name, value]) => ({
            name,
            value,
            fill: name === 'PENDIENTE' ? '#f59e0b' : name === 'APROBADO' ? '#16a34a' : '#dc2626'
        }))
        : [];

    // KPI data
    const kpis = [
        {
            title: "Colaboradores Activos",
            value: dashboardData?.colaboradoresActivos || 0,
            icon: Users,
            color: "green",
            bgGradient: "from-green-500 to-emerald-600",
            lightBg: "from-green-50 to-emerald-50",
            change: "+2 este mes"
        },
        {
            title: "Solicitudes Pendientes",
            value: dashboardData?.solicitudesPendientes || 0,
            icon: Clock,
            color: "orange",
            bgGradient: "from-orange-500 to-amber-600",
            lightBg: "from-orange-50 to-amber-50",
            change: "Requieren atención"
        },
        {
            title: "Certificaciones por Vencer",
            value: dashboardData?.certificacionesPorVencer || 0,
            icon: Award,
            color: "red",
            bgGradient: "from-red-500 to-rose-600",
            lightBg: "from-red-50 to-rose-50",
            change: "Próximos 30 días"
        },
        {
            title: "Colaboradores Inactivos",
            value: dashboardData?.colaboradoresInactivos || 0,
            icon: Users,
            color: "purple",
            bgGradient: "from-purple-500 to-violet-600",
            lightBg: "from-purple-50 to-violet-50",
            change: "Bajas/Licencias"
        },
        {
            title: "Nómina Estimada",
            value: `₲${(dashboardData?.nominaMensualEstimada || 0).toLocaleString('es-PY')}`,
            icon: DollarSign,
            color: "purple",
            bgGradient: "from-purple-500 to-violet-600",
            lightBg: "from-purple-50 to-violet-50",
            change: "Mensual"
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold text-neutral-800">Hola, {user?.nombre || "Bienvenido"}</h1>
                <p className="text-neutral-600 mt-1">
                    Panel TTHH & Analytics • Cooperativa Reducto
                </p>
            </motion.div>

            {/* Alertas */}
            {dashboardData?.alertas && dashboardData.alertas.length > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-sm"
                >
                    <div className="flex items-start">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
                        </motion.div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-800 mb-2">Alertas Importantes</h3>
                            <ul className="space-y-1">
                                {dashboardData.alertas.map((alerta, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-sm text-orange-700 flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                        {alerta.mensaje}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* KPI Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={kpi.title}
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`relative bg-gradient-to-br ${kpi.lightBg} rounded-2xl p-5 border border-neutral-200/50 shadow-sm hover:shadow-lg overflow-hidden`}
                    >
                        {/* Background Icon */}
                        <kpi.icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 bg-gradient-to-br ${kpi.bgGradient} rounded-xl shadow-lg`}>
                                    <kpi.icon className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-3xl font-bold text-neutral-800"
                                >
                                    {kpi.value}
                                </motion.p>
                                <p className="text-sm font-medium text-neutral-700 mt-1">{kpi.title}</p>
                                <p className="text-xs text-neutral-500 mt-1">{kpi.change}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colaboradores por Sucursal */}
                <Card className="shadow-sm border-neutral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-green-600" />
                            Colaboradores por Sucursal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {departamentosData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={departamentosData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {departamentosData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-neutral-400">
                                <div className="text-center">
                                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Sin datos de sucursales</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Solicitudes por Estado */}
                <Card className="shadow-sm border-neutral-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Solicitudes por Estado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {solicitudesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={solicitudesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {solicitudesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] text-neutral-400">
                                <div className="text-center">
                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Sin solicitudes registradas</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tendencia Nómina Row */}
            <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-neutral-200 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-white to-neutral-50 border-b border-neutral-100 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-neutral-800">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Tendencia de Nómina (Últimos 6 Meses)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {dashboardData?.nominaUltimos6Meses && dashboardData.nominaUltimos6Meses.length > 0 ? (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.nominaUltimos6Meses} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorNomina" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="mes"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12 }}
                                            tickFormatter={(value) => `₲${(value / 1000000).toFixed(0)}M`}
                                            width={80}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
                                            }}
                                            formatter={(value: number) => [`₲${value.toLocaleString('es-PY')}`, 'Nómina']}
                                            labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="valor"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorNomina)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-neutral-400">
                                <div className="text-center">
                                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Sin datos de nómina</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Solicitudes Pendientes Recientes */}
            <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-neutral-200 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-neutral-100 p-6">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2 text-neutral-800">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <span>Solicitudes Pendientes Recientes</span>
                            </CardTitle>
                            <p className="text-sm text-neutral-500 mt-1 ml-11">
                                Requieren atención inmediata
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push('/colaborador/solicitudes')} className="hover:bg-neutral-50">
                            Ver todas
                            <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {dashboardData?.ultimasSolicitudes && dashboardData.ultimasSolicitudes.length > 0 ? (
                            <Table>
                                <TableHeader className="bg-neutral-50/50">
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
                                    {dashboardData.ultimasSolicitudes.map((solicitud) => {
                                        const tipoColor =
                                            solicitud.tipo === 'VACACIONES' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' :
                                                solicitud.tipo === 'AUMENTO_SALARIO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                                                    solicitud.tipo === 'PERMISO' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                                                        solicitud.tipo === 'LICENCIA_MEDICA' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' :
                                                            'bg-slate-50 text-slate-700 border-slate-200';

                                        const prioridadColor =
                                            solicitud.prioridad === 'ALTA' || solicitud.prioridad === 'URGENTE' ? 'text-rose-600 bg-rose-50 px-2 py-1 rounded font-semibold' :
                                                solicitud.prioridad === 'MEDIA' ? 'text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium' : 'text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium';

                                        const iniciales = solicitud.empleadoNombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                                        return (
                                            <TableRow key={solicitud.id} className="hover:bg-neutral-50/50 transition-colors group">
                                                <TableCell className="pl-6 py-4 font-medium text-neutral-800">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
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
                                                        {solicitud.tipo.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-neutral-600 font-medium max-w-[200px] truncate" title={solicitud.titulo}>
                                                    {solicitud.titulo}
                                                </TableCell>
                                                <TableCell className="text-neutral-500">
                                                    {new Date(solicitud.fechaCreacion).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
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
                                                        className="h-8 w-8 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                                        onClick={() => router.push(`/colaborador/solicitudes?id=${solicitud.id}`)}
                                                    >
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                <div className="bg-neutral-50 p-4 rounded-full mb-3">
                                    <Clock className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="font-medium">No hay solicitudes pendientes</p>
                                <p className="text-sm mt-1 text-neutral-400">¡Todo está al día!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <Card className="shadow-sm border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { icon: UserPlus, label: "Nuevo Colaborador", path: "/tthh/empleados", color: "bg-green-600 hover:bg-green-500" },
                                { icon: FileText, label: "Ver Solicitudes", path: "/colaborador/solicitudes", color: "bg-blue-600 hover:bg-blue-500" },
                                { icon: Calendar, label: "Ausencias", path: "/colaborador/ausencias", color: "bg-purple-600 hover:bg-purple-500" },
                                { icon: TrendingUp, label: "Reportes", path: "/reportes", color: "bg-orange-600 hover:bg-orange-500" }
                            ].map((action) => (
                                <motion.button
                                    key={action.label}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => router.push(action.path)}
                                    className={`${action.color} p-4 rounded-xl transition-all duration-200 text-left group`}
                                >
                                    <action.icon className="w-6 h-6 mb-2" />
                                    <p className="font-medium text-sm">{action.label}</p>
                                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3" />
                                </motion.button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
