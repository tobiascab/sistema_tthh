"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
    FileText,
    Upload,
    X,
    Loader2,
    Info,
    Calendar,
    Briefcase,
    MessageSquare,
    DollarSign,
    GraduationCap
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import { SolicitudFormData } from "@/src/types/solicitud";
import { DateInput } from "@/src/components/ui/date-input";
import { cn } from "@/src/lib/utils";

const tiposSolicitud = [
    { value: 'VACACIONES', label: 'Vacaciones', description: 'Solicitud de días de descanso', icon: Calendar, needsDates: true },
    { value: 'PERMISO', label: 'Permiso Personal', description: 'Permiso con o sin goce de sueldo', icon: FileText, needsDates: true },
    { value: 'LICENCIA_MEDICA', label: 'Licencia Médica', description: 'Ausencia por razones de salud', icon: FileText, needsDates: true },
    { value: 'CONSTANCIA_LABORAL', label: 'Constancia Laboral', description: 'Documento de certificación laboral', icon: Briefcase, needsDates: false },
    { value: 'AUMENTO_SALARIO', label: 'Aumento de Salario', description: 'Solicitud de revisión salarial', icon: DollarSign, needsDates: false },
    { value: 'PERMISO_ESTUDIO', label: 'Permiso de Estudio', description: 'Para formación académica', icon: GraduationCap, needsDates: true },
    { value: 'OTRO', label: 'Otro', description: 'Otras solicitudes', icon: MessageSquare, needsDates: false },
] as const;

const formSchema = z.object({
    tipo: z.string().min(1, "Seleccione un tipo de solicitud"),
    fechaInicio: z.date().optional(),
    fechaFin: z.date().optional(),
    descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
}).refine((data) => {
    const tipoConfig = tiposSolicitud.find(t => t.value === data.tipo);
    if (tipoConfig?.needsDates) {
        return data.fechaInicio && data.fechaFin && data.fechaFin >= data.fechaInicio;
    }
    return true;
}, {
    message: "Las fechas son requeridas y la fecha de fin debe ser posterior a la de inicio",
    path: ["fechaFin"],
});

type FormValues = z.infer<typeof formSchema>;

interface SolicitudFormProps {
    onSubmit: (data: SolicitudFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function SolicitudForm({ onSubmit, onCancel, isLoading }: SolicitudFormProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: '',
            descripcion: '',
        },
    });

    const watchTipo = form.watch("tipo");
    const watchFechaInicio = form.watch("fechaInicio");
    const watchFechaFin = form.watch("fechaFin");

    const tipoConfig = tiposSolicitud.find(t => t.value === watchTipo);
    const showDates = tipoConfig?.needsDates || false;

    const diasSolicitados = watchFechaInicio && watchFechaFin
        ? differenceInDays(watchFechaFin, watchFechaInicio) + 1
        : 0;


    const handleFormSubmit = async (values: FormValues) => {
        // Auto-generate titulo from tipo
        const tipoLabel = tiposSolicitud.find(t => t.value === values.tipo)?.label || values.tipo;

        const data: SolicitudFormData = {
            tipo: values.tipo as any,
            titulo: `Solicitud de ${tipoLabel}`,
            descripcion: values.descripcion,
            fechaInicio: values.fechaInicio ? format(values.fechaInicio, 'yyyy-MM-dd') : undefined,
            fechaFin: values.fechaFin ? format(values.fechaFin, 'yyyy-MM-dd') : undefined,
            documentoAdjunto: selectedFile || undefined,
        };
        await onSubmit(data);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
                {/* Tipo de Solicitud */}
                <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">Tipo de Solicitud</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Seleccione el tipo de solicitud" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {tiposSolicitud.map((tipo) => {
                                        const Icon = tipo.icon;
                                        return (
                                            <SelectItem key={tipo.value} value={tipo.value}>
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-4 h-4 text-neutral-500" />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{tipo.label}</span>
                                                        <span className="text-xs text-neutral-500">
                                                            {tipo.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Info Badge para tipo seleccionado */}
                {tipoConfig && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                            {tipoConfig.needsDates
                                ? "Esta solicitud requiere indicar fechas de inicio y fin"
                                : "Esta solicitud no requiere fechas específicas"}
                        </span>
                    </div>
                )}

                {/* Fechas (condicional) */}
                {showDates && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fechaInicio"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Inicio</FormLabel>
                                        <FormControl>
                                            <DateInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="DD/MM/AA"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fechaFin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Fin</FormLabel>
                                        <FormControl>
                                            <DateInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="DD/MM/AA"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Resumen de días */}
                        {diasSolicitados > 0 && (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <span className="text-sm text-green-700">Días solicitados:</span>
                                <span className="font-bold text-green-700">
                                    {diasSolicitados} día{diasSolicitados !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </>
                )}

                {/* Descripción / Motivo */}
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">
                                {tipoConfig?.value === 'AUMENTO_SALARIO' ? 'Justificación' : 'Motivo / Descripción'}
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={
                                        tipoConfig?.value === 'AUMENTO_SALARIO'
                                            ? "Describa los motivos por los cuales considera que merece un aumento..."
                                            : tipoConfig?.value === 'CONSTANCIA_LABORAL'
                                                ? "¿Para qué necesita la constancia? (ej: trámite bancario, visa, etc.)"
                                                : "Describa el motivo de su solicitud con detalle..."
                                    }
                                    className="resize-none min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Sea lo más específico posible para agilizar la aprobación.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Documento Adjunto */}
                <div className="space-y-2">
                    <FormLabel className="text-base font-semibold">Documento Adjunto (Opcional)</FormLabel>
                    {selectedFile ? (
                        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                            <Upload className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-700 flex-1 truncate">
                                {selectedFile.name}
                            </span>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="p-1 hover:bg-neutral-200 rounded"
                            >
                                <X className="w-4 h-4 text-neutral-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
                                <Upload className="w-5 h-5 text-neutral-400" />
                                <span className="text-sm text-neutral-500">
                                    Arrastra un archivo o haz clic para seleccionar
                                </span>
                            </div>
                        </div>
                    )}
                    <p className="text-xs text-neutral-500">
                        Formatos permitidos: PDF, JPG, PNG. Máximo 5MB.
                    </p>
                </div>

                {/* Botones */}
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
                        className="bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar Solicitud"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
