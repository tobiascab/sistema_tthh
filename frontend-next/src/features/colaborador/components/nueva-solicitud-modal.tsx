"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Calendar, FileText, AlertCircle, X } from "lucide-react";

const solicitudSchema = z.object({
    tipo: z.enum(["VACACIONES", "PERMISO", "CERTIFICADO", "ACTUALIZACION_DATOS"]),
    titulo: z.string().min(5, "El título debe tener al menos 5 caracteres"),
    descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "URGENTE"]),
    datosAdicionales: z.string().optional(),
});

type SolicitudFormData = z.infer<typeof solicitudSchema>;

interface NuevaSolicitudModalProps {
    isOpen: boolean;
    onClose: () => void;
    tipoInicial?: string;
}

export function NuevaSolicitudModal({ isOpen, onClose, tipoInicial }: NuevaSolicitudModalProps) {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<SolicitudFormData>({
        resolver: zodResolver(solicitudSchema),
        defaultValues: {
            tipo: (tipoInicial as any) || "PERMISO",
            prioridad: "MEDIA",
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: SolicitudFormData) => {
            const token = localStorage.getItem("access_token");
            const response = await fetch("/api/solicitudes", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to create solicitud");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["solicitudes"] });
            queryClient.invalidateQueries({ queryKey: ["colaborador-dashboard"] });
            reset();
            onClose();
        },
    });

    const onSubmit = async (data: SolicitudFormData) => {
        setIsSubmitting(true);
        try {
            await createMutation.mutateAsync(data);
        } catch (error) {
            console.error("Error creating solicitud:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedTipo = watch("tipo");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-neutral-800">Nueva Solicitud</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Tipo de Solicitud */}
                    <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo de Solicitud</Label>
                        <select
                            id="tipo"
                            {...register("tipo")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="VACACIONES">Vacaciones</option>
                            <option value="PERMISO">Permiso</option>
                            <option value="CERTIFICADO">Certificado</option>
                            <option value="ACTUALIZACION_DATOS">Actualización de Datos</option>
                        </select>
                        {errors.tipo && (
                            <p className="text-sm text-red-600">{errors.tipo.message}</p>
                        )}
                    </div>

                    {/* Título */}
                    <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                            id="titulo"
                            {...register("titulo")}
                            placeholder="Ej: Solicitud de vacaciones - Diciembre 2024"
                            className={errors.titulo ? "border-red-500" : ""}
                        />
                        {errors.titulo && (
                            <p className="text-sm text-red-600">{errors.titulo.message}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <textarea
                            id="descripcion"
                            {...register("descripcion")}
                            rows={4}
                            placeholder="Describe los detalles de tu solicitud..."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.descripcion ? "border-red-500" : "border-neutral-300"
                                }`}
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-red-600">{errors.descripcion.message}</p>
                        )}
                    </div>

                    {/* Prioridad */}
                    <div className="space-y-2">
                        <Label htmlFor="prioridad">Prioridad</Label>
                        <select
                            id="prioridad"
                            {...register("prioridad")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="BAJA">Baja</option>
                            <option value="MEDIA">Media</option>
                            <option value="ALTA">Alta</option>
                            <option value="URGENTE">Urgente</option>
                        </select>
                    </div>

                    {/* Datos Adicionales (condicional según tipo) */}
                    {selectedTipo === "VACACIONES" && (
                        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                            <p className="text-sm text-primary-800 font-medium mb-2">
                                Información adicional para vacaciones:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fechaInicio" className="text-sm">Fecha Inicio</Label>
                                    <Input type="date" id="fechaInicio" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="fechaFin" className="text-sm">Fecha Fin</Label>
                                    <Input type="date" id="fechaFin" className="mt-1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alert Info */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Importante:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Tu solicitud será revisada por el área de TTHH</li>
                                <li>Recibirás una notificación cuando sea procesada</li>
                                <li>Puedes ver el estado en "Mis Solicitudes"</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
