"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
    Calendar as CalendarIcon,
    Upload,
    X,
    Loader2,
    Info
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
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
import { Calendar } from "@/src/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { Textarea } from "@/src/components/ui/textarea";
import { ausenciasApi } from "@/src/lib/api/ausencias";
import { AusenciaFormData } from "@/src/types/ausencia";
import { toast } from "@/src/hooks/use-toast";
import { cn } from "@/src/lib/utils";

const tiposAusencia = [
    { value: 'VACACIONES', label: 'Vacaciones', description: 'Días de descanso anuales' },
    { value: 'PERMISO', label: 'Permiso Personal', description: 'Permiso con o sin goce de sueldo' },
    { value: 'LICENCIA_MEDICA', label: 'Licencia Médica', description: 'Por razones de salud' },
    { value: 'MATERNIDAD', label: 'Licencia Maternidad', description: 'Para colaboradoras embarazadas' },
    { value: 'PATERNIDAD', label: 'Licencia Paternidad', description: 'Para nuevos padres' },
    { value: 'DUELO', label: 'Duelo', description: 'Por fallecimiento de familiar' },
    { value: 'OTRO', label: 'Otro', description: 'Otras razones' },
] as const;

const formSchema = z.object({
    tipo: z.enum(['VACACIONES', 'PERMISO', 'LICENCIA_MEDICA', 'MATERNIDAD', 'PATERNIDAD', 'DUELO', 'OTRO']),
    fechaInicio: z.date({
        required_error: "La fecha de inicio es requerida",
    }),
    fechaFin: z.date({
        required_error: "La fecha de fin es requerida",
    }),
    observacion: z.string().optional(),
}).refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
    path: ["fechaFin"],
});

type FormValues = z.infer<typeof formSchema>;

interface NuevaAusenciaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empleadoId: number;
    saldoVacaciones?: number;
}

export function NuevaAusenciaDialog({
    open,
    onOpenChange,
    empleadoId,
    saldoVacaciones = 0
}: NuevaAusenciaDialogProps) {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: 'VACACIONES',
            observacion: '',
        },
    });

    const watchFechaInicio = form.watch("fechaInicio");
    const watchFechaFin = form.watch("fechaFin");
    const watchTipo = form.watch("tipo");

    const diasSolicitados = watchFechaInicio && watchFechaFin
        ? differenceInDays(watchFechaFin, watchFechaInicio) + 1
        : 0;

    const createMutation = useMutation({
        mutationFn: (data: AusenciaFormData) => ausenciasApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ausencias"] });
            queryClient.invalidateQueries({ queryKey: ["saldo-vacaciones"] });
            toast({
                title: "Solicitud enviada",
                description: "Tu solicitud de ausencia ha sido enviada para aprobación.",
            });
            onOpenChange(false);
            form.reset();
            setSelectedFile(null);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "No se pudo enviar la solicitud. Por favor intenta nuevamente.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (values: FormValues) => {
        const data: AusenciaFormData = {
            empleadoId,
            tipo: values.tipo,
            fechaInicio: format(values.fechaInicio, 'yyyy-MM-dd'),
            fechaFin: format(values.fechaFin, 'yyyy-MM-dd'),
            observacion: values.observacion,
            documentoAdjunto: selectedFile || undefined,
        };
        createMutation.mutate(data);
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Nueva Solicitud de Ausencia</DialogTitle>
                    <DialogDescription>
                        Completa el formulario para solicitar vacaciones, permisos u otros tipos de ausencia.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Tipo de Ausencia */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Ausencia</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona el tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {tiposAusencia.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    <div className="flex flex-col">
                                                        <span>{tipo.label}</span>
                                                        <span className="text-xs text-neutral-500">
                                                            {tipo.description}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Saldo de vacaciones (solo mostrar si es vacaciones) */}
                        {watchTipo === 'VACACIONES' && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">
                                    Tienes <strong>{saldoVacaciones}</strong> días de vacaciones disponibles
                                </span>
                            </div>
                        )}

                        {/* Fecha de Inicio */}
                        <FormField
                            control={form.control}
                            name="fechaInicio"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Inicio</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Fecha de Fin */}
                        <FormField
                            control={form.control}
                            name="fechaFin"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de Fin</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Selecciona una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < (watchFechaInicio || new Date(new Date().setHours(0, 0, 0, 0)))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Resumen de días */}
                        {diasSolicitados > 0 && (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                <span className="text-sm text-green-700">Días solicitados:</span>
                                <span className="font-bold text-green-700">{diasSolicitados} día{diasSolicitados !== 1 ? 's' : ''}</span>
                            </div>
                        )}

                        {/* Observaciones */}
                        <FormField
                            control={form.control}
                            name="observacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observaciones (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Agrega detalles adicionales sobre tu solicitud..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Proporciona información adicional si es necesario.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Documento Adjunto */}
                        <div className="space-y-2">
                            <FormLabel>Documento Adjunto (Opcional)</FormLabel>
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

                        <DialogFooter className="gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="bg-gradient-to-r from-green-600 to-emerald-600"
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar Solicitud"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
