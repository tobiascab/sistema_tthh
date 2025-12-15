"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitudesApi } from "@/src/lib/api/solicitudes";
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
import { ChevronDown } from "lucide-react";

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
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const isAdminOrManager = user?.roles?.some(r => ["TTHH", "GERENCIA"].includes(r)) || false;

    // Fetch solicitudes
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["solicitudes", empleadoId, filterEstado],
        queryFn: () => solicitudesApi.getAll({
            page: 0,
            size: 50,
            empleadoId,
            estado: filterEstado,
            sort: "createdAt,desc"
        }),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: SolicitudFormData) => solicitudesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes"] });
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

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: ({ id, respuesta }: { id: number; respuesta?: string }) => solicitudesApi.approve(id, respuesta),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-admin"] });
            toast({
                title: "Solicitud aprobada",
                description: "La solicitud ha sido aprobada exitosamente.",
                variant: "success" as any,
            });
        },
    });

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: ({ id, respuesta }: { id: number; respuesta?: string }) => solicitudesApi.reject(id, respuesta || "Rechazada por administrador"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-admin"] });
            toast({
                title: "Solicitud rechazada",
                description: "La solicitud ha sido rechazada.",
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

    const handleApprove = async (solicitud: Solicitud, comentario?: string) => {
        await approveMutation.mutateAsync({ id: solicitud.id, respuesta: comentario });
    };

    const handleReject = async (solicitud: Solicitud, comentario?: string) => {
        await rejectMutation.mutateAsync({ id: solicitud.id, respuesta: comentario });
    };

    const handleSubmit = async (data: SolicitudFormData) => {
        await createMutation.mutateAsync(data);
    };

    const columns = getSolicitudesColumns({
        onView: handleView,
        onApprove: handleApprove,
        onReject: handleReject,
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

    // Calcular estadísticas en tiempo de render (si no tenemos endpoints de stats)
    const total = data?.totalElements || 0;
    const pendientes = data?.content.filter(s => s.estado === 'PENDIENTE').length || 0;
    const aprobadas = data?.content.filter(s => s.estado === 'APROBADA').length || 0;

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
                                {total} Total
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
                            className="h-12 px-4 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 font-medium"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
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
                    </div>
                </div>

                {/* Stats Cards Premium */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Total</p>
                                <p className="text-3xl font-extrabold text-neutral-900 mt-2">{total}</p>
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
                                <p className="text-3xl font-extrabold text-amber-600 mt-2">{pendientes}</p>
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
                                <p className="text-3xl font-extrabold text-emerald-600 mt-2">{aprobadas}</p>
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
                                <p className="text-3xl font-extrabold text-red-500 mt-2">{data?.content.filter((s) => s.estado === "RECHAZADA").length || 0}</p>
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
                        searchKey="empleadoNombre"
                        searchPlaceholder="Buscar solicitud..."
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
