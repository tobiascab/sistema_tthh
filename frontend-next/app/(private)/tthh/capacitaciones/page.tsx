"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { capacitacionesApi } from "@/src/lib/api/capacitaciones";
import { RoleGuard } from "@/src/features/auth/components/role-guard";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { toast } from "@/src/components/ui/use-toast"; // Assuming toast exists
import {
    BookOpen,
    Calendar,
    MapPin,
    Users,
    Clock,
    Plus,
    Monitor,
    GraduationCap,
    Loader2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/src/features/auth/context/auth-context";

// Premium Emerald Tokens
const THEME = {
    card: "bg-white border text-neutral-900 shadow-sm hover:shadow-xl transition-all duration-300 border-neutral-100 rounded-2xl overflow-hidden group flex flex-col h-full",
    buttonPrimary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20",
    badge: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100",
};

export default function CapacitacionesPage() {
    const { user } = useAuth();
    const { empleadoId } = useCurrentUser();
    const isTTHH = user?.roles?.includes("TTHH") || user?.roles?.includes("GERENCIA");
    const queryClient = useQueryClient();

    const { data: cursos, isLoading } = useQuery({
        queryKey: ["capacitaciones"],
        queryFn: capacitacionesApi.getAll,
    });

    const { data: misInscripciones, isLoading: loadingInscripciones } = useQuery({
        queryKey: ["mis-inscripciones", empleadoId],
        queryFn: () => capacitacionesApi.getMisInscripciones(empleadoId!),
        enabled: !!empleadoId,
    });

    const inscribirMutation = useMutation({
        mutationFn: ({ empId, capId }: { empId: number; capId: number }) =>
            capacitacionesApi.inscribir(empId, capId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["capacitaciones"] });
            queryClient.invalidateQueries({ queryKey: ["mis-inscripciones"] });
            toast({ title: "Inscripción Exitosa", description: "Te has inscrito correctamente al curso.", variant: "default" });
        },
        onError: (error) => {
            toast({ title: "Error al inscribir", description: "No se pudo completar la inscripción.", variant: "destructive" });
        }
    });

    const cancelarMutation = useMutation({
        mutationFn: (inscripcionId: number) => capacitacionesApi.cancelarInscripcion(inscripcionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["capacitaciones"] });
            queryClient.invalidateQueries({ queryKey: ["mis-inscripciones"] });
            toast({ title: "Inscripción Cancelada", description: "Has liberado tu cupo.", variant: "default" });
        },
    });

    const handleInscribir = (capacitacionId: number) => {
        if (!empleadoId) return;
        inscribirMutation.mutate({ empId: empleadoId, capId: capacitacionId });
    };

    const handleCancelar = (inscripcionId: number) => {
        if (confirm("¿Estás seguro de cancelar tu inscripción?")) {
            cancelarMutation.mutate(inscripcionId);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <RoleGuard allowedRoles={["TTHH", "GERENCIA", "COLABORADOR", "AUDITORIA"]}>
            <div className="space-y-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                                <GraduationCap className="w-8 h-8" />
                            </span>
                            Campus Virtual
                        </h1>
                        <p className="text-neutral-500 mt-2 text-lg max-w-2xl">
                            Catálogo de formación corporativa y desarrollo profesional.
                        </p>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                    </div>
                )}

                {!isLoading && (!cursos || cursos.length === 0) && (
                    <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-neutral-900">No hay cursos disponibles</h3>
                    </div>
                )}

                {/* Grid de Cursos */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {cursos?.map((curso) => {
                        const inscripcion = misInscripciones?.find(i => i.capacitacionId === curso.id && i.estado === 'INSCRITO');
                        const isEnrolled = !!inscripcion;
                        const hasQuota = curso.cupoDisponible > 0;
                        const isProcessing = inscribirMutation.isPending || cancelarMutation.isPending;

                        return (
                            <motion.div variants={item} key={curso.id} className={THEME.card}>
                                {/* Card Decoration */}
                                <div className={`h-32 relative p-6 flex flex-col justify-between ${isEnrolled ? 'bg-gradient-to-br from-emerald-700 to-green-900' : 'bg-gradient-to-br from-neutral-800 to-neutral-900'}`}>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-white/20 text-white backdrop-blur-md border-transparent hover:bg-white/30">
                                            {curso.categoria}
                                        </Badge>
                                        {isEnrolled && (
                                            <Badge className="bg-emerald-400 text-emerald-900 border-transparent font-bold">
                                                INSCRITO
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
                                        {curso.nombreCapacitacion}
                                    </h3>
                                </div>

                                <div className="p-6 space-y-4 flex flex-col flex-1">
                                    {/* Metadata */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <span>{new Date(curso.fechaInicio).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            <span>{curso.duracionHoras} hs</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            <span>{curso.cupoDisponible} / {curso.cupoMaximo}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            {curso.modalidad === 'VIRTUAL' ? <Monitor className="w-4 h-4 text-emerald-500" /> : <MapPin className="w-4 h-4 text-emerald-500" />}
                                            <span>{curso.modalidad}</span>
                                        </div>
                                    </div>

                                    <p className="text-neutral-500 text-sm line-clamp-3">
                                        {curso.descripcion}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                                        {isEnrolled ? (
                                            <Button
                                                variant="destructive"
                                                className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-none font-bold"
                                                onClick={() => handleCancelar(inscripcion!.id)}
                                                disabled={isProcessing}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancelar Inscripción
                                            </Button>
                                        ) : hasQuota ? (
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                                onClick={() => handleInscribir(curso.id)}
                                                disabled={isProcessing}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Inscribirme
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" disabled className="w-full bg-neutral-100 text-neutral-400 font-bold cursor-not-allowed">
                                                Cupo Agotado
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </RoleGuard>
    );
}
