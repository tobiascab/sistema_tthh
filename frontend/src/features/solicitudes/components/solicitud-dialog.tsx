"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { SolicitudForm } from "./solicitud-form";
import { SolicitudFormData } from "@/src/types/solicitud";

interface SolicitudDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: SolicitudFormData) => Promise<void>;
    isLoading?: boolean;
}

export function SolicitudDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
}: SolicitudDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Nueva Solicitud
                    </DialogTitle>
                    <DialogDescription>
                        Completa el formulario para enviar tu solicitud. Recibirás una notificación cuando sea procesada.
                    </DialogDescription>
                </DialogHeader>
                <SolicitudForm
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
}
