"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Solicitud } from "@/src/types/solicitud";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    MessageSquare,
    Paperclip,
    Tag,
    Send,
    PartyPopper,
    ThumbsDown,
    Edit2
} from "lucide-react";

interface SolicitudDetailDialogProps {
    solicitud: Solicitud | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove?: (solicitud: Solicitud, comentario: string) => Promise<void>;
    onReject?: (solicitud: Solicitud, comentario: string) => Promise<void>;
    isAdminOrManager?: boolean;
}

// Componente de animación de éxito usando Portal
function SuccessAnimation({ type, onComplete }: { type: 'approve' | 'reject'; onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Renderizar en el body usando Portal para asegurar z-index máximo
    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onComplete}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className={`relative p-12 rounded-3xl shadow-2xl ${type === 'approve'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}
            >
                {/* Círculos decorativos animados */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute inset-0 rounded-3xl border-4 border-white/20"
                />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 2, 1.5] }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute inset-0 rounded-3xl border-2 border-white/10"
                />

                {/* Icono principal */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
                    className="flex flex-col items-center text-white"
                >
                    {type === 'approve' ? (
                        <>
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, -10, 10, 0]
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.5,
                                    repeat: 2
                                }}
                            >
                                <PartyPopper className="w-24 h-24 mb-4" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold"
                            >
                                ¡Solicitud Aprobada!
                            </motion.h2>
                        </>
                    ) : (
                        <>
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.5,
                                    repeat: 2
                                }}
                            >
                                <ThumbsDown className="w-24 h-24 mb-4" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold"
                            >
                                Solicitud Rechazada
                            </motion.h2>
                        </>
                    )}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-white/80 mt-2 text-lg"
                    >
                        {type === 'approve'
                            ? 'El colaborador será notificado'
                            : 'Se ha notificado al colaborador'}
                    </motion.p>
                </motion.div>

                {/* Partículas/confeti para aprobación */}
                {type === 'approve' && (
                    <>
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1
                                }}
                                animate={{
                                    opacity: 0,
                                    x: Math.cos(i * 30 * Math.PI / 180) * 150,
                                    y: Math.sin(i * 30 * Math.PI / 180) * 150 - 50,
                                    scale: 0
                                }}
                                transition={{
                                    duration: 1,
                                    delay: 0.3 + (i * 0.05),
                                    ease: "easeOut"
                                }}
                                className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${['bg-yellow-300', 'bg-pink-300', 'bg-blue-300', 'bg-green-300'][i % 4]
                                    }`}
                            />
                        ))}
                    </>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );
}

const getEstadoBadge = (estado: string) => {
    switch (estado) {
        case 'PENDIENTE':
            return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
        case 'APROBADA':
            return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprobada</Badge>;
        case 'RECHAZADA':
            return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>;
        default:
            return <Badge variant="outline">{estado}</Badge>;
    }
};

const getPrioridadBadge = (prioridad: string | undefined) => {
    switch (prioridad) {
        case 'URGENTE':
            return <Badge className="bg-red-500 text-white border-red-600 hover:bg-red-500">Urgente</Badge>;
        case 'ALTA':
            return <Badge className="bg-orange-500 text-white border-orange-600 hover:bg-orange-500">Alta</Badge>;
        case 'MEDIA':
            return <Badge className="bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-500">Media</Badge>;
        case 'BAJA':
            return <Badge className="bg-slate-400 text-white border-slate-500 hover:bg-slate-400">Baja</Badge>;
        default:
            return null;
    }
};

const getTipoBadge = (tipo: string) => {
    const tipoMap: Record<string, { bg: string; text: string; label: string }> = {
        'VACACIONES': { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Vacaciones' },
        'PERMISO': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Permiso' },
        'LICENCIA_MEDICA': { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Licencia Médica' },
        'CONSTANCIA_LABORAL': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Constancia Laboral' },
        'AUMENTO_SALARIO': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Aumento de Salario' },
        'PERMISO_ESTUDIO': { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Permiso de Estudio' },
    };

    const config = tipoMap[tipo] || { bg: 'bg-slate-100', text: 'text-slate-700', label: tipo.replace('_', ' ') };
    return <Badge className={`${config.bg} ${config.text} border-transparent hover:${config.bg}`}>{config.label}</Badge>;
};

export function SolicitudDetailDialog({
    solicitud,
    open,
    onOpenChange,
    onApprove,
    onReject,
    isAdminOrManager = false,
}: SolicitudDetailDialogProps) {
    const [comentario, setComentario] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [showAnimation, setShowAnimation] = useState<'approve' | 'reject' | null>(null);
    const [isEditingMode, setIsEditingMode] = useState(false);

    // Reset editing mode when dialog closes or changes
    useEffect(() => {
        if (!open) {
            setIsEditingMode(false);
            setComentario("");
            // NO resetear showAnimation aquí - dejar que la animación continúe
        }
    }, [open]);

    // Reset animation when solicitud changes
    useEffect(() => {
        setShowAnimation(null);
    }, [solicitud?.id]);

    // Initialize comentario with existing response if modifying
    useEffect(() => {
        if (isEditingMode && solicitud?.respuesta) {
            setComentario(solicitud.respuesta);
        }
    }, [isEditingMode, solicitud]);

    if (!solicitud) return null;

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
        } catch {
            return dateString;
        }
    };

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            await onApprove?.(solicitud, comentario);
            setComentario("");
            setShowAnimation('approve');
            // Cerrar el diálogo DESPUÉS de que termine la animación (2.5s)
            setTimeout(() => {
                onOpenChange(false);
            }, 2500);
        } catch (error) {
            console.error('Error al aprobar:', error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await onReject?.(solicitud, comentario);
            setComentario("");
            setShowAnimation('reject');
            // Cerrar el diálogo DESPUÉS de que termine la animación (2.5s)
            setTimeout(() => {
                onOpenChange(false);
            }, 2500);
        } catch (error) {
            console.error('Error al rechazar:', error);
        } finally {
            setIsRejecting(false);
        }
    };

    // Determinar si mostrar controles de respuesta
    const canProcess = (isAdminOrManager && solicitud.estado === 'PENDIENTE') || isEditingMode;

    return (
        <>
            {/* Animación de éxito/rechazo */}
            <AnimatePresence>
                {showAnimation && (
                    <SuccessAnimation
                        type={showAnimation}
                        onComplete={() => setShowAnimation(null)}
                    />
                )}
            </AnimatePresence>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[50]">
                    <DialogHeader className="border-b border-neutral-100 pb-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-neutral-900">
                                    {solicitud.titulo || 'Detalle de Solicitud'}
                                </DialogTitle>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Solicitud #{solicitud.id}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {getEstadoBadge(solicitud.estado)}
                                {isAdminOrManager && solicitud.estado !== 'PENDIENTE' && !isEditingMode && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 font-medium shadow-sm transition-all"
                                        onClick={() => setIsEditingMode(true)}
                                    >
                                        <Edit2 className="w-3.5 h-3.5 mr-2" />
                                        Modificar decisión
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        {/* Badges de tipo y prioridad */}
                        <div className="flex flex-wrap gap-2">
                            {getTipoBadge(solicitud.tipo)}
                            {getPrioridadBadge(solicitud.prioridad)}
                        </div>

                        {/* Información del solicitante */}
                        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <User className="w-5 h-5 text-neutral-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Solicitante</p>
                                    <p className="font-semibold text-neutral-900">{solicitud.empleadoNombre || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Descripción / Motivo */}
                        {solicitud.descripcion && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-neutral-700">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="font-semibold">Descripción / Motivo</span>
                                </div>
                                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                                    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                                        {solicitud.descripcion}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Datos adicionales (si existen) */}
                        {solicitud.datosAdicionales && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-neutral-700">
                                    <Tag className="w-4 h-4" />
                                    <span className="font-semibold">Información Adicional</span>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="text-sm text-neutral-600">
                                        {(() => {
                                            try {
                                                const parsed = JSON.parse(solicitud.datosAdicionales);
                                                return Object.entries(parsed).map(([key, value]) => (
                                                    <div key={key} className="flex gap-2 py-1">
                                                        <span className="font-medium text-neutral-500">{key}:</span>
                                                        <span>{String(value)}</span>
                                                    </div>
                                                ));
                                            } catch {
                                                return <span>{solicitud.datosAdicionales}</span>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-neutral-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Fecha de Solicitud</p>
                                    <p className="font-medium text-neutral-800">{formatDate(solicitud.createdAt)}</p>
                                </div>
                            </div>
                            {solicitud.fechaAprobacion && (
                                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Fecha de Resolución</p>
                                        <p className="font-medium text-neutral-800">{formatDate(solicitud.fechaAprobacion)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Documento adjunto */}
                        {solicitud.documentoUrl && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Paperclip className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-800">Documento Adjunto</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-100">
                                    Ver Documento
                                </Button>
                            </div>
                        )}

                        {/* Respuesta visible si no estamos editando y ya existe */}
                        {solicitud.respuesta && !isEditingMode && solicitud.estado !== 'PENDIENTE' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-neutral-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-semibold">Respuesta del Aprobador</span>
                                </div>
                                <div className={`border rounded-xl p-4 ${solicitud.estado === 'APROBADA' ? 'bg-emerald-50 border-emerald-200' :
                                    solicitud.estado === 'RECHAZADA' ? 'bg-red-50 border-red-200' :
                                        'bg-neutral-50 border-neutral-200'
                                    }`}>
                                    <p className="text-neutral-700 whitespace-pre-wrap">
                                        {solicitud.respuesta}
                                    </p>
                                    {solicitud.aprobadoPor && (
                                        <p className="text-sm text-neutral-500 mt-2">
                                            — {solicitud.aprobadoPor}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Sección de respuesta para admin/manager (si está pendiente O en modo edición) */}
                        {canProcess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`space-y-4 pt-4 border-t ${isEditingMode ? 'border-blue-200 bg-blue-50/50 p-4 rounded-xl' : 'border-neutral-200'}`}
                            >
                                {isEditingMode && (
                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                        <Edit2 className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Modificando Decisión Anterior</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="comentario" className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        Respuesta para el Colaborador
                                    </Label>
                                    <Textarea
                                        id="comentario"
                                        placeholder="Escriba un comentario o motivo de su decisión..."
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        className="min-h-[100px] resize-none border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12"
                                        onClick={handleApprove}
                                        disabled={isApproving || isRejecting}
                                    >
                                        {isApproving ? "Aprobando..." : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                                {isEditingMode ? "Cambiar a Aprobada" : "Aprobar Solicitud"}
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1 font-semibold h-12"
                                        onClick={handleReject}
                                        disabled={isApproving || isRejecting}
                                    >
                                        {isRejecting ? "Rechazando..." : (
                                            <>
                                                <XCircle className="w-5 h-5 mr-2" />
                                                {isEditingMode ? "Cambiar a Rechazada" : "Rechazar"}
                                            </>
                                        )}
                                    </Button>
                                    {isEditingMode && (
                                        <Button
                                            variant="ghost"
                                            className="h-12 px-4"
                                            onClick={() => setIsEditingMode(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
