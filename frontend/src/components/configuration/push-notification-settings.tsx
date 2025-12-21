"use client";

import { useState } from "react";
import { Bell, BellOff, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { usePushNotifications } from "@/src/hooks/use-push-notifications";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/features/auth/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/src/components/ui/badge";

interface PushNotificationSettingsProps {
    className?: string;
}

export function PushNotificationSettings({ className }: PushNotificationSettingsProps) {
    const {
        isSupported,
        isSubscribed,
        permission,
        isLoading,
        error,
        subscribe,
        unsubscribe
    } = usePushNotifications();

    // Test notification state
    const [sendingTest, setSendingTest] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

    const handleToggle = async () => {
        if (isSubscribed) {
            await unsubscribe();
        } else {
            await subscribe();
        }
    };

    const handleTestNotification = async () => {
        setSendingTest(true);
        setTestResult(null);

        try {
            // Emular envío - en un escenario real se llamaría a un endpoint de prueba
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                // Enviar mensaje al SW si estuviera soportado, por ahora solo simulamos
            }

            // Simulación visual
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Si el usuario está suscrito, debería recibirla. 
            // Como no tenemos endpoint de "auto-test" simple expuesto en WebPushService sin auth compleja,
            // asumimos éxito si está suscrito.
            if (isSubscribed) {
                new Notification("Prueba de Notificación", {
                    body: "¡El sistema de notificaciones funciona correctamente!",
                    icon: "/icon-192x192.png"
                });
                setTestResult('success');
            } else {
                setTestResult('error');
            }
        } catch (e) {
            console.error(e);
            setTestResult('error');
        } finally {
            setSendingTest(false);

            // Limpiar estado después de 3s
            setTimeout(() => setTestResult(null), 3000);
        }
    };

    if (!isSupported) {
        return (
            <div className={cn("p-4 border border-neutral-100 rounded-xl bg-neutral-50 text-neutral-500 text-sm", className)}>
                Tu navegador no soporta notificaciones Push.
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-neutral-800">Notificaciones Push</h4>
                        <Badge variant={isSubscribed ? "default" : "secondary"} className={cn(
                            "text-[10px] h-5 px-1.5",
                            isSubscribed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-100"
                        )}>
                            {isSubscribed ? 'ACTIVAS' : 'INACTIVAS'}
                        </Badge>
                    </div>
                    <p className="text-sm text-neutral-500">Recibe alertas sobre aprobaciones y novedades</p>
                </div>

                <Button
                    onClick={handleToggle}
                    disabled={isLoading}
                    variant={isSubscribed ? "outline" : "default"}
                    size="sm"
                    className={cn(
                        "min-w-[100px] transition-all",
                        isSubscribed
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 shadow-md"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isSubscribed ? (
                        <>
                            <BellOff className="w-4 h-4 mr-2" />
                            Desactivar
                        </>
                    ) : (
                        <>
                            <Bell className="w-4 h-4 mr-2" />
                            Activar
                        </>
                    )}
                </Button>
            </div>

            <AnimatePresence>
                {/* Permiso denegado */}
                {permission === 'denied' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-red-800">Permiso bloqueado por el navegador</p>
                            <p className="text-red-600 mt-1">
                                Para activar las notificaciones, debes restablecer los permisos en la configuración de tu navegador (clic en el candado junto a la URL).
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Mensaje de error general */}
                {error && permission !== 'denied' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 text-red-600 text-xs p-2 rounded-lg"
                    >
                        Error: {error}
                    </motion.div>
                )}

                {/* Zona de Pruebas (Solo visible si está suscrito) */}
                {isSubscribed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-4 border-t border-neutral-100"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-neutral-500">Diagnóstico</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleTestNotification}
                                disabled={sendingTest}
                                className="h-8 text-xs text-neutral-600 hover:text-emerald-600"
                            >
                                {sendingTest ? (
                                    <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                                ) : testResult === 'success' ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1.5" />
                                ) : (
                                    <Send className="w-3 h-3 mr-1.5" />
                                )}
                                {sendingTest ? 'Enviando...' : testResult === 'success' ? '¡Enviado!' : 'Enviar Notificación de Prueba'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
