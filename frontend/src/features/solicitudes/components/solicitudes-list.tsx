"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitudesApi } from "@/src/lib/api/solicitudes";
import { ausenciasApi } from "@/src/lib/api/ausencias";
import { Solicitud, SolicitudFormData } from "@/src/types/solicitud";
import { DataTable } from "@/src/components/data-table/data-table";
import { getSolicitudesColumns } from "./solicitudes-columns";
import { SolicitudDialog } from "./solicitud-dialog";
import { SolicitudDetailDialog } from "./solicitud-detail-dialog";
import { Button } from "@/src/components/ui/button";
import { Plus, RefreshCw, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/src/features/auth/context/auth-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown, Calendar as CalendarIcon, X } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/src/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";

// Premium Emerald Design Tokens
const THEME = {
    card: "bg-white border text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border-neutral-100",
    buttonPrimary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20",
    iconBg: "bg-emerald-50 text-emerald-600",
};

interface SolicitudesListProps {
    empleadoId?: number;
}

export function SolicitudesList({ empleadoId }: SolicitudesListProps) {
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string | undefined>(undefined);

    // Estado aplicado (lo que realmente filtra la lista)
    const [appliedDateRange, setAppliedDateRange] = useState<DateRange | undefined>(undefined);
    // Estado de UI (lo que se ve en el selector mientras editas)
    const [uiDateRange, setUiDateRange] = useState<DateRange | undefined>(undefined);

    const [inputFrom, setInputFrom] = useState("");
    const [inputTo, setInputTo] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user, hasAnyRole } = useAuth();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const isAdminOrManager = hasAnyRole(["TTHH", "GERENCIA"]);

    // Sincronizar inputs cuando uiDateRange cambia (ej: selección en calendario)
    useEffect(() => {
        if (uiDateRange?.from) setInputFrom(format(uiDateRange.from, 'dd/MM/yy'));
        else if (!inputFrom) setInputFrom("");

        if (uiDateRange?.from && format(uiDateRange.from, 'dd/MM/yy') !== inputFrom) {
            setInputFrom(format(uiDateRange.from, 'dd/MM/yy'));
        }
        if (uiDateRange?.to && format(uiDateRange.to, 'dd/MM/yy') !== inputTo) {
            setInputTo(format(uiDateRange.to, 'dd/MM/yy'));
        }
    }, [uiDateRange]);

    // Función para aplicar el filtro (botón o enter)
    const handleApplyFilter = () => {
        setAppliedDateRange(uiDateRange);
        setShowCalendar(false);
        setIsPopoverOpen(false);
    };

    // Función para limpiar filtro
    const handleClearFilter = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setUiDateRange(undefined);
        setAppliedDateRange(undefined);
        setInputFrom("");
        setInputTo("");
    };

    // Resetear calendario cuando se cierra el popover
    useEffect(() => {
        if (!isPopoverOpen) {
            setShowCalendar(false);
        }
    }, [isPopoverOpen]);

    // Fetch solicitudes - Depende de appliedDateRange
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["solicitudes-unificadas", empleadoId, filterEstado, appliedDateRange],
        queryFn: async () => {
            const params = {
                page: 0,
                size: 50,
                empleadoId,
                estado: filterEstado,
                fechaInicio: appliedDateRange?.from ? format(appliedDateRange.from, 'yyyy-MM-dd') : undefined,
                fechaFin: appliedDateRange?.to ? format(appliedDateRange.to, 'yyyy-MM-dd') : undefined,
                sort: "createdAt,desc"
            };

            console.log("📡 Fetching solicitudes with params:", params);

            // Fetch solicitudes with error handling
            let solicitudesRes: any = { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, empty: true, first: true, last: true };
            try {
                solicitudesRes = await solicitudesApi.getAll(params);
                console.log("✅ Solicitudes fetched:", solicitudesRes.totalElements);
            } catch (error: any) {
                console.error("❌ Error fetching solicitudes:", error.response?.status, error.message);
            }

            // Fetch ausencias with error handling
            let ausenciasRes: any = { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, empty: true, first: true, last: true };
            try {
                ausenciasRes = await ausenciasApi.getAll({ ...params, sort: "createdAt,desc" });
                console.log("✅ Ausencias fetched:", ausenciasRes.totalElements);
            } catch (error: any) {
                console.error("❌ Error fetching ausencias:", error.response?.status, error.message);
            }

            // Map Ausencias to Solicitudes structure with client-side filtering
            // (Backend endpoint /empleado/{id} does not support filtering yet)
            const ausenciasMapped = ausenciasRes.content
                .filter((a: any) => {
                    // Filter by Estado
                    if (filterEstado && a.estado !== filterEstado) return false;

                    // Filter by Date Range
                    if (appliedDateRange?.from) {
                        const fecha = new Date(a.createdAt || a.fechaCreacion);
                        if (fecha < appliedDateRange.from) return false;
                    }
                    if (appliedDateRange?.to) {
                        const fecha = new Date(a.createdAt || a.fechaCreacion);
                        // Set end date to end of day
                        const endOfDay = new Date(appliedDateRange.to);
                        endOfDay.setHours(23, 59, 59, 999);
                        if (fecha > endOfDay) return false;
                    }
                    return true;
                })
                .map((a: any) => ({
                    id: a.id,
                    tipo: a.tipo,
                    titulo: `Ausencia: ${a.motivo || a.tipo}`,
                    descripcion: `Del ${a.fechaInicio} al ${a.fechaFin}. ${a.observaciones || ''}`,
                    estado: a.estado,
                    prioridad: 'MEDIA', // Default
                    createdAt: a.createdAt || a.fechaCreacion,
                    empleadoNombre: a.empleado ? `${a.empleado.nombres} ${a.empleado.apellidos}` : 'Usuario',
                    empleado: a.empleado,
                    isAusencia: true // marker for unified handling
                }));

            // Combine and sort
            const combined = [...solicitudesRes.content, ...ausenciasMapped].sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });

            return {
                content: combined as any[], // Cast to allow merged type
                totalElements: solicitudesRes.totalElements + ausenciasRes.totalElements,
                totalPages: 1,
                size: combined.length,
                number: 0,
                empty: combined.length === 0,
                first: true,
                last: true,
                numberOfElements: combined.length
            };
        },
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: SolicitudFormData) => solicitudesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-unificadas"] });
            setIsDialogOpen(false);
            toast({
                title: "Solicitud enviada",
                description: "Su solicitud ha sido enviada exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo enviar la solicitud.",
                variant: "destructive",
            });
        },
    });

    // Approve mutation (Unified)
    const approveMutation = useMutation({
        mutationFn: async ({ id, respuesta, isAusencia }: { id: number; respuesta?: string; isAusencia?: boolean }) => {
            if (isAusencia) {
                return ausenciasApi.approve(id);
            }
            return solicitudesApi.approve(id, respuesta);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-unificadas"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-admin"] });
            toast({
                title: "Solicitud aprobada",
                description: "La solicitud ha sido aprobada exitosamente.",
                variant: "success" as any,
            });
        },
    });

    // Reject mutation (Unified)
    const rejectMutation = useMutation({
        mutationFn: async ({ id, respuesta, isAusencia }: { id: number; respuesta?: string; isAusencia?: boolean }) => {
            if (isAusencia) {
                return ausenciasApi.reject(id, respuesta);
            }
            return solicitudesApi.reject(id, respuesta || "Rechazada por administrador");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-unificadas"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-admin"] });
            toast({
                title: "Solicitud rechazada",
                description: "La solicitud ha sido rechazada.",
                variant: "destructive",
            });
        },
    });

    // Delete mutation (Unified)
    const deleteMutation = useMutation({
        mutationFn: async ({ id, isAusencia }: { id: number; isAusencia?: boolean }) => {
            if (isAusencia) {
                return ausenciasApi.delete(id);
            }
            return solicitudesApi.cancel(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-unificadas"] });
            toast({
                title: "Solicitud eliminada",
                description: "La solicitud ha sido eliminada exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo eliminar la solicitud.",
                variant: "destructive",
            });
        },
    });

    const handleCreate = () => {
        setIsDialogOpen(true);
    };

    const handleView = (solicitud: Solicitud) => {
        setSelectedSolicitud(solicitud);
        setIsDetailDialogOpen(true);
    };

    const handleApprove = async (solicitud: Solicitud | any, comentario?: string) => {
        await approveMutation.mutateAsync({
            id: solicitud.id,
            respuesta: comentario,
            isAusencia: solicitud.isAusencia
        });
    };

    const handleReject = async (solicitud: Solicitud | any, comentario?: string) => {
        await rejectMutation.mutateAsync({
            id: solicitud.id,
            respuesta: comentario,
            isAusencia: solicitud.isAusencia
        });
    };

    const handleDelete = async (solicitud: Solicitud | any) => {
        if (window.confirm('¿Está seguro que desea eliminar esta solicitud?')) {
            await deleteMutation.mutateAsync({
                id: solicitud.id,
                isAusencia: solicitud.isAusencia
            });
        }
    };

    const handleSubmit = async (data: SolicitudFormData) => {
        // Agregar empleadoId al payload antes de enviar
        const payload = {
            ...data,
            empleadoId,
        };
        await createMutation.mutateAsync(payload as any);
    };

    const columns = getSolicitudesColumns({
        onView: handleView,
        onApprove: handleApprove,
        onReject: handleReject,
        onDelete: handleDelete,
        isAdminOrManager,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="text-neutral-500 font-medium animate-pulse">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    // Estadísticas globales (usamos el total de la respuesta de la API)
    const totalGlobal = data?.totalElements || 0;

    // Como la API filtra por estado, si estamos filtrando, el totalGlobal coincide con ese estado.
    // Si no estamos filtrando, el totalGlobal es el total de todo.
    // Para simplificar sin hacer 3 queries extra, usaremos los datos de la respuesta actual si están disponibles.
    const counts = {
        total: totalGlobal,
        pendientes: filterEstado === 'PENDIENTE' ? totalGlobal : data?.content.filter(s => s.estado === 'PENDIENTE').length || 0,
        aprobadas: filterEstado === 'APROBADA' ? totalGlobal : data?.content.filter(s => s.estado === 'APROBADA').length || 0,
        rechazadas: filterEstado === 'RECHAZADA' ? totalGlobal : data?.content.filter(s => s.estado === 'RECHAZADA').length || 0,
    };

    // Si hay más elementos en el servidor de los que estamos viendo en la página actual,
    // y no estamos filtrando específicamente por ese estado, añadimos un "+" para indicar que hay más.
    const showPlus = (estado?: string) => {
        if (!data) return false;
        if (filterEstado === estado) return false; // Si filtramos por ese estado, el totalGlobal es exacto.
        return data.totalElements > data.content.length;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Premium */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                    <div>
                        <h2 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                            {isAdminOrManager ? "Centro de Aprobaciones" : "Mis Solicitudes"}
                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
                                {counts.total} Total
                            </span>
                        </h2>
                        <p className="text-neutral-500 mt-2 text-lg">
                            {isAdminOrManager
                                ? "Gestione las solicitudes pendientes de su equipo."
                                : "Historial y estado de sus permisos y vacaciones."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={isLoading}
                            className="h-12 px-4 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 font-medium"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        {!isAdminOrManager && (
                            <Button
                                onClick={handleCreate}
                                className={`${THEME.buttonPrimary} h-12 px-6 rounded-xl font-bold`}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Nueva Solicitud
                            </Button>
                        )}
                        {isAdminOrManager && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-neutral-200">
                                        <Filter className="h-4 w-4 mr-2" />
                                        {filterEstado === 'PENDIENTE' ? 'Pendientes' :
                                            filterEstado === 'APROBADA' ? 'Aprobadas' :
                                                filterEstado === 'RECHAZADA' ? 'Rechazadas' :
                                                    'Todas las Solicitudes'}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => setFilterEstado(undefined)}>
                                        Todas
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterEstado('PENDIENTE')} className="text-amber-600 focus:text-amber-700">
                                        Solo Pendientes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterEstado('APROBADA')} className="text-emerald-600 focus:text-emerald-700">
                                        Solo Aprobadas
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterEstado('RECHAZADA')} className="text-red-600 focus:text-red-700">
                                        Solo Rechazadas
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Date Picker Filter */}
                        <div className="grid gap-2">
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[260px] justify-start text-left font-normal border-neutral-200 h-12",
                                            !appliedDateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {appliedDateRange?.from ? (
                                            appliedDateRange.to ? (
                                                <>
                                                    {format(appliedDateRange.from, "dd/MM/yyyy")} -{" "}
                                                    {format(appliedDateRange.to, "dd/MM/yyyy")}
                                                </>
                                            ) : (
                                                format(appliedDateRange.from, "dd/MM/yyyy")
                                            )
                                        ) : (
                                            <span>Filtrar por fecha</span>
                                        )}
                                        {appliedDateRange?.from && (
                                            <div
                                                className="ml-auto hover:bg-neutral-100 rounded-full p-1"
                                                onClick={handleClearFilter}
                                            >
                                                <X className="h-3 w-3 text-neutral-400" />
                                            </div>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <div className="p-3 border-b border-neutral-100 bg-neutral-50/50 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="grid gap-1.5 flex-1">
                                                <Label htmlFor="date-from" className="text-xs font-medium text-neutral-500">Desde</Label>
                                                <Input
                                                    id="date-from"
                                                    type="text"
                                                    placeholder="dd/mm/aa"
                                                    className="h-8 text-xs bg-white"
                                                    value={inputFrom}
                                                    onChange={(e) => {
                                                        let val = e.target.value;
                                                        if (val.length === 2 && inputFrom.length === 1) val += '/';
                                                        if (val.length === 5 && inputFrom.length === 4) val += '/';
                                                        setInputFrom(val);

                                                        let parsed: Date | undefined;
                                                        if (val.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
                                                            parsed = parse(val, val.length > 8 ? 'dd/MM/yyyy' : 'dd/MM/yy', new Date());
                                                        } else if (val.match(/^\d{6,8}$/)) {
                                                            parsed = parse(val, val.length === 8 ? 'ddMMyyyy' : 'ddMMyy', new Date());
                                                        }

                                                        if (parsed && isValid(parsed)) {
                                                            setUiDateRange(prev => ({ from: parsed, to: prev?.to }));
                                                        } else if (val === '') {
                                                            setUiDateRange(prev => ({ from: undefined, to: prev?.to }));
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleApplyFilter();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-1.5 flex-1">
                                                <Label htmlFor="date-to" className="text-xs font-medium text-neutral-500">Hasta</Label>
                                                <Input
                                                    id="date-to"
                                                    type="text"
                                                    placeholder="dd/mm/aa"
                                                    className="h-8 text-xs bg-white"
                                                    value={inputTo}
                                                    onChange={(e) => {
                                                        let val = e.target.value;
                                                        if (val.length === 2 && inputTo.length === 1) val += '/';
                                                        if (val.length === 5 && inputTo.length === 4) val += '/';
                                                        setInputTo(val);

                                                        let parsed: Date | undefined;
                                                        if (val.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)) {
                                                            parsed = parse(val, val.length > 8 ? 'dd/MM/yyyy' : 'dd/MM/yy', new Date());
                                                        } else if (val.match(/^\d{6,8}$/)) {
                                                            parsed = parse(val, val.length === 8 ? 'ddMMyyyy' : 'ddMMyy', new Date());
                                                        }

                                                        if (parsed && isValid(parsed)) {
                                                            setUiDateRange(prev => ({ from: prev?.from, to: parsed }));
                                                        } else if (val === '') {
                                                            setUiDateRange(prev => ({ from: prev?.from, to: undefined }));
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleApplyFilter();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-xs font-medium text-transparent">.</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={() => setShowCalendar(!showCalendar)}
                                                >
                                                    <CalendarIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {showCalendar && (
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={uiDateRange?.from}
                                            selected={uiDateRange}
                                            onSelect={setUiDateRange}
                                            numberOfMonths={2}
                                            locale={es}
                                        />
                                    )}
                                    <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => setIsPopoverOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs bg-neutral-900 text-white hover:bg-neutral-800"
                                            onClick={handleApplyFilter}
                                        >
                                            Aplicar Filtro
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Premium */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Total</p>
                                <p className="text-3xl font-extrabold text-neutral-900 mt-2">{counts.total}</p>
                            </div>
                            <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} border-amber-100 relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Pendientes</p>
                                <p className="text-3xl font-extrabold text-amber-600 mt-2">
                                    {counts.pendientes}{showPlus('PENDIENTE') && '+'}
                                </p>
                            </div>
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                        {/* Glow */}
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-100 rounded-full opacity-50 z-0" />
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Aprobadas</p>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                                    {counts.aprobadas}{showPlus('APROBADA') && '+'}
                                </p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Rechazadas</p>
                                <p className="text-3xl font-extrabold text-red-500 mt-2">
                                    {counts.rechazadas}{showPlus('RECHAZADA') && '+'}
                                </p>
                            </div>
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                                <XCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table Container Premium */}
                <div className={`rounded-3xl border border-neutral-100 bg-white p-2 shadow-xl shadow-neutral-100/50 overflow-hidden`}>
                    <DataTable
                        columns={columns}
                        data={data?.content || []}
                        searchKey={isAdminOrManager ? "empleadoNombre" : "titulo"}
                        searchPlaceholder={isAdminOrManager ? "Buscar por colaborador..." : "Buscar por asunto..."}
                    />
                </div>
            </motion.div>

            {/* Dialog para crear */}
            <SolicitudDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
            />

            {/* Dialog para ver detalle */}
            <SolicitudDetailDialog
                solicitud={selectedSolicitud}
                open={isDetailDialogOpen}
                onOpenChange={(open) => {
                    setIsDetailDialogOpen(open);
                    if (!open) setSelectedSolicitud(null);
                }}
                onApprove={handleApprove}
                onReject={handleReject}
                isAdminOrManager={isAdminOrManager}
            />
        </>
    );
}
