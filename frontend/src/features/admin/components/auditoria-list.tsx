"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Shield,
    Search,
    User,
    Activity
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { auditoriaApi } from "@/src/lib/api/auditoria";
import { Input } from "@/src/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";

export function AuditoriaList() {
    const [entidadFilter, setEntidadFilter] = useState("");

    const { data: auditoriaPage, isLoading } = useQuery({
        queryKey: ["auditoria", entidadFilter],
        queryFn: () => auditoriaApi.getAll({
            entidad: entidadFilter || undefined,
            size: 50,
            sort: "fecha,desc"
        }),
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-800">Logs de Auditoría</h2>
                    <p className="text-neutral-600">Registro de actividades del sistema</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <Input
                        placeholder="Filtrar por entidad..."
                        value={entidadFilter}
                        onChange={(e) => setEntidadFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Acción</TableHead>
                            <TableHead>Entidad</TableHead>
                            <TableHead>Detalles</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : auditoriaPage?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                    <p className="text-neutral-500">No hay registros de auditoría</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            auditoriaPage?.content.map((log) => (
                                <TableRow key={log.id} className="hover:bg-neutral-50">
                                    <TableCell className="whitespace-nowrap text-sm text-neutral-600">
                                        {format(new Date(log.fecha), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-neutral-400" />
                                            <span className="text-sm font-medium">{log.usuarioNombre || `ID: ${log.usuarioId}`}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {log.accion}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-neutral-400" />
                                            <span className="text-sm">{log.entidad}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-neutral-600 max-w-md truncate" title={log.detalles}>
                                        {log.detalles || "-"}
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
