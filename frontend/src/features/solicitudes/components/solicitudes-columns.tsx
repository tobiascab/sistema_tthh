"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Solicitud } from "@/src/types/solicitud";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface SolicitudesColumnsProps {
    onView: (solicitud: Solicitud) => void;
    onApprove?: (solicitud: Solicitud, comentario?: string) => void;
    onReject?: (solicitud: Solicitud, comentario?: string) => void;
    isAdminOrManager: boolean;
}

export const getSolicitudesColumns = ({
    onView,
    onApprove,
    onReject,
    isAdminOrManager,
}: SolicitudesColumnsProps): ColumnDef<Solicitud>[] => {
    const columns: ColumnDef<Solicitud>[] = [
        {
            accessorKey: "tipo",
            header: "Tipo Solicitud",
            cell: ({ row }) => {
                const tipo = row.getValue("tipo") as string;
                return (
                    <Badge variant="outline" className="font-medium bg-neutral-50">
                        {tipo}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Fecha Solicitud",
            cell: ({ row }) => {
                const fecha = (row.original.createdAt || row.getValue("fechaSolicitud")) as string;
                return (
                    <div className="text-sm text-neutral-600">
                        {fecha ? new Date(fecha).toLocaleDateString('es-PY', { day: '2-digit', month: 'long', year: 'numeric' }) : "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "estado",
            header: "Estado",
            cell: ({ row }) => {
                const estado = row.getValue("estado") as string;
                return (
                    <Badge
                        variant={
                            estado === "APROBADA"
                                ? "default"
                                : estado === "PENDIENTE"
                                    ? "secondary"
                                    : "destructive"
                        }
                        className={
                            estado === "APROBADA"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : estado === "PENDIENTE"
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                    >
                        {estado}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const solicitud = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onView(solicitud)} className="gap-2">
                                <Eye className="h-4 w-4" />
                                Ver detalle
                            </DropdownMenuItem>
                            {isAdminOrManager && solicitud.estado === "PENDIENTE" && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onApprove?.(solicitud)}
                                        className="gap-2 text-green-600 focus:text-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        Aprobar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onReject?.(solicitud)}
                                        className="gap-2 text-red-600 focus:text-red-700"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Rechazar
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isAdminOrManager) {
        columns.unshift({
            accessorKey: "empleadoNombre",
            header: "Colaborador",
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">{row.getValue("empleadoNombre") || "Usuario"}</span>
                        <span className="text-xs text-neutral-500">Solicitante</span>
                    </div>
                );
            },
        });
    }

    return columns;
};
