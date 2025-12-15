"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { EmpleadoForm } from "./empleado-form";
import { Empleado, EmpleadoFormData } from "@/src/types/empleado";

interface EmpleadoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    empleado?: Empleado;
    onSubmit: (data: EmpleadoFormData) => Promise<void>;
    isLoading?: boolean;
}

export function EmpleadoDialog({
    open,
    onOpenChange,
    empleado,
    onSubmit,
    isLoading,
}: EmpleadoDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {empleado ? "Editar Empleado" : "Nuevo Empleado"}
                    </DialogTitle>
                </DialogHeader>
                <EmpleadoForm
                    empleado={empleado}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
}
