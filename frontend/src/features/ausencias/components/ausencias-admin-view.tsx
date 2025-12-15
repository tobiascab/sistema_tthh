"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    CheckCircle,
    XCircle,
    Filter,
    User
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { ausenciasApi } from "@/src/lib/api/ausencias";
import { Ausencia } from "@/src/types/ausencia";
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

export function AusenciasAdminView() {
    const queryClient = useQueryClient();
    const [estadoFilter, setEstadoFilter] = useState<string>("PENDIENTE");
    const [selectedAusencia, setSelectedAusencia] = useState<Ausencia | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const { data: ausenciasPage, isLoading } = useQuery({
        queryKey: ["ausencias-admin", estadoFilter],
        queryFn: () => ausenciasApi.getAll({
            estado: estadoFilter === "ALL" ? undefined : estadoFilter,
            size: 50,
            sort: "fechaInicio,desc"
        }),
    });

    const approveMutation = useMutation({
        mutationFn: (id: number) => ausenciasApi.approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ausencias-admin"] });
            toast({
                title: "Ausencia aprobada",
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
        mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
            ausenciasApi.reject(id, motivo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ausencias-admin"] });
            setIsRejectDialogOpen(false);
            setRejectReason("");
            setSelectedAusencia(null);
            toast({
                title: "Ausencia rechazada",
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

    const handleApprove = (ausencia: Ausencia) => {
        if (confirm(`¿Estás seguro de aprobar la ausencia de ${ausencia.empleadoNombre}?`)) {
            approveMutation.mutate(ausencia.id);
        }
    };

    const handleRejectClick = (ausencia: Ausencia) => {
        setSelectedAusencia(ausencia);
        setIsRejectDialogOpen(true);
    };

    const handleRejectConfirm = () => {
        if (selectedAusencia && rejectReason) {
            rejectMutation.mutate({
                id: selectedAusencia.id,
                motivo: rejectReason
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
            default:
                return <Badge variant="secondary">{estado}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-800">Gestión de Ausencias</h2>
                    <p className="text-neutral-600">Administra las solicitudes de vacaciones y permisos</p>
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
                            <TableHead>Fechas</TableHead>
                            <TableHead>Días</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : ausenciasPage?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <p className="text-neutral-500">No se encontraron solicitudes</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            ausenciasPage?.content.map((ausencia) => (
                                <TableRow key={ausencia.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-neutral-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">{ausencia.empleadoNombre}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ausencia.tipo}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>Desde: {format(new Date(ausencia.fechaInicio), "dd/MM/yyyy", { locale: es })}</span>
                                            <span>Hasta: {format(new Date(ausencia.fechaFin), "dd/MM/yyyy", { locale: es })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ausencia.dias} días</TableCell>
                                    <TableCell>{getEstadoBadge(ausencia.estado)}</TableCell>
                                    <TableCell className="text-right">
                                        {ausencia.estado === "PENDIENTE" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                    onClick={() => handleApprove(ausencia)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    onClick={() => handleRejectClick(ausencia)}
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

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rechazar Solicitud</DialogTitle>
                        <DialogDescription>
                            Por favor, indique el motivo del rechazo para la solicitud de {selectedAusencia?.empleadoNombre}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Motivo del rechazo..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={!rejectReason.trim() || rejectMutation.isPending}
                        >
                            {rejectMutation.isPending ? "Rechazando..." : "Confirmar Rechazo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
