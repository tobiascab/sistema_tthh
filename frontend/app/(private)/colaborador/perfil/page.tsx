"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { User, FileText, Clock, DollarSign, Calendar, ArrowLeft } from "lucide-react";

import { empleadosApi } from "@/src/lib/api/empleados";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { EmpleadoForm } from "@/src/features/empleados/components/empleado-form";
import { DocumentosList } from "@/src/features/documentos/components/documentos-list";
import { SolicitudesList } from "@/src/features/solicitudes/components/solicitudes-list";
import { RecibosList } from "@/src/features/payroll/components/recibos-list";
import { EmpleadoFormData } from "@/src/types/empleado";
import { useToast } from "@/src/hooks/use-toast";
import { AvatarUpload } from "@/src/features/empleados/components/avatar-upload";
import { useCurrentUser } from "@/src/hooks/use-current-user";

export default function MiPerfilPage() {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("info");
    const { empleadoId, numeroSocio } = useCurrentUser();

    // Fetch employee data
    const { data: empleado, isLoading, error } = useQuery({
        queryKey: ["empleado", empleadoId],
        queryFn: () => empleadosApi.getById(empleadoId),
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (data: EmpleadoFormData) => empleadosApi.update(empleadoId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["empleado", empleadoId] });
            toast({
                title: "Perfil actualizado",
                description: "Tus datos han sido guardados exitosamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudieron actualizar los datos.",
                variant: "destructive",
            });
        },
    });

    const handleUpdate = async (data: EmpleadoFormData) => {
        await updateMutation.mutateAsync(data);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error || !empleado) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Error al cargar perfil</h2>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-6 h-6 text-neutral-600" />
                </Button>

                <AvatarUpload
                    empleadoId={empleadoId}
                    currentFotoUrl={empleado.fotoUrl}
                    nombre={`${empleado.nombres} ${empleado.apellidos}`}
                    className="mr-2"
                />

                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">
                        Mi Perfil
                    </h1>
                    <div className="flex items-center gap-2 text-neutral-600 mt-1">
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-xs font-mono font-medium">
                            Socio Nº {numeroSocio}
                        </span>
                        <span>•</span>
                        <span>{empleado.numeroDocumento}</span>
                        <span>•</span>
                        <span>{empleado.cargo || "Sin Cargo"}</span>
                        <span>•</span>
                        <span>{empleado.sucursal || "Sin Sucursal"}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-neutral-200 mb-6">
                    <TabsList className="bg-transparent h-12 p-0 space-x-6">
                        <TabsTrigger
                            value="info"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-0"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Mis Datos
                        </TabsTrigger>
                        <TabsTrigger
                            value="documentos"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-0"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Mi Legajo
                        </TabsTrigger>
                        <TabsTrigger
                            value="solicitudes"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-0"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Mis Solicitudes
                        </TabsTrigger>
                        <TabsTrigger
                            value="recibos"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none px-0"
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Mis Recibos
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6 min-h-[500px]">
                    <TabsContent value="info" className="m-0 focus-visible:outline-none">
                        <div className="max-w-4xl">
                            {/* Reusing EmpleadoForm but maybe we want to disable some fields or show readonly view */}
                            {/* For now allowing edit of own data */}
                            <EmpleadoForm
                                empleado={empleado}
                                onSubmit={handleUpdate}
                                onCancel={() => router.back()}
                                isLoading={updateMutation.isPending}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="documentos" className="m-0 focus-visible:outline-none">
                        <DocumentosList
                            empleadoId={empleadoId}
                            empleadoNombre={`${empleado.nombres} ${empleado.apellidos}`}
                            showHeader={false}
                        />
                    </TabsContent>

                    <TabsContent value="solicitudes" className="m-0 focus-visible:outline-none">
                        <SolicitudesList empleadoId={empleadoId} />
                    </TabsContent>

                    <TabsContent value="recibos" className="m-0 focus-visible:outline-none">
                        <RecibosList empleadoId={empleadoId} isAdmin={false} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
