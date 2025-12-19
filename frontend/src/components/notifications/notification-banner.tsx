"use client";

import { useState } from 'react';
import { usePushNotifications } from '@/src/hooks/use-push-notifications';
import { Bell, BellOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog';
import { useToast } from '@/src/hooks/use-toast';

interface NotificationBannerProps {
    className?: string;
}

export function NotificationBanner({ className }: NotificationBannerProps) {
    const {
        isSupported,
        isSubscribed,
        permission,
        isLoading,
        subscribe,
        unsubscribe,
        isAdmin
    } = usePushNotifications();

    const [showDialog, setShowDialog] = useState(false);
    const { toast } = useToast();

    // Only show for admins who haven't subscribed yet
    if (!isSupported || !isAdmin || isSubscribed) {
        return null;
    }

    // Don't show if permission was denied
    if (permission === 'denied') {
        return null;
    }

    const handleEnable = async () => {
        const success = await subscribe();
        if (success) {
            toast({
                title: "Notificaciones activadas",
                description: "Recibirás alertas cuando haya nuevas solicitudes.",
            });
        }
        setShowDialog(false);
    };

    return (
        <>
            <div className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-lg flex items-center justify-between ${className}`}>
                <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <div>
                        <p className="font-medium text-sm">Activa las notificaciones push</p>
                        <p className="text-xs text-blue-100">
                            Recibe alertas cuando los colaboradores envíen solicitudes
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowDialog(true)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Activar"
                    )}
                </Button>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            Notificaciones Push
                        </DialogTitle>
                        <DialogDescription>
                            Al activar las notificaciones, recibirás alertas en tiempo real cuando:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Nuevas solicitudes</p>
                                <p className="text-sm text-neutral-500">
                                    Cuando un colaborador envíe una solicitud de vacaciones, permiso, etc.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Funciona sin tener la web abierta</p>
                                <p className="text-sm text-neutral-500">
                                    Las notificaciones llegarán aunque no tengas el navegador abierto.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Ahora no
                        </Button>
                        <Button onClick={handleEnable} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Activando...
                                </>
                            ) : (
                                <>
                                    <Bell className="w-4 h-4 mr-2" />
                                    Activar notificaciones
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Toggle button for settings
export function NotificationToggle() {
    const {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe
    } = usePushNotifications();
    const { toast } = useToast();

    if (!isSupported) {
        return (
            <div className="flex items-center gap-2 text-neutral-500">
                <BellOff className="w-4 h-4" />
                <span className="text-sm">No soportado en este navegador</span>
            </div>
        );
    }

    const handleToggle = async () => {
        if (isSubscribed) {
            const success = await unsubscribe();
            if (success) {
                toast({
                    title: "Notificaciones desactivadas",
                    description: "Ya no recibirás alertas push.",
                });
            }
        } else {
            const success = await subscribe();
            if (success) {
                toast({
                    title: "Notificaciones activadas",
                    description: "Recibirás alertas cuando haya nuevas solicitudes.",
                });
            }
        }
    };

    return (
        <Button
            variant={isSubscribed ? "outline" : "default"}
            onClick={handleToggle}
            disabled={isLoading}
            className="w-full justify-start"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isSubscribed ? (
                <BellOff className="w-4 h-4 mr-2" />
            ) : (
                <Bell className="w-4 h-4 mr-2" />
            )}
            {isSubscribed ? 'Desactivar notificaciones' : 'Activar notificaciones'}
        </Button>
    );
}
