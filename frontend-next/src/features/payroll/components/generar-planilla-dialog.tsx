"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { MESES } from "@/src/types/payroll";
import { Loader2, Calendar } from "lucide-react";
import { toast } from "@/src/components/ui/use-toast";

// Mock API function for now, replace with actual API import
const generarPlanilla = async (data: { mes: number; anio: number }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, count: 150 };
};

interface GenerarPlanillaDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GenerarPlanillaDialog({ open, onOpenChange }: GenerarPlanillaDialogProps) {
    const queryClient = useQueryClient();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [mes, setMes] = useState<number>(currentMonth);
    const [anio, setAnio] = useState<number>(currentYear);

    const mutation = useMutation({
        mutationFn: generarPlanilla,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["nominas"] });
            onOpenChange(false);
            toast({
                title: "Planilla Generada",
                description: `Se han generado los recibos para ${MESES.find(m => m.value === mes)?.label} ${anio}`,
                variant: "default", // Corrected variant
            });
        },
        onError: () => {
             toast({
                title: "Error",
                description: "No se pudo generar la planilla.",
                variant: "destructive",
            });
        }
    });

    const handleGenerar = () => {
        mutation.mutate({ mes, anio });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        Generar Planilla Mensual
                    </DialogTitle>
                    <DialogDescription>
                        Calcula y genera los recibos de salario para todos los empleados activos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Mes</Label>
                        <Select value={mes.toString()} onValueChange={(v) => setMes(parseInt(v))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MESES.map((m) => (
                                    <SelectItem key={m.value} value={m.value.toString()}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Año</Label>
                        <Select value={anio.toString()} onValueChange={(v) => setAnio(parseInt(v))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
                    <p className="text-sm text-amber-800">
                        ⚠️ Esta acción procesará los salarios base, bonificaciones y deducciones automáticas para el periodo seleccionado.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleGenerar} 
                        disabled={mutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generando...
                            </>
                        ) : (
                            "Generar Recibos"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
