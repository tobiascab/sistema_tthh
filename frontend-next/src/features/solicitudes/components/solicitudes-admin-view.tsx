"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle,
    XCircle,
    Filter,
    User,
    FileQuestion,
    MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { solicitudesApi } from "@/src/lib/api/solicitudes";
import { Solicitud } from "@/src/types/solicitud";
import { Button } from "@/src/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "@/src/hooks/use-toast";

export function SolicitudesAdminView() {
    const queryClient = useQueryClient();
    const [estadoFilter, setEstadoFilter] = useState<string>("PENDIENTE");
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
    const [actionReason, setActionReason] = useState("");
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

    const { data: solicitudesPage, isLoading } = useQuery({
        queryKey: ["solicitudes-admin", estadoFilter],
        queryFn: () => solicitudesApi.getAll({
            estado: estadoFilter === "ALL" ? undefined : estadoFilter,
            size: 50,
            sort: "fechaSolicitud,desc"
        }),
    });

    const approveMutation = useMutation({
        mutationFn: ({ id, comentario }: { id: number; comentario?: string }) =>
            solicitudesApi.approve(id, comentario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-admin"] });
            closeDialog();
            toast({
                title: "Solicitud aprobada",
                description: "La solicitud ha sido aprobada correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo aprobar la solicitud.",
                variant: "destructive",
            });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, comentario }: { id: number; comentario: string }) =>
            solicitudesApi.reject(id, comentario),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes-admin"] });
            closeDialog();
            toast({
                title: "Solicitud rechazada",
                description: "La solicitud ha sido rechazada correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo rechazar la solicitud.",
                variant: "destructive",
            });
        },
    });

    const openActionDialog = (solicitud: Solicitud, type: 'APPROVE' | 'REJECT') => {
        setSelectedSolicitud(solicitud);
        setActionType(type);
        setActionReason("");
        setIsActionDialogOpen(true);
    };

    const closeDialog = () => {
        setIsActionDialogOpen(false);
        setSelectedSolicitud(null);
        setActionType(null);
        setActionReason("");
    };

    const handleConfirmAction = () => {
        if (!selectedSolicitud || !actionType) return;

        if (actionType === 'APPROVE') {
            approveMutation.mutate({
                id: selectedSolicitud.id,
                comentario: actionReason
            });
        } else {
            rejectMutation.mutate({
                id: selectedSolicitud.id,
                comentario: actionReason
            });
        }
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case "APROBADO":
                return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
            case "RECHAZADO":
                return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
            case "PENDIENTE":
                return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case "CANCELADO":
                return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
            default:
                return <Badge variant="secondary">{estado}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-800">Gestión de Solicitudes</h2>
                    <p className="text-neutral-600">Administra las solicitudes generales de los colaboradores</p>
                </div>
                <div className="flex gap-2">
                    <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos los estados</SelectItem>
                            <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                            <SelectItem value="APROBADO">Aprobados</SelectItem>
                            <SelectItem value="RECHAZADO">Rechazados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Colaborador</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : solicitudesPage?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <FileQuestion className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                    <p className="text-neutral-500">No se encontraron solicitudes</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            solicitudesPage?.content.map((solicitud) => (
                                <TableRow key={solicitud.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-neutral-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">{solicitud.empleadoNombre}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{solicitud.tipo}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(solicitud.fechaSolicitud), "dd/MM/yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate" title={solicitud.descripcion}>
                                        {solicitud.descripcion}
                                    </TableCell>
                                    <TableCell>{getEstadoBadge(solicitud.estado)}</TableCell>
                                    <TableCell className="text-right">
                                        {solicitud.estado === "PENDIENTE" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                    onClick={() => openActionDialog(solicitud, 'APPROVE')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    onClick={() => openActionDialog(solicitud, 'REJECT')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Rechazar
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'APPROVE' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'APPROVE'
                                ? `¿Estás seguro de aprobar la solicitud de ${selectedSolicitud?.empleadoNombre}? Puedes añadir un comentario opcional.`
                                : `Por favor, indica el motivo del rechazo para la solicitud de ${selectedSolicitud?.empleadoNombre}.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2 mb-2 text-sm text-neutral-600">
                            <MessageSquare className="w-4 h-4" />
                            <span>Comentario / Motivo:</span>
                        </div>
                        <Textarea
                            placeholder={actionType === 'APPROVE' ? "Comentario opcional..." : "Motivo del rechazo (requerido)..."}
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeDialog}>
                            Cancelar
                        </Button>
                        <Button
                            variant={actionType === 'APPROVE' ? "default" : "destructive"}
                            className={actionType === 'APPROVE' ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={handleConfirmAction}
                            disabled={
                                (actionType === 'REJECT' && !actionReason.trim()) ||
                                approveMutation.isPending ||
                                rejectMutation.isPending
                            }
                        >
                            {approveMutation.isPending || rejectMutation.isPending
                                ? "Procesando..."
                                : actionType === 'APPROVE' ? "Confirmar Aprobación" : "Confirmar Rechazo"
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
