"use client";

import { useState } from "react";
import {
    Calendar,
    Clock,
    FileText,
    Upload,
    Download,
    Eye,
    CheckCircle2,
    AlertCircle,
    User,
    TrendingUp,
    MapPin,
    CalendarDays
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Empleado } from "@/src/types/empleado";
import { motion, AnimatePresence } from "framer-motion";

interface DetallePrestadorDialogProps {
    empleado: Empleado | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DetallePrestadorDialog({ empleado, open, onOpenChange }: DetallePrestadorDialogProps) {
    if (!empleado) return null;

    // Mock data for attendance and invoices
    const marcaciones = [
        { id: 1, fecha: "2024-12-23", entrada: "08:02", salida: "12:15", estado: "PRESENTE" },
        { id: 2, fecha: "2024-12-22", entrada: "07:55", salida: "12:05", estado: "PRESENTE" },
        { id: 3, fecha: "2024-12-21", entrada: "08:10", salida: "12:30", estado: "PRESENTE" },
        { id: 4, fecha: "2024-12-20", entrada: "08:00", salida: "12:00", estado: "PRESENTE" },
    ];

    const facturas = [
        { id: 1, mes: "Noviembre 2024", fecha: "2024-12-05", monto: "5.500.000", estado: "PAGADO" },
        { id: 2, mes: "Octubre 2024", fecha: "2024-11-06", monto: "6.200.000", estado: "PAGADO" },
        { id: 3, mes: "Septiembre 2024", fecha: "2024-10-04", monto: "5.800.000", estado: "PAGADO" },
    ];

    const horarios = [
        { dia: "Lunes", horario: "08:00 - 12:00" },
        { dia: "Miércoles", horario: "08:00 - 12:00" },
        { dia: "Viernes", horario: "08:00 - 12:00" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl bg-neutral-50/95 backdrop-blur-xl">
                <div className="relative">
                    {/* Header Background */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90" />

                    <div className="relative z-10 px-8 pt-12 pb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl border-4 border-white/50">
                                <div className="w-full h-full rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-black text-3xl">
                                    {empleado.nombres.split(" ")[1]?.charAt(0) || "D"}{empleado.apellidos.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-white drop-shadow-sm">{empleado.nombres} {empleado.apellidos}</h2>
                                    <Badge className="bg-white/20 text-white backdrop-blur-md border-none font-bold">PRESTADOR</Badge>
                                </div>
                                <p className="text-blue-100 font-medium flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4" /> Especialidad: {empleado.cargo}
                                </p>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="max-h-[70vh] px-8 pb-8">
                        <Tabs defaultValue="horarios" className="w-full mt-6">
                            <TabsList className="bg-white/50 p-1 rounded-2xl h-12 border border-blue-100 shadow-sm w-full justify-start gap-2">
                                <TabsTrigger value="horarios" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 gap-2">
                                    <CalendarDays className="w-4 h-4" /> Horarios
                                </TabsTrigger>
                                <TabsTrigger value="marcaciones" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 gap-2">
                                    <TrendingUp className="w-4 h-4" /> Marcaciones
                                </TabsTrigger>
                                <TabsTrigger value="facturas" className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 gap-2">
                                    <FileText className="w-4 h-4" /> Facturas PDF
                                </TabsTrigger>
                            </TabsList>

                            {/* Horarios Tab */}
                            <TabsContent value="horarios" className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                                        <CardHeader className="bg-blue-50/50 pb-4">
                                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                                                <Clock className="w-4 h-4" /> Días de Servicio
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="space-y-3">
                                                {horarios.map((h, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                                                        <span className="font-bold text-neutral-700">{h.dia}</span>
                                                        <Badge variant="outline" className="font-mono text-blue-600 border-blue-200">{h.horario}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-sm bg-white rounded-2xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-neutral-900">Ubicación de Servicio</h4>
                                                <p className="text-neutral-500 text-sm">{empleado.sucursal}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                                            <p className="text-xs text-neutral-400 font-medium">Nota interna:</p>
                                            <p className="text-sm text-neutral-600 italic">"Preferencias de consultorio planta baja para pacientes crónicos."</p>
                                        </div>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Marcaciones Tab */}
                            <TabsContent value="marcaciones" className="mt-6">
                                <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-black tracking-widest">
                                                <tr>
                                                    <th className="px-6 py-4">Fecha</th>
                                                    <th className="px-6 py-4">Entrada</th>
                                                    <th className="px-6 py-4">Salida</th>
                                                    <th className="px-6 py-4">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-50">
                                                {marcaciones.map((m) => (
                                                    <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-neutral-700">{m.fecha}</td>
                                                        <td className="px-6 py-4 font-mono text-blue-600">{m.entrada}</td>
                                                        <td className="px-6 py-4 font-mono text-blue-600">{m.salida}</td>
                                                        <td className="px-6 py-4">
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold">{m.estado}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* Facturas Tab */}
                            <TabsContent value="facturas" className="mt-6">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-lg font-bold text-neutral-900">Historial de Facturas</h3>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl h-9">
                                        <Upload className="w-4 h-4 mr-2" /> Alzar Factura (PDF)
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {facturas.map((f) => (
                                        <motion.div
                                            key={f.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-neutral-900">{f.mes}</h4>
                                                    <p className="text-xs text-neutral-400">Subido el {f.fecha} • Gs. {f.monto}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-neutral-100 text-neutral-600 border-none mr-2 font-bold">{f.estado}</Badge>
                                                <Button size="icon" variant="ghost" className="rounded-xl text-neutral-400 hover:text-blue-600 hover:bg-blue-50">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="rounded-xl text-neutral-400 hover:text-blue-600 hover:bg-blue-50">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
