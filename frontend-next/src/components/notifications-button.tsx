"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    X,
    Check,
    AlertCircle,
    Info,
    CheckCircle,
    Clock,
    ChevronRight,
    Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/src/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { notificacionesApi, Notificacion } from "@/src/lib/api/notificaciones";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'SUCCESS':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'WARNING':
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        case 'ERROR':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Info className="w-5 h-5 text-blue-500" />;
    }
};

const getNotificationBg = (type: NotificationType, read: boolean) => {
    if (read) return 'bg-white';
    switch (type) {
        case 'SUCCESS':
            return 'bg-green-50';
        case 'WARNING':
            return 'bg-yellow-50';
        case 'ERROR':
            return 'bg-red-50';
        default:
            return 'bg-blue-50';
    }
};

export function NotificationsButton() {
    const { empleadoId } = useCurrentUser();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Polling cada 30 segundos
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ["notificaciones", empleadoId],
        queryFn: () => notificacionesApi.getMisNotificaciones(empleadoId!),
        enabled: !!empleadoId,
        refetchInterval: 30000,
    });

    const unreadCount = notifications.filter(n => !n.leido).length;

    const leerMutation = useMutation({
        mutationFn: (id: number) => notificacionesApi.marcarLeida(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        }
    });

    const handleMarkAsRead = (id: number) => {
        leerMutation.mutate(id);
    };

    const handleMarkAllAsRead = () => {
        notifications.forEach(n => {
            if (!n.leido) leerMutation.mutate(n.id);
        });
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <Bell className="w-5 h-5 text-neutral-600" />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-96 p-0 shadow-xl z-50"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-neutral-700" />
                        <h3 className="font-semibold text-neutral-800">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                {unreadCount} nuevas
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-neutral-500 hover:text-neutral-900"
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Marcar todas
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                            <p className="text-neutral-500">No hay notificaciones</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative p-4 border-b border-neutral-100 transition-colors ${getNotificationBg(notification.tipo, notification.leido)} hover:bg-neutral-50 cursor-pointer`}
                                    onClick={() => !notification.leido && handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getNotificationIcon(notification.tipo)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <p className={`font-medium text-sm ${notification.leido ? 'text-neutral-700' : 'text-neutral-900'}`}>
                                                    {notification.titulo}
                                                </p>
                                            </div>
                                            <p className="text-sm text-neutral-600 mt-1">
                                                {notification.mensaje}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                        locale: es
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.leido && (
                                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
