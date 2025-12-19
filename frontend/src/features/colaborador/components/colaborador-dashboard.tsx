"use client";

import { useAuth } from "@/src/features/auth/context/auth-context";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    Calendar,
    FileText,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    User,
    Briefcase,
    FileCheck,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { payrollApi } from "@/src/lib/api/payroll";
import { ausenciasApi } from "@/src/lib/api/ausencias";
import { solicitudesApi } from "@/src/lib/api/solicitudes";
import { documentosApi } from "@/src/lib/api/documentos";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";

export function ColaboradorDashboard() {
    const { user } = useAuth();
    const { empleadoId } = useCurrentUser();
    const router = useRouter();

    // Show warning if user is not linked to an employee
    const isLinked = empleadoId && empleadoId > 0;

    // 1. Recibos de Sueldo
    const { data: recibosPage } = useQuery({
        queryKey: ["recibos", "dashboard", empleadoId],
        queryFn: () => payrollApi.getAll({ empleadoId, size: 1, sort: "anio,desc,mes,desc" }),
        enabled: !!empleadoId
    });
    const ultimoRecibo = recibosPage?.content?.[0];

    // 2. Saldo de Vacaciones (usando datos del empleado directamente)
    const { data: empleadoData } = useQuery({
        queryKey: ["empleado", empleadoId],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/empleados/${empleadoId}`);
            if (!response.ok) throw new Error('Failed to fetch employee');
            return response.json();
        },
        enabled: !!empleadoId
    });

    // 3. Solicitudes Recientes
    const { data: solicitudesPage } = useQuery({
        queryKey: ["solicitudes", "dashboard", empleadoId],
        queryFn: () => solicitudesApi.getAll({ empleadoId, size: 5, sort: "createdAt,desc" }),
        enabled: !!empleadoId
    });

    // 4. Documentos Recientes
    const { data: documentosPage } = useQuery({
        queryKey: ["documentos", "dashboard", empleadoId],
        queryFn: () => documentosApi.listarPorEmpleadoPaginado(empleadoId, { size: 5, sort: "createdAt,desc" }),
        enabled: !!empleadoId
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Datos del empleado para vacaciones
    const diasVacacionesDisponibles = empleadoData?.diasVacacionesDisponibles || 0;
    const diasVacacionesUsados = empleadoData?.diasVacacionesUsados || 0;
    const diasVacacionesAnuales = empleadoData?.diasVacacionesAnuales || 15;

    return (
        <div className="space-y-8">
            {/* Warning if not linked */}
            {!isLinked && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-amber-800">Usuario no vinculado</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Tu cuenta no está vinculada a un empleado en el sistema.
                            Contacta a Talento Humano para que te asignen tu registro de empleado.
                        </p>
                        <p className="text-xs text-amber-600 mt-2">
                            Usuario: {user?.username} | Email: {user?.email}
                        </p>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {empleadoData?.nombres?.charAt(0) || user?.nombre?.charAt(0) || 'C'}
                        {empleadoData?.apellidos?.charAt(0) || user?.apellido?.charAt(0) || 'R'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">
                            ¡Hola, {empleadoData?.nombres || user?.nombre || 'Colaborador'}!
                        </h1>
                        <p className="text-neutral-500 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {empleadoData?.cargo || 'Colaborador'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => router.push('/colaborador/perfil')} variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Último Pago */}
                <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Último Pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-900">
                            {ultimoRecibo ? formatCurrency(ultimoRecibo.salarioNeto) : "---"}
                        </div>
                        <p className="text-xs text-emerald-700 mt-1">
                            {ultimoRecibo
                                ? `${format(new Date(ultimoRecibo.fechaPago), "dd MMMM yyyy", { locale: es })}`
                                : "No hay registros"}
                        </p>
                        <Button
                            variant="link"
                            className="text-emerald-700 p-0 h-auto mt-4 text-xs font-semibold hover:text-emerald-900"
                            onClick={() => router.push('/colaborador/recibos')}
                        >
                            Ver todos los recibos <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Vacaciones */}
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Vacaciones Disponibles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">
                            {diasVacacionesDisponibles} días
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-blue-700 mb-1">
                                <span>Usados: {diasVacacionesUsados}</span>
                                <span>Total: {diasVacacionesAnuales}</span>
                            </div>
                            <Progress value={(diasVacacionesUsados / diasVacacionesAnuales) * 100} className="h-1.5 bg-blue-200" />
                        </div>
                        <Button
                            variant="link"
                            className="text-blue-700 p-0 h-auto mt-4 text-xs font-semibold hover:text-blue-900"
                            onClick={() => router.push('/colaborador/ausencias')}
                        >
                            Solicitar vacaciones <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Solicitudes Pendientes */}
                <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Solicitudes Pendientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-900">
                            {solicitudesPage?.content?.filter(s => s.estado === 'PENDIENTE').length || 0}
                        </div>
                        <p className="text-xs text-orange-700 mt-1">
                            Requieren atención o aprobación
                        </p>
                        <Button
                            variant="link"
                            className="text-orange-700 p-0 h-auto mt-4 text-xs font-semibold hover:text-orange-900"
                            onClick={() => router.push('/colaborador/solicitudes')}
                        >
                            Ver estado <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column: Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-800">Actividad Reciente</h2>
                    </div>

                    {/* Solicitudes List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Últimas Solicitudes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!solicitudesPage?.content || solicitudesPage.content.length === 0 ? (
                                    <p className="text-sm text-neutral-500 text-center py-4">No tienes solicitudes recientes</p>
                                ) : (
                                    solicitudesPage.content.map((solicitud) => (
                                        <div key={solicitud.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${solicitud.estado === 'APROBADO' ? 'bg-green-100 text-green-600' :
                                                    solicitud.estado === 'RECHAZADO' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {solicitud.estado === 'APROBADO' ? <CheckCircle className="w-4 h-4" /> :
                                                        solicitud.estado === 'RECHAZADO' ? <XCircle className="w-4 h-4" /> :
                                                            <Clock className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900">{solicitud.titulo || solicitud.tipo}</p>
                                                    <p className="text-xs text-neutral-500">
                                                        {solicitud.createdAt ? format(new Date(solicitud.createdAt), "dd MMM yyyy", { locale: es }) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className={
                                                solicitud.estado === 'APROBADO' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                                    solicitud.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                        'bg-red-100 text-red-800 hover:bg-red-100'
                                            }>
                                                {solicitud.estado}
                                            </Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documentos List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Documentos Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!documentosPage?.content || documentosPage.content.length === 0 ? (
                                    <p className="text-sm text-neutral-500 text-center py-4">No hay documentos recientes</p>
                                ) : (
                                    documentosPage.content.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-neutral-200">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900">{doc.nombre}</p>
                                                    <p className="text-xs text-neutral-500">{doc.categoria}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                Ver
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Quick Actions & Info */}
                <div className="space-y-6">
                    <Card className="bg-neutral-900 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                            <CardDescription className="text-neutral-400">Lo que más usas</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Button
                                className="w-full justify-start bg-neutral-800 hover:bg-neutral-700 text-white border-none"
                                onClick={() => router.push('/colaborador/ausencias')}
                            >
                                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                                Solicitar Vacaciones
                            </Button>
                            <Button
                                className="w-full justify-start bg-neutral-800 hover:bg-neutral-700 text-white border-none"
                                onClick={() => router.push('/colaborador/recibos')}
                            >
                                <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                                Descargar Recibo
                            </Button>
                            <Button
                                className="w-full justify-start bg-neutral-800 hover:bg-neutral-700 text-white border-none"
                                onClick={() => router.push('/colaborador/solicitudes')}
                            >
                                <FileCheck className="w-4 h-4 mr-2 text-orange-400" />
                                Nueva Solicitud
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Mi Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Área</span>
                                <span className="font-medium">{empleadoData?.area || 'Tecnología'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Sucursal</span>
                                <span className="font-medium">{empleadoData?.sucursal || 'Casa Central'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Ingreso</span>
                                <span className="font-medium">
                                    {empleadoData?.fechaIngreso
                                        ? format(new Date(empleadoData.fechaIngreso), "dd/MM/yyyy", { locale: es })
                                        : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Antigüedad</span>
                                <span className="font-medium">{empleadoData?.antiguedadAnios || 2} años</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
