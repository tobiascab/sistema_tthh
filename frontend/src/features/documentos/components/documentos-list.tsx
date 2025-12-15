"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    FileText,
    Upload,
    Download,
    Trash2,
    Eye,
    Search,
    Filter,
    AlertCircle,
    CheckCircle,
    Clock,
    FileWarning,
    FolderOpen,
    MoreVertical,
    RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { documentosApi } from "@/src/lib/api/documentos";
import {
    Documento,
    CATEGORIAS_DOCUMENTO,
    ESTADOS_DOCUMENTO,
    DocumentoCategoria,
} from "@/src/types/documento";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { DocumentoUploadDialog } from "./documento-upload-dialog";
import { DocumentoViewerDialog } from "./documento-viewer-dialog";

interface DocumentosListProps {
    empleadoId: number;
    empleadoNombre?: string;
    showHeader?: boolean;
}

export function DocumentosList({
    empleadoId,
    empleadoNombre,
    showHeader = true,
}: DocumentosListProps) {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaFilter, setCategoriaFilter] = useState<string>("all");
    const [estadoFilter, setEstadoFilter] = useState<string>("all");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Documento | null>(null);

    // Fetch documents
    const {
        data: documentos,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["documentos", empleadoId],
        queryFn: () => documentosApi.listarPorEmpleado(empleadoId),
    });

    // Fetch missing required documents
    const { data: faltantes } = useQuery({
        queryKey: ["documentos-faltantes", empleadoId],
        queryFn: () => documentosApi.listarFaltantes(empleadoId),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => documentosApi.eliminar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documentos", empleadoId] });
            setDocToDelete(null);
        },
    });

    // Filter documents
    const filteredDocs = documentos?.filter((doc) => {
        const matchesSearch =
            doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.nombreArchivo?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategoria =
            categoriaFilter === "all" || doc.categoria === categoriaFilter;

        const matchesEstado =
            estadoFilter === "all" || doc.estado === estadoFilter;

        return matchesSearch && matchesCategoria && matchesEstado;
    });

    // Group by category for summary
    const groupedByCategoria = documentos?.reduce((acc, doc) => {
        const cat = doc.categoria || "OTROS";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleDownload = async (doc: Documento) => {
        try {
            const blob = await documentosApi.descargar(doc.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = doc.nombreArchivo || `documento_${doc.id}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    };

    const handleView = (doc: Documento) => {
        setSelectedDoc(doc);
        setIsViewerOpen(true);
    };

    const getEstadoBadge = (estado?: string) => {
        const estadoConfig = ESTADOS_DOCUMENTO.find((e) => e.value === estado);
        if (!estadoConfig) return <Badge variant="secondary">{estado}</Badge>;

        return (
            <Badge className={estadoConfig.color}>
                {estadoConfig.label}
            </Badge>
        );
    };

    const getVencimientoIndicator = (doc: Documento) => {
        if (doc.estaVencido) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Documento vencido</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        if (doc.diasParaVencer !== undefined && doc.diasParaVencer <= 30) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FileWarning className="w-4 h-4 text-orange-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Vence en {doc.diasParaVencer} días</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        }

        return null;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-800">
                    Error al cargar documentos
                </h3>
                <p className="text-neutral-600 mb-4">
                    No se pudieron obtener los documentos del empleado.
                </p>
                <Button onClick={() => refetch()}>Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            {showHeader && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-800">
                            Legajo Digital
                        </h2>
                        {empleadoNombre && (
                            <p className="text-neutral-600">{empleadoNombre}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualizar
                        </Button>
                        <Button
                            onClick={() => setIsUploadOpen(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Subir Documento
                        </Button>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600">Total</p>
                            <p className="text-2xl font-bold text-neutral-800">
                                {documentos?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600">Pendientes</p>
                            <p className="text-2xl font-bold text-neutral-800">
                                {documentos?.filter((d) => d.estado === "PENDIENTE_APROBACION").length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600">Vencidos</p>
                            <p className="text-2xl font-bold text-neutral-800">
                                {documentos?.filter((d) => d.estaVencido).length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <FolderOpen className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600">Faltantes</p>
                            <p className="text-2xl font-bold text-neutral-800">
                                {faltantes?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Missing documents alert */}
            {faltantes && faltantes.length > 0 && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-orange-800 mb-2">
                                Documentos Obligatorios Faltantes
                            </h3>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                {faltantes.map((doc, index) => (
                                    <li key={index} className="text-sm text-orange-700">
                                        • {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={categoriaFilter}
                            onValueChange={setCategoriaFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {CATEGORIAS_DOCUMENTO.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={estadoFilter}
                            onValueChange={setEstadoFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {ESTADOS_DOCUMENTO.map((estado) => (
                                    <SelectItem key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Fecha Emisión</TableHead>
                            <TableHead>Vencimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Tamaño</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                    <p className="text-neutral-500">No se encontraron documentos</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDocs?.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-neutral-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-neutral-100 rounded-lg">
                                                <FileText className="w-4 h-4 text-neutral-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-800">
                                                    {doc.nombre}
                                                </p>
                                                <p className="text-sm text-neutral-500">
                                                    {doc.nombreArchivo}
                                                </p>
                                            </div>
                                            {getVencimientoIndicator(doc)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {CATEGORIAS_DOCUMENTO.find((c) => c.value === doc.categoria)?.label || doc.categoria}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {doc.fechaEmision
                                            ? format(new Date(doc.fechaEmision), "dd/MM/yyyy", { locale: es })
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {doc.fechaVencimiento
                                                ? format(new Date(doc.fechaVencimiento), "dd/MM/yyyy", { locale: es })
                                                : "-"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getEstadoBadge(doc.estado)}</TableCell>
                                    <TableCell className="text-neutral-600">
                                        {doc.tamanioFormateado || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleView(doc)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Ver documento
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDownload(doc)}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Descargar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => setDocToDelete(doc)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Upload Dialog */}
            <DocumentoUploadDialog
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                empleadoId={empleadoId}
                onSuccess={() => {
                    setIsUploadOpen(false);
                    refetch();
                }}
            />

            {/* Viewer Dialog */}
            {selectedDoc && (
                <DocumentoViewerDialog
                    open={isViewerOpen}
                    onOpenChange={setIsViewerOpen}
                    documento={selectedDoc}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el documento &quot;{docToDelete?.nombre}&quot;?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDocToDelete(null)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => docToDelete && deleteMutation.mutate(docToDelete.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
