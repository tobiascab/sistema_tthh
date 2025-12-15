"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Empleado } from "@/src/types/empleado";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

interface EmpleadosColumnsProps {
    onView: (empleado: Empleado) => void;
    onEdit: (empleado: Empleado) => void;
    onDelete: (empleado: Empleado) => void;
}

export const getEmpleadosColumns = ({
    onView,
    onEdit,
    onDelete,
}: EmpleadosColumnsProps): ColumnDef<Empleado>[] => [
        {
            accessorKey: "numeroSocio",
            header: "N° Socio",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("numeroSocio") || row.original.id}</div>
            ),
        },
        {
            accessorKey: "nombreCompleto",
            header: "Nombre Completo",
            cell: ({ row }) => {
                const empleado = row.original;
                return (
                    <div>
                        <div className="font-medium">{`${empleado.nombres} ${empleado.apellidos}`}</div>
                        <div className="text-sm text-neutral-500">{empleado.email}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "area",
            header: "Departamento",
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue("area") || "-"}</div>
            ),
        },
        {
            accessorKey: "cargo",
            header: "Cargo",
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue("cargo") || "-"}</div>
            ),
        },
        {
            accessorKey: "sucursal",
            header: "Sucursal",
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue("sucursal") || "-"}</div>
            ),
        },
        {
            accessorKey: "fechaIngreso",
            header: "Fecha Ingreso",
            cell: ({ row }) => {
                const fecha = row.getValue("fechaIngreso") as string;
                return <div className="text-sm">{new Date(fecha).toLocaleDateString()}</div>;
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
                            estado === "ACTIVO"
                                ? "default"
                                : estado === "INACTIVO"
                                    ? "secondary"
                                    : "destructive"
                        }
                        className={
                            estado === "ACTIVO"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : ""
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
                const empleado = row.original;

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
                            <DropdownMenuItem onClick={() => onView(empleado)} className="gap-2">
                                <Eye className="h-4 w-4" />
                                Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(empleado)} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(empleado)}
                                className="gap-2 text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
