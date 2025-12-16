"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { importApi, ImportResult } from "@/src/lib/api/import";
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Download,
    Cake
} from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";

interface ImportCumpleaniosDialogProps {
    trigger?: React.ReactNode;
}

export function ImportCumpleaniosDialog({ trigger }: ImportCumpleaniosDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (file: File) => importApi.importarCumpleanios(file),
        onSuccess: (data) => {
            setResult(data);
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
                toast({
                    title: "¡Importación exitosa!",
                    description: `Se actualizaron ${data.actualizados} registros de cumpleaños.`,
                });
            }
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudo procesar el archivo.",
                variant: "destructive",
            });
        },
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
                setFile(droppedFile);
                setResult(null);
            } else {
                toast({
                    title: "Archivo no válido",
                    description: "Solo se aceptan archivos Excel (.xlsx o .xls)",
                    variant: "destructive",
                });
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = () => {
        if (file) {
            mutation.mutate(file);
        }
    };

    const resetDialog = () => {
        setFile(null);
        setResult(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetDialog(); }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <Upload className="w-4 h-4" />
                        Importar Cumpleaños
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Cake className="w-5 h-5 text-pink-500" />
                        Importar Fechas de Cumpleaños
                    </DialogTitle>
                    <DialogDescription>
                        Sube un archivo Excel con las columnas: <strong>Documento/Cédula</strong> y <strong>Fecha de Nacimiento</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Drop Zone */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                ? "border-pink-500 bg-pink-50"
                                : file
                                    ? "border-green-500 bg-green-50"
                                    : "border-neutral-200 hover:border-pink-300 hover:bg-pink-50/50"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleChange}
                            className="hidden"
                        />

                        {file ? (
                            <div className="flex flex-col items-center gap-2">
                                <FileSpreadsheet className="w-12 h-12 text-green-600" />
                                <p className="font-medium text-green-700">{file.name}</p>
                                <p className="text-sm text-neutral-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setFile(null); setResult(null); }}
                                    className="text-neutral-500"
                                >
                                    Cambiar archivo
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className={`w-12 h-12 ${dragActive ? "text-pink-500" : "text-neutral-400"}`} />
                                <p className="font-medium text-neutral-700">
                                    Arrastra tu archivo Excel aquí
                                </p>
                                <p className="text-sm text-neutral-500">o</p>
                                <Button
                                    variant="outline"
                                    onClick={() => inputRef.current?.click()}
                                    className="border-pink-200 text-pink-600 hover:bg-pink-50"
                                >
                                    Seleccionar archivo
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Example Format */}
                    <div className="bg-neutral-50 rounded-lg p-4 text-sm">
                        <p className="font-medium text-neutral-700 mb-2">Formato esperado del Excel:</p>
                        <div className="bg-white rounded border overflow-hidden">
                            <table className="w-full text-xs">
                                <thead className="bg-neutral-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Documento</th>
                                        <th className="px-3 py-2 text-left">Nombre</th>
                                        <th className="px-3 py-2 text-left">Fecha Nacimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-3 py-2">4328485</td>
                                        <td className="px-3 py-2">Juan Pérez</td>
                                        <td className="px-3 py-2">15/05/1990</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-3 py-2">3456789</td>
                                        <td className="px-3 py-2">María García</td>
                                        <td className="px-3 py-2">22/12/1985</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`rounded-lg p-4 ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {result.success ? (
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                                            {result.success ? "Importación completada" : "Error en la importación"}
                                        </p>
                                        {result.success ? (
                                            <div className="text-sm text-green-700 mt-1 space-y-1">
                                                <p>✓ Procesados: {result.procesados}</p>
                                                <p>✓ Actualizados: {result.actualizados}</p>
                                                {result.errores && result.errores > 0 && (
                                                    <p className="text-amber-600">⚠ Errores: {result.errores}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-700 mt-1">{result.error}</p>
                                        )}

                                        {result.listaErrores && result.listaErrores.length > 0 && (
                                            <details className="mt-2">
                                                <summary className="text-sm text-amber-600 cursor-pointer hover:underline">
                                                    Ver detalles de errores ({result.listaErrores.length})
                                                </summary>
                                                <ul className="mt-2 text-xs text-neutral-600 max-h-32 overflow-y-auto space-y-1">
                                                    {result.listaErrores.map((err, i) => (
                                                        <li key={i} className="flex items-start gap-1">
                                                            <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                                                            {err}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            {result?.success ? "Cerrar" : "Cancelar"}
                        </Button>
                        {!result?.success && (
                            <Button
                                onClick={handleUpload}
                                disabled={!file || mutation.isPending}
                                className="bg-pink-600 hover:bg-pink-700"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Importar
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
