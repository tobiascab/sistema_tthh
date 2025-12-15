"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Documento } from "@/src/types/documento";
import { documentosApi } from "@/src/lib/api/documentos";
import { Download, ExternalLink, FileText, Loader2, X } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface DocumentoViewerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documento: Documento;
}

export function DocumentoViewerDialog({
    open,
    onOpenChange,
    documento,
}: DocumentoViewerDialogProps) {
    const [url, setUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && documento) {
            loadDocument();
        } else {
            // Cleanup URL when dialog closes
            if (url) {
                window.URL.revokeObjectURL(url);
                setUrl(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, documento]);

    const loadDocument = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const blob = await documentosApi.descargar(documento.id);
            const objectUrl = window.URL.createObjectURL(blob);
            setUrl(objectUrl);
        } catch (err) {
            console.error("Error loading document:", err);
            setError("No se pudo cargar la vista previa del documento.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (url) {
            const a = document.createElement("a");
            a.href = url;
            a.download = documento.nombreArchivo || `documento_${documento.id}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const isPreviewable = () => {
        const mimeType = documento.mimeType?.toLowerCase();
        return (
            mimeType === "application/pdf" ||
            mimeType?.startsWith("image/") ||
            mimeType === "text/plain"
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <div className="px-6 py-4 border-b flex items-center justify-between bg-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle>{documento.nombre}</DialogTitle>
                            <DialogDescription className="mt-1 flex items-center gap-2">
                                <span>{documento.nombreArchivo}</span>
                                <Badge variant="outline" className="text-xs">
                                    {documento.mimeType}
                                </Badge>
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-neutral-100 p-4 overflow-hidden relative flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
                            <p className="text-neutral-600">Cargando documento...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
                            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-1">
                                Error de carga
                            </h3>
                            <p className="text-neutral-600 mb-4">{error}</p>
                            <Button onClick={loadDocument} variant="outline">
                                Reintentar
                            </Button>
                        </div>
                    ) : !url ? (
                        <div className="text-center">
                            <p className="text-neutral-500">Preparando vista previa...</p>
                        </div>
                    ) : isPreviewable() ? (
                        <div className="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
                            {documento.mimeType === "application/pdf" ? (
                                <iframe
                                    src={`${url}#toolbar=0`}
                                    className="w-full h-full border-none"
                                    title="Visor de PDF"
                                />
                            ) : documento.mimeType?.startsWith("image/") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={url}
                                    alt={documento.nombre}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <iframe
                                    src={url}
                                    className="w-full h-full border-none bg-white p-4"
                                    title="Visor de texto"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
                            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">
                                Vista previa no disponible
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                Este tipo de archivo ({documento.mimeType}) no se puede
                                visualizar directamente en el navegador. Por favor, descárgalo
                                para verlo.
                            </p>
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Descargar Archivo
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AlertCircle({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    );
}
