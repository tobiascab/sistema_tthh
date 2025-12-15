"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
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
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Nueva Solicitud
                    </DialogTitle>
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
