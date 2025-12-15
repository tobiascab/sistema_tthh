"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    Fingerprint,
    FileWarning
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { asistenciaApi } from "@/src/lib/api/asistencia";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { useToast } from "@/src/hooks/use-toast";
import { Asistencia } from "@/src/types/asistencia";

interface AsistenciaListProps {
    empleadoId: number;
    readonly?: boolean;
}

export function AsistenciaList({ empleadoId, readonly = false }: AsistenciaListProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [currentDate] = useState(new Date());

    // Fetch stats
    const { data: stats } = useQuery({
        queryKey: ["asistencia-stats", empleadoId, currentDate.getFullYear(), currentDate.getMonth() + 1],
        queryFn: () => asistenciaApi.getStats(empleadoId, currentDate.getFullYear(), currentDate.getMonth() + 1),
    });

    // Fetch history
    const { data: historial, isLoading } = useQuery({
        queryKey: ["asistencia-historial", empleadoId],
        queryFn: () => asistenciaApi.getByEmpleado(empleadoId, { page: 0, size: 30, sort: "fecha,desc" }),
    });

    // Marcar reloj mutation
    const marcarMutation = useMutation({
        mutationFn: () => asistenciaApi.marcar(empleadoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asistencia-historial", empleadoId] });
            queryClient.invalidateQueries({ queryKey: ["asistencia-stats", empleadoId] });
            toast({
                title: "Marcación exitosa",
                description: "Se ha registrado su marca correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo registrar la marca.",
                variant: "destructive",
            });
        }
    });

    const getTipoBadge = (tipo: string) => {
        switch (tipo) {
            case 'PRESENTE':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Presente</Badge>;
            case 'AUSENTE':
                return <Badge variant="destructive">Ausente</Badge>;
            case 'TARDANZA':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Tardanza</Badge>;
            case 'VACACIONES':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Vacaciones</Badge>;
            default:
                return <Badge variant="secondary">{tipo}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm md:col-span-2 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-neutral-800">Control de Asistencia</h3>
                        <p className="text-sm text-neutral-500">
                            {format(currentDate, "MMMM yyyy", { locale: es })}
                        </p>
                    </div>
                    {!readonly && (
                        <Button
                            onClick={() => marcarMutation.mutate()}
                            disabled={marcarMutation.isPending}
                            className="bg-neutral-900 hover:bg-neutral-800"
                        >
                            <Fingerprint className="w-4 h-4 mr-2" />
                            {marcarMutation.isPending ? "Marcando..." : "Marcar Reloj"}
                        </Button>
                    )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Llegadas Tardías</p>
                        <p className="text-2xl font-bold text-neutral-800">{stats?.tardanzas || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Ausencias</p>
                        <p className="text-2xl font-bold text-neutral-800">{stats?.ausencias || 0}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Entrada</TableHead>
                            <TableHead>Salida</TableHead>
                            <TableHead>Retraso</TableHead>
                            <TableHead>Observaciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {historial?.content?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                                    No hay registros de asistencia este mes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            historial?.content?.map((record: Asistencia) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(record.fecha), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell>{getTipoBadge(record.tipo)}</TableCell>
                                    <TableCell>
                                        {record.horaEntrada
                                            ? format(new Date(record.horaEntrada), "HH:mm")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {record.horaSalida
                                            ? format(new Date(record.horaSalida), "HH:mm")
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {record.minutosRetraso && record.minutosRetraso > 0 ? (
                                            <span className="text-red-600 font-medium">
                                                {record.minutosRetraso} min
                                            </span>
                                        ) : (
                                            <span className="text-green-600">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-neutral-500">
                                        {record.observaciones || "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
