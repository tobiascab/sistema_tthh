"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    FileText,
    Download,
    Mail,
    Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { payrollApi } from "@/src/lib/api/payroll";
import { MESES, ESTADOS_RECIBO } from "@/src/types/payroll";
import { Button } from "@/src/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "@/src/hooks/use-toast";

interface RecibosListProps {
    empleadoId?: number; // Si no se pasa, el backend asume el usuario actual (si es colaborador)
    isAdmin?: boolean;
}

export function RecibosList({ empleadoId, isAdmin = false }: RecibosListProps) {
    const [anioFilter, setAnioFilter] = useState<string>(new Date().getFullYear().toString());

    const { data: recibosPage, isLoading } = useQuery({
        queryKey: ["recibos", empleadoId, anioFilter],
        queryFn: () => payrollApi.getAll({
            empleadoId,
            anio: parseInt(anioFilter),
            size: 100 // Traer todos los del año
        }),
    });

    const handleDownload = async (id: number, periodo: string) => {
        try {
            const blob = await payrollApi.downloadPdf(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recibo_salario_${periodo}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Descarga iniciada",
                description: "El recibo se está descargando...",
            });
        } catch (error) {
            console.error("Error downloading receipt:", error);
            toast({
                title: "Error",
                description: "No se pudo descargar el recibo.",
                variant: "destructive",
            });
        }
    };

    const handleSendEmail = async (id: number) => {
        try {
            await payrollApi.sendEmail(id);
            toast({
                title: "Correo enviado",
                description: "El recibo ha sido enviado por correo electrónico.",
            });
        } catch (error) {
            console.error("Error sending email:", error);
            toast({
                title: "Error",
                description: "No se pudo enviar el correo.",
                variant: "destructive",
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-PY", {
            style: "currency",
            currency: "PYG",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getMesNombre = (mes: number) => {
        return MESES.find(m => m.value === mes)?.label || mes;
    };

    const aniosDisponibles = Array.from(
        { length: 5 },
        (_, i) => (new Date().getFullYear() - i).toString()
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-800">Recibos de Salario</h2>
                <div className="flex items-center gap-2">
                    <Select value={anioFilter} onValueChange={setAnioFilter}>
                        <SelectTrigger className="w-[120px]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {aniosDisponibles.map((anio) => (
                                <SelectItem key={anio} value={anio}>
                                    {anio}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Periodo</TableHead>
                            <TableHead>Fecha de Pago</TableHead>
                            <TableHead>Salario Neto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recibosPage?.content.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                    <p className="text-neutral-500">No hay recibos disponibles para este año</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            recibosPage?.content.map((recibo) => (
                                <TableRow key={recibo.id} className="hover:bg-neutral-50">
                                    <TableCell className="font-medium">
                                        {getMesNombre(recibo.mes)} {recibo.anio}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(recibo.fechaPago), "dd/MM/yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="font-semibold text-green-700">
                                        {formatCurrency(recibo.salarioNeto)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={ESTADOS_RECIBO[recibo.estado]?.color || "bg-gray-100"}>
                                            {ESTADOS_RECIBO[recibo.estado]?.label || recibo.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {isAdmin && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleSendEmail(recibo.id)}
                                                    title="Enviar por correo"
                                                >
                                                    <Mail className="w-4 h-4 text-neutral-500" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(recibo.id, `${recibo.mes}_${recibo.anio}`)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Descargar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
