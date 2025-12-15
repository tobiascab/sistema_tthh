"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { empleadosApi } from "@/src/lib/api/empleados";
import { Empleado, EmpleadoFormData } from "@/src/types/empleado";
import { DataTable } from "@/src/components/data-table/data-table";
import { getEmpleadosColumns } from "./empleados-columns";
import { EmpleadoDialog } from "./empleado-dialog";
import { Button } from "@/src/components/ui/button";
import { Plus, RefreshCw, Users, CheckCircle, XCircle, Building2, UserPlus } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import { motion } from "framer-motion";

// Premium Emerald Design Tokens
const THEME = {
    card: "bg-white border text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border-neutral-100",
    buttonPrimary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20",
    iconBg: "bg-emerald-50 text-emerald-600",
};

export function EmpleadosList() {
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();

    // Fetch empleados
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["empleados"],
        queryFn: () => empleadosApi.getAll({ page: 0, size: 100 }),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: EmpleadoFormData) => empleadosApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empleados"] });
            setIsDialogOpen(false);
            toast({
                title: "Empleado creado",
                description: "El empleado ha sido creado exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo crear el empleado.",
                variant: "destructive",
            });
        },
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: EmpleadoFormData }) =>
            empleadosApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empleados"] });
            setIsDialogOpen(false);
            setSelectedEmpleado(null);
            toast({
                title: "Empleado actualizado",
                description: "El empleado ha sido actualizado exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo actualizar el empleado.",
                variant: "destructive",
            });
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => empleadosApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empleados"] });
            toast({
                title: "Empleado eliminado",
                description: "El empleado ha sido eliminado exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo eliminar el empleado.",
                variant: "destructive",
            });
        },
    });

    const handleCreate = () => {
        setDialogMode("create");
        setSelectedEmpleado(null);
        setIsDialogOpen(true);
    };

    const handleView = (empleado: Empleado) => {
        router.push(`/tthh/empleados/${empleado.id}`);
    };

    const handleEdit = (empleado: Empleado) => {
        setDialogMode("edit");
        setSelectedEmpleado(empleado);
        setIsDialogOpen(true);
    };

    const handleDelete = (empleado: Empleado) => {
        if (confirm(`¿Está seguro de eliminar a ${empleado.nombres} ${empleado.apellidos}?`)) {
            deleteMutation.mutate(empleado.id);
        }
    };

    const handleSubmit = async (data: EmpleadoFormData) => {
        if (dialogMode === "create") {
            await createMutation.mutateAsync(data);
        } else if (selectedEmpleado) {
            await updateMutation.mutateAsync({ id: selectedEmpleado.id, data });
        }
    };

    const columns = getEmpleadosColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    <p className="text-neutral-500 font-medium animate-pulse">Cargando directorio...</p>
                </div>
            </div>
        );
    }

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
                            Directorio de Personal
                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200">
                                {data?.totalElements || 0} Total
                            </span>
                        </h2>
                        <p className="text-neutral-500 mt-2 text-lg">
                            Gestión centralizada de colaboradores y legajos.
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
                        <Button
                            onClick={handleCreate}
                            className={`${THEME.buttonPrimary} h-12 px-6 rounded-xl font-bold`}
                        >
                            <UserPlus className="h-5 w-5 mr-2" />
                            Nuevo Empleado
                        </Button>
                    </div>
                </div>

                {/* Stats Cards Premium */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Total Nómina</p>
                                <p className="text-3xl font-extrabold text-neutral-900 mt-2">{data?.totalElements || 0}</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 z-0" />
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Activos</p>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                                    {data?.content.filter((e) => e.estado === "ACTIVO").length || 0}
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
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Inactivos</p>
                                <p className="text-3xl font-extrabold text-neutral-400 mt-2">
                                    {data?.content.filter((e) => e.estado === "INACTIVO").length || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-neutral-100 text-neutral-500 rounded-xl">
                                <XCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl ${THEME.card} relative overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Áreas</p>
                                <p className="text-3xl font-extrabold text-blue-600 mt-2">
                                    {new Set(data?.content.map((e) => e.area || e.departamento).filter(Boolean)).size || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Building2 className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table Container Premium */}
                <div className={`rounded-3xl border border-neutral-100 bg-white p-2 shadow-xl shadow-neutral-100/50 overflow-hidden`}>
                    <DataTable
                        columns={columns}
                        data={data?.content || []}
                        searchKey="nombreCompleto"
                        searchPlaceholder="Buscar por nombre, documento o email..."
                    />
                </div>
            </motion.div>

            {/* Dialog */}
            <EmpleadoDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                empleado={dialogMode === "edit" ? selectedEmpleado || undefined : undefined}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </>
    );
}
