"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { SolicitudFormData } from "@/src/types/solicitud";
import { Loader2 } from "lucide-react";

const solicitudSchema = z.object({
    tipo: z.enum(["VACACIONES", "PERMISO", "LICENCIA", "CONSTANCIA", "OTRO"], {
        required_error: "Seleccione un tipo de solicitud",
    }),
    fechaInicio: z.string().optional(),
    fechaFin: z.string().optional(),
    motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
});

interface SolicitudFormProps {
    onSubmit: (data: SolicitudFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function SolicitudForm({ onSubmit, onCancel, isLoading }: SolicitudFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SolicitudFormData>({
        resolver: zodResolver(solicitudSchema),
    });

    const tipo = watch("tipo");
    const showDates = ["VACACIONES", "PERMISO", "LICENCIA"].includes(tipo);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Solicitud *</Label>
                    <Select
                        onValueChange={(value) => setValue("tipo", value as any)}
                    >
                        <SelectTrigger className={errors.tipo ? "border-destructive" : ""}>
                            <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="VACACIONES">Vacaciones</SelectItem>
                            <SelectItem value="PERMISO">Permiso</SelectItem>
                            <SelectItem value="LICENCIA">Licencia</SelectItem>
                            <SelectItem value="CONSTANCIA">Constancia Laboral</SelectItem>
                            <SelectItem value="OTRO">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.tipo && (
                        <p className="text-sm text-destructive">{errors.tipo.message}</p>
                    )}
                </div>

                {showDates && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                            <Input
                                id="fechaInicio"
                                type="date"
                                {...register("fechaInicio")}
                                className={errors.fechaInicio ? "border-destructive" : ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fechaFin">Fecha Fin *</Label>
                            <Input
                                id="fechaFin"
                                type="date"
                                {...register("fechaFin")}
                                className={errors.fechaFin ? "border-destructive" : ""}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="motivo">Motivo *</Label>
                    <Textarea
                        id="motivo"
                        {...register("motivo")}
                        placeholder="Describa el motivo de su solicitud..."
                        className={errors.motivo ? "border-destructive" : ""}
                        rows={4}
                    />
                    {errors.motivo && (
                        <p className="text-sm text-destructive">{errors.motivo.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="documento">Documento Adjunto (Opcional)</Label>
                    <Input
                        id="documento"
                        type="file"
                        className="cursor-pointer"
                    />
                    <p className="text-xs text-neutral-500">
                        Formatos permitidos: PDF, JPG, PNG. Máx 5MB.
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Solicitud
                </Button>
            </div>
        </form>
    );
}
