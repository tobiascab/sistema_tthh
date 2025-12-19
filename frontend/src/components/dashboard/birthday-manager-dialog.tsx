"use client";

import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { useToast } from "@/src/components/ui/use-toast";
import apiClient from "@/src/lib/api/client";
import { Loader2, Plus, Trash2, Settings, Users } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { DateInput } from "@/src/components/ui/date-input";

interface BirthdayManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfigChange?: () => void; // Para recargar el dashboard si cambia algo
}

export function BirthdayManagerDialog({ open, onOpenChange, onConfigChange }: BirthdayManagerDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [configSource, setConfigSource] = useState<"EMPLOYEES" | "MANUAL">("EMPLOYEES");
    const [manualBirthdays, setManualBirthdays] = useState<any[]>([]);

    // Form state
    const [newName, setNewName] = useState("");
    const [newDate, setNewDate] = useState<Date | undefined>(undefined);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [configRes, manualRes] = await Promise.all([
                apiClient.get("/cumpleanos/config"),
                apiClient.get("/cumpleanos/manual")
            ]);

            setConfigSource(configRes.data.valor);
            setManualBirthdays(manualRes.data);
        } catch (error) {
            console.error("Error fetching birthday data:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los datos.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const handleConfigChange = async (checked: boolean) => {
        const newValue = checked ? "API" : "MANUAL"; // Wait, logic invert check
        // Let's use radio or explicit buttons, but Switch is boolean.
        // Let's assume Switch ON = MANUAL, OFF = EMPLOYEES for this specific toggle concept?
        // Or "Usar Lista Manual" Switch.
    };

    const saveConfig = async (source: "EMPLOYEES" | "MANUAL") => {
        try {
            await apiClient.post("/cumpleanos/config", { valor: source });
            setConfigSource(source);
            toast({ title: "Configuración guardada" });
            if (onConfigChange) onConfigChange();
        } catch (error) {
            toast({ title: "Error guardando configuración", variant: "destructive" });
        }
    };

    const addManualBirthday = async () => {
        if (!newName || !newDate || !isValid(newDate)) return;

        try {
            await apiClient.post("/cumpleanos/manual", {
                nombreCompleto: newName,
                fechaNacimiento: format(newDate, "yyyy-MM-dd"),
                avatarUrl: null
            });
            setNewName("");
            setNewDate(undefined);
            fetchData(); // Reload list
            toast({ title: "Cumpleaños agregado" });
            if (configSource === "MANUAL" && onConfigChange) onConfigChange();
        } catch (error) {
            toast({ title: "Error agregando", variant: "destructive" });
        }
    };

    const deleteManualBirthday = async (id: number) => {
        try {
            await apiClient.delete(`/cumpleanos/manual/${id}`);
            fetchData();
            if (configSource === "MANUAL" && onConfigChange) onConfigChange();
        } catch (error) {
            toast({ title: "Error eliminando", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Gestión de Cumpleaños</DialogTitle>
                    <DialogDescription>
                        Configura la fuente de datos y administra la lista manual.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="config" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="config">Configuración</TabsTrigger>
                        <TabsTrigger value="manual">Lista Manual</TabsTrigger>
                    </TabsList>

                    <TabsContent value="config" className="space-y-4 py-4">
                        <div className="flex flex-col gap-4">
                            <div
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${configSource === 'EMPLOYEES' ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 hover:border-emerald-200'}`}
                                onClick={() => saveConfig('EMPLOYEES')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${configSource === 'EMPLOYEES' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800">Automático (Fichas)</p>
                                        <p className="text-sm text-neutral-500">Usa las fechas de nacimiento de los empleados registrados.</p>
                                    </div>
                                </div>
                                {configSource === 'EMPLOYEES' && <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />}
                            </div>

                            <div
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${configSource === 'MANUAL' ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 hover:border-emerald-200'}`}
                                onClick={() => saveConfig('MANUAL')}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${configSource === 'MANUAL' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>
                                        <Settings className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800">Manual / Externo</p>
                                        <p className="text-sm text-neutral-500">Usa una lista personalizada gestionada aquí mismo.</p>
                                    </div>
                                </div>
                                {configSource === 'MANUAL' && <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" />}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-4 py-4">
                        <div className="flex gap-2 items-end">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Juan Pérez"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="grid w-1/3 gap-1.5">
                                <Label htmlFor="date">Fecha</Label>
                                <DateInput
                                    id="date"
                                    value={newDate}
                                    onChange={setNewDate}
                                    placeholder="DD/MM/AA"
                                />
                            </div>
                            <Button onClick={addManualBirthday} disabled={!newName || !newDate}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="rounded-md border h-[300px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {manualBirthdays.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-neutral-400">
                                                No hay cumpleaños registrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        manualBirthdays.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.nombreCompleto}</TableCell>
                                                <TableCell>
                                                    {format(new Date(item.fechaNacimiento), "dd 'de' MMMM yyyy", { locale: es })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => deleteManualBirthday(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
