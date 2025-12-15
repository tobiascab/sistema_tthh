"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, ChevronLeft, ChevronRight, FileText, Coins, Filter, User, Search, Building2, FileBarChart, Briefcase, UserCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { payrollApi } from "@/src/lib/api/payroll";
import { empleadosApi } from "@/src/lib/api/empleados";
import { MESES, ESTADOS_RECIBO } from "@/src/types/payroll";
import { toast } from "@/src/hooks/use-toast";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { cn } from "@/src/lib/utils";

export function RecibosView() {
    const { hasRole, user } = useAuth();
    const isAdminOrManager = hasRole("TTHH") || hasRole("GERENCIA");

    // Estado para Tabs
    const [activeTab, setActiveTab] = useState<string>("gestion");

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number | undefined>(undefined);
    const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // Query para empleados (solo admins)
    const { data: empleadosData } = useQuery({
        queryKey: ["empleados-list-full"],
        queryFn: () => empleadosApi.getAll({ size: 1000, estado: 'ACTIVO' }),
        enabled: isAdminOrManager,
    });

    const empleados = empleadosData?.content || [];

    // Identificar mi ID de empleado si soy admin
    const myEmpleadoId = useMemo(() => {
        if (!user || !empleados.length) return undefined;
        // Intenta hacer match por email o documento (username suele ser documento)
        return empleados.find(e =>
            (e.email && e.email === user.email) ||
            (e.numeroDocumento && e.numeroDocumento === user.username)
        )?.id;
    }, [user, empleados]);

    // Lógica para determinar qué empleadoId usar en la query
    // Si estoy en tab 'mis-recibos', fuerzo myEmpleadoId.
    // Si estoy en 'gestion', uso selectedEmpleadoId (que puede ser undefined para 'todos')
    const queryEmpleadoId = isAdminOrManager
        ? (activeTab === "mis-recibos" ? myEmpleadoId : selectedEmpleadoId)
        : undefined; // Si es colaborador normal, el backend lo deduce o usa el contexto

    // Extraer sucursales únicas
    const sucursales = useMemo(() => {
        const s = new Set(empleados.map(e => e.sucursal).filter(Boolean));
        return Array.from(s).sort();
    }, [empleados]);

    // Filtrar empleados por sucursal seleccionada
    const empleadosFiltrados = useMemo(() => {
        if (selectedSucursal === "all") return empleados;
        return empleados.filter(e => e.sucursal === selectedSucursal);
    }, [empleados, selectedSucursal]);

    // Query para recibos
    const { data: recibosPage, isLoading } = useQuery({
        queryKey: ["recibos", "list", selectedYear, queryEmpleadoId, activeTab],
        queryFn: () => payrollApi.getAll({
            anio: selectedYear,
            size: 100,
            empleadoId: queryEmpleadoId
        }),
        // Si estoy en modo admin 'gestion', siempre enabled (user puede ver todos).
        // Si estoy en modo 'mis-recibos' y no encontré mi ID (soy admin sin empleado linkeado), NO enabled para no confundir.
        enabled: !isAdminOrManager || (activeTab === "gestion") || (activeTab === "mis-recibos" && !!myEmpleadoId)
    });

    const { data: aguinaldo } = useQuery({
        queryKey: ["aguinaldo", "list", queryEmpleadoId],
        queryFn: () => payrollApi.getAguinaldo(), // El backend usa getCurrentUserId si no paso params? No, debo pasar params si quiero especificar.
        // Pero /aguinaldo NO acepta parametros en el controller actual, usa getCurrentUserId siempre.
        // A MENOS que modifiquemos el controller para aceptar empleadoId (que sería lo ideal).
        // Pero el backend actual /aguinaldo usa getCurrentUserId.
        // Si estoy en 'mis-recibos', getCurrentUserId debería funcionar si tengo token.
        // Si estoy en 'gestion', quiero ver el aguinaldo del seleccionado.
        // PERO el controller actual solo devuelve MISMO aguinaldo.
        // SOLUCION: En 'gestion', la UI mostrará calculo frontend. En 'mis-recibos', calculo backend (o frontend).
        // Deshabilitaré esta query en 'gestion' para no confundir.
        enabled: (!isAdminOrManager || activeTab === "mis-recibos")
    });

    const recibos = recibosPage?.content || [];

    const filteredRecibos = selectedMonth === "all"
        ? recibos
        : recibos.filter(r => r.mes === parseInt(selectedMonth));

    // Calcular totales para el reporte rápido
    const totalNominaMostrada = useMemo(() => {
        return filteredRecibos.reduce((acc, r) => acc + (r.salarioNeto || 0), 0);
    }, [filteredRecibos]);

    const handleDownloadPDF = async (id: number, periodo: string) => {
        try {
            setDownloadingId(id);
            const blob = await payrollApi.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recibo_salario_${periodo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Descarga exitosa",
                description: "El recibo se ha descargado correctamente.",
            });
        } catch (error) {
            console.error("Error downloading receipt:", error);
            toast({
                title: "Error",
                description: "No se pudo descargar el recibo.",
                variant: "destructive",
            });
        } finally {
            setDownloadingId(null);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getMesNombre = (mes: number) => {
        return MESES.find(m => m.value === mes)?.label || mes;
    };

    const selectedEmpleado = empleados.find(e => e.id === selectedEmpleadoId);

    // Render principal
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Recibos de Salario</h1>
                    <p className="text-neutral-600 mt-1">
                        {isAdminOrManager
                            ? "Gestión de nómina y recibos de colaboradores"
                            : "Consulta y descarga tus recibos de pago"}
                    </p>
                </div>
            </div>

            {isAdminOrManager && (
                <Tabs defaultValue="gestion" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="gestion">Gestión Global</TabsTrigger>
                        <TabsTrigger value="mis-recibos">Mis Recibos</TabsTrigger>
                    </TabsList>
                </Tabs>
            )}

            {/* Contenido según modo o rol */}
            <div className="flex flex-col gap-6">

                {/* Panel de Filtros */}
                {((isAdminOrManager && activeTab === "gestion") || !isAdminOrManager) && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">

                        {/* Filtro Sucursal (Solo Admin) */}
                        {isAdminOrManager && (
                            <div className="md:col-span-3">
                                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block ml-1">Sucursal</label>
                                <Select value={selectedSucursal} onValueChange={(val) => { setSelectedSucursal(val); setSelectedEmpleadoId(undefined); }}>
                                    <SelectTrigger className="w-full">
                                        <Building2 className="w-4 h-4 mr-2 text-neutral-500" />
                                        <SelectValue placeholder="Todas las sucursales" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las sucursales</SelectItem>
                                        {sucursales.map((sucursal) => (
                                            <SelectItem key={sucursal} value={sucursal}>
                                                {sucursal}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Filtro Colaborador (Solo Admin) */}
                        {isAdminOrManager && (
                            <div className="md:col-span-4">
                                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block ml-1">Colaborador</label>
                                <Select
                                    value={selectedEmpleadoId ? selectedEmpleadoId.toString() : "all"}
                                    onValueChange={(val) => setSelectedEmpleadoId(val === "all" ? undefined : parseInt(val))}
                                >
                                    <SelectTrigger className="w-full">
                                        <User className="w-4 h-4 mr-2 text-neutral-500" />
                                        <SelectValue placeholder="Todos los colaboradores" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="text-emerald-600 font-medium">
                                            Todos los Colaboradores
                                        </SelectItem>
                                        {empleadosFiltrados.map((empleado) => (
                                            <SelectItem key={empleado.id} value={empleado.id.toString()}>
                                                {empleado.nombres} {empleado.apellidos}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Filtros de Tiempo */}
                        <div className="md:col-span-5 flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block ml-1">Mes</label>
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-full bg-white">
                                        <Filter className="w-4 h-4 mr-2 text-neutral-500" />
                                        <SelectValue placeholder="Mes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todo el año</SelectItem>
                                        {MESES.map((mes) => (
                                            <SelectItem key={mes.value} value={mes.value.toString()}>
                                                {mes.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-[120px]">
                                <label className="text-xs font-semibold text-neutral-500 mb-1.5 block ml-1">Año</label>
                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200 h-10">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedYear(selectedYear - 1)}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="flex-1 text-center font-semibold text-sm">{selectedYear}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedYear(selectedYear + 1)}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel Resumen (VISUALIZACION PERSONAL o COLABORADOR SELECCIONADO) */}
                {/* Se muestra si: soy colaborador O (soy admin y tengo un empleado seleccionado) O (soy admin y estoy en mis-recibos) */}
                {((!isAdminOrManager) || (isAdminOrManager && selectedEmpleadoId && activeTab === 'gestion') || (isAdminOrManager && activeTab === 'mis-recibos' && myEmpleadoId)) && filteredRecibos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                                    Total Ingresos {selectedYear}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-blue-800">
                                        {formatCurrency(filteredRecibos.reduce((acc, r) => acc + r.salarioBruto + (r.bonificaciones || 0), 0))}
                                    </span>
                                </div>
                                <p className="text-xs text-blue-600/80 mt-1">
                                    Suma de salarios brutos y bonificaciones
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-emerald-50 border-emerald-200">
                            <CardContent className="p-4">
                                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                                    Aguinaldo {selectedYear < new Date().getFullYear() ? "Final" : "Proyectado"}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-emerald-800">
                                        {
                                            // Si tenemos datos del backend (/aguinaldo) para mis recibos, usarlos. 
                                            // Si no (gestion global), calcular en frontend.
                                            (activeTab === 'mis-recibos' && aguinaldo)
                                                ? formatCurrency(aguinaldo)
                                                : formatCurrency(filteredRecibos.reduce((acc, r) => acc + r.salarioBruto + (r.bonificaciones || 0), 0) / 12)
                                        }
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-600/80 mt-1">
                                    {selectedYear < new Date().getFullYear() ? "Definitivo" : "Proyección anual"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardContent className="p-4">
                                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                                    Promedio Mensual
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-purple-800">
                                        {formatCurrency(
                                            filteredRecibos.reduce((acc, r) => acc + r.salarioBruto + (r.bonificaciones || 0), 0) / (filteredRecibos.length || 1)
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Mensaje de ayuda si es admin en 'mis-recibos' sin empleado linkeado */}
                {isAdminOrManager && activeTab === 'mis-recibos' && !myEmpleadoId && !isLoading && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-6 text-center">
                            <UserCheck className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-amber-800">Usuario no asociado a Empleado</h3>
                            <p className="text-amber-700 max-w-md mx-auto mt-2">
                                Tu usuario administrador ({user?.username}) no coincide con ningún empleado registrado por documento o email.
                                Para ver 'Mis Recibos', asegúrate de que exista un empleado con tu mismo número de documento.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Tarjeta de Resumen Global para Admin (Solo Gestion, cuando ve todo) */}
                {isAdminOrManager && activeTab === 'gestion' && !selectedEmpleadoId && (
                    <Card className="bg-neutral-900 text-white border-neutral-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex gap-8">
                                <div>
                                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total Nómina Visible</p>
                                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalNominaMostrada)}</p>
                                </div>
                                <div className="hidden md:block h-10 w-px bg-neutral-700"></div>
                                <div className="hidden md:block">
                                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Recibos Listados</p>
                                    <p className="text-2xl font-bold">{filteredRecibos.length}</p>
                                </div>
                            </div>
                            <Button variant="outline" className="text-neutral-900 border-white hover:bg-neutral-100 hidden">
                                Exportar Reporte
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Recibos Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ... (Loop de recibos igual que antes) */}
                        {filteredRecibos.length > 0 ? (
                            filteredRecibos.map((recibo) => (
                                <div
                                    key={recibo.id}
                                    className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FileText className="w-24 h-24 text-green-600 transform rotate-12" />
                                    </div>
                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <FileText className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-neutral-800">
                                                    {getMesNombre(recibo.mes)}
                                                </h3>
                                                <p className="text-xs text-neutral-500">
                                                    {new Date(recibo.fechaPago).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className={ESTADOS_RECIBO[recibo.estado]?.color || "bg-gray-100"}>
                                            {ESTADOS_RECIBO[recibo.estado]?.label || recibo.estado}
                                        </Badge>
                                    </div>

                                    {isAdminOrManager && (
                                        <div className="text-xs text-neutral-500 mb-2 font-medium bg-neutral-50 p-1.5 rounded-lg inline-block">
                                            {recibo.empleadoNombre}
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-6 relative z-10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">Salario Bruto</span>
                                            <span className="font-medium">{formatCurrency(recibo.salarioBruto)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">Descuentos</span>
                                            <span className="font-medium text-red-600">
                                                - {formatCurrency(
                                                    (recibo.descuentosIps || 0) +
                                                    (recibo.descuentosJubilacion || 0) +
                                                    (recibo.otrosDescuentos || 0)
                                                )}
                                            </span>
                                        </div>
                                        {recibo.bonificaciones > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-600">Bonificaciones</span>
                                                <span className="font-medium text-green-600">
                                                    + {formatCurrency(recibo.bonificaciones)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-neutral-100">
                                            <div className="flex justify-between items-end">
                                                <span className="font-semibold text-neutral-800">Neto a Cobrar</span>
                                                <span className="font-bold text-green-700 text-lg">
                                                    {formatCurrency(recibo.salarioNeto)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 relative z-10"
                                        variant="outline"
                                        onClick={() => handleDownloadPDF(recibo.id, `${recibo.mes}_${recibo.anio}`)}
                                        disabled={downloadingId === recibo.id}
                                    >
                                        {downloadingId === recibo.id ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
                                        ) : (
                                            <Download className="w-4 h-4 mr-2" />
                                        )}
                                        {downloadingId === recibo.id ? "Descargando..." : "Descargar Recibo"}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-neutral-200 border-dashed">
                                <div className="p-4 bg-neutral-50 rounded-full mb-4">
                                    <FileBarChart className="w-8 h-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-medium text-neutral-900">No hay datos para mostrar</h3>
                                <p className="text-neutral-500 mt-1 max-w-md text-center">
                                    {selectedEmpleadoId
                                        ? `No se encontraron recibos para este colaborador.`
                                        : (isAdminOrManager && activeTab === 'mis-recibos' && !myEmpleadoId) ? "No se pudo identificar tu legajo personal."
                                            : "No se encontraron recibos con los filtros actuales."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
