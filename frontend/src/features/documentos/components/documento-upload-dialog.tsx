"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Upload,
    X,
    FileText,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";

import { documentosApi } from "@/src/lib/api/documentos";
import {
    DocumentoFormData,
    CATEGORIAS_DOCUMENTO,
} from "@/src/types/documento";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Switch } from "@/src/components/ui/switch";
import { Progress } from "@/src/components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
};

const documentoSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(200),
    descripcion: z.string().max(500).optional(),
    categoria: z.string().min(1, "La categoría es requerida"),
    tipo: z.string().max(100).optional(),
    fechaEmision: z.string().optional(),
    fechaVencimiento: z.string().optional(),
    entidadEmisora: z.string().max(100).optional(),
    numeroDocumento: z.string().max(100).optional(),
    requiereAprobacion: z.boolean().default(false),
    esObligatorio: z.boolean().default(false),
    esConfidencial: z.boolean().default(false),
    diasAlertaVencimiento: z.number().min(1).max(365).optional(),
    observaciones: z.string().max(500).optional(),
});

type DocumentoFormValues = z.infer<typeof documentoSchema>;

interface DocumentoUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empleadoId: number;
    onSuccess: () => void;
}

export function DocumentoUploadDialog({
    open,
    onOpenChange,
    empleadoId,
    onSuccess,
}: DocumentoUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const form = useForm<DocumentoFormValues>({
        resolver: zodResolver(documentoSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
            categoria: "",
            tipo: "",
            fechaEmision: "",
            fechaVencimiento: "",
            entidadEmisora: "",
            numeroDocumento: "",
            requiereAprobacion: false,
            esObligatorio: false,
            esConfidencial: false,
            diasAlertaVencimiento: 30,
            observaciones: "",
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async ({ file, metadata }: { file: File; metadata: DocumentoFormData }) => {
            // Simulate progress
            setUploadProgress(20);
            const result = await documentosApi.subir(file, metadata);
            setUploadProgress(100);
            return result;
        },
        onSuccess: () => {
            resetForm();
            onSuccess();
        },
        onError: (error: Error) => {
            setUploadError(error.message);
            setUploadProgress(0);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.size > MAX_FILE_SIZE) {
                setUploadError("El archivo excede el tamaño máximo de 10MB");
                return;
            }
            setFile(selectedFile);
            setUploadError(null);
            // Auto-fill name if empty
            if (!form.getValues("nombre")) {
                const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
                form.setValue("nombre", nameWithoutExt);
            }
        }
    }, [form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        maxFiles: 1,
        multiple: false,
    });

    const resetForm = () => {
        form.reset();
        setFile(null);
        setUploadProgress(0);
        setUploadError(null);
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    const onSubmit = (data: DocumentoFormValues) => {
        if (!file) {
            setUploadError("Por favor selecciona un archivo");
            return;
        }

        const metadata: DocumentoFormData = {
            empleadoId,
            nombre: data.nombre,
            descripcion: data.descripcion || undefined,
            categoria: data.categoria,
            tipo: data.tipo || undefined,
            fechaEmision: data.fechaEmision || undefined,
            fechaVencimiento: data.fechaVencimiento || undefined,
            entidadEmisora: data.entidadEmisora || undefined,
            numeroDocumento: data.numeroDocumento || undefined,
            requiereAprobacion: data.requiereAprobacion,
            esObligatorio: data.esObligatorio,
            esConfidencial: data.esConfidencial,
            diasAlertaVencimiento: data.diasAlertaVencimiento,
            observaciones: data.observaciones || undefined,
        };

        uploadMutation.mutate({ file, metadata });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Subir Documento</DialogTitle>
                    <DialogDescription>
                        Sube un documento al legajo del empleado. Los formatos aceptados son
                        PDF, imágenes y documentos de Office.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                ? "border-green-500 bg-green-50"
                                : file
                                    ? "border-green-500 bg-green-50"
                                    : "border-neutral-300 hover:border-green-400 hover:bg-neutral-50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        {file ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <FileText className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-neutral-800">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-neutral-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                                <p className="text-neutral-600 mb-2">
                                    {isDragActive
                                        ? "Suelta el archivo aquí..."
                                        : "Arrastra un archivo aquí o haz clic para seleccionar"}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    PDF, imágenes o documentos de Office (máx. 10MB)
                                </p>
                            </>
                        )}
                    </div>

                    {/* Upload progress */}
                    {uploadMutation.isPending && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-600">Subiendo documento...</span>
                                <span className="text-neutral-800 font-medium">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    {/* Error message */}
                    {uploadError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{uploadError}</span>
                        </div>
                    )}

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre">
                                Nombre del documento <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="nombre"
                                {...form.register("nombre")}
                                placeholder="Ej: Cédula de identidad"
                            />
                            {form.formState.errors.nombre && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.nombre.message}
                                </p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div className="space-y-2">
                            <Label htmlFor="categoria">
                                Categoría <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={form.watch("categoria")}
                                onValueChange={(value) => form.setValue("categoria", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS_DOCUMENTO.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.categoria && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.categoria.message}
                                </p>
                            )}
                        </div>

                        {/* Tipo */}
                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de documento</Label>
                            <Input
                                id="tipo"
                                {...form.register("tipo")}
                                placeholder="Ej: Original, Copia, Legalizada"
                            />
                        </div>

                        {/* Número de documento */}
                        <div className="space-y-2">
                            <Label htmlFor="numeroDocumento">Número de documento</Label>
                            <Input
                                id="numeroDocumento"
                                {...form.register("numeroDocumento")}
                                placeholder="Ej: 123456789"
                            />
                        </div>

                        {/* Fecha de emisión */}
                        <div className="space-y-2">
                            <Label htmlFor="fechaEmision">Fecha de emisión</Label>
                            <Input
                                id="fechaEmision"
                                type="date"
                                {...form.register("fechaEmision")}
                            />
                        </div>

                        {/* Fecha de vencimiento */}
                        <div className="space-y-2">
                            <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
                            <Input
                                id="fechaVencimiento"
                                type="date"
                                {...form.register("fechaVencimiento")}
                            />
                        </div>

                        {/* Entidad emisora */}
                        <div className="space-y-2">
                            <Label htmlFor="entidadEmisora">Entidad emisora</Label>
                            <Input
                                id="entidadEmisora"
                                {...form.register("entidadEmisora")}
                                placeholder="Ej: Ministerio de Trabajo"
                            />
                        </div>

                        {/* Días de alerta */}
                        <div className="space-y-2">
                            <Label htmlFor="diasAlertaVencimiento">
                                Días de alerta antes de vencer
                            </Label>
                            <Input
                                id="diasAlertaVencimiento"
                                type="number"
                                min={1}
                                max={365}
                                {...form.register("diasAlertaVencimiento", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            {...form.register("descripcion")}
                            placeholder="Descripción del documento..."
                            rows={3}
                        />
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            {...form.register("observaciones")}
                            placeholder="Notas o comentarios adicionales..."
                            rows={2}
                        />
                    </div>

                    {/* Switches */}
                    <div className="space-y-4 bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="requiereAprobacion" className="cursor-pointer">
                                    Requiere aprobación
                                </Label>
                                <p className="text-sm text-neutral-500">
                                    El documento debe ser aprobado antes de ser válido
                                </p>
                            </div>
                            <Switch
                                id="requiereAprobacion"
                                checked={form.watch("requiereAprobacion")}
                                onCheckedChange={(checked) =>
                                    form.setValue("requiereAprobacion", checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="esObligatorio" className="cursor-pointer">
                                    Documento obligatorio
                                </Label>
                                <p className="text-sm text-neutral-500">
                                    Este documento es requerido en el legajo
                                </p>
                            </div>
                            <Switch
                                id="esObligatorio"
                                checked={form.watch("esObligatorio")}
                                onCheckedChange={(checked) =>
                                    form.setValue("esObligatorio", checked)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="esConfidencial" className="cursor-pointer">
                                    Documento confidencial
                                </Label>
                                <p className="text-sm text-neutral-500">
                                    Solo usuarios autorizados pueden ver este documento
                                </p>
                            </div>
                            <Switch
                                id="esConfidencial"
                                checked={form.watch("esConfidencial")}
                                onCheckedChange={(checked) =>
                                    form.setValue("esConfidencial", checked)
                                }
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!file || uploadMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {uploadMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Subir documento
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
