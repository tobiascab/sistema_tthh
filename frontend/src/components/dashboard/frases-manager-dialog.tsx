"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { useToast } from "@/src/components/ui/use-toast";
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Quote,
    ToggleLeft,
    ToggleRight,
    BookOpen,
    Sparkles
} from "lucide-react";
import apiClient from "@/src/lib/api/client";

interface FraseDelDia {
    id: number;
    texto: string;
    autor: string;
    activa: boolean;
    orden: number;
}

interface FrasesManagerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FrasesManagerDialog({ open, onOpenChange }: FrasesManagerDialogProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newFrase, setNewFrase] = useState({ texto: "", autor: "Equipo de HR" });
    const [editForm, setEditForm] = useState({ texto: "", autor: "" });
    const [showNewForm, setShowNewForm] = useState(false);

    // Obtener todas las frases
    const { data: frases, isLoading } = useQuery({
        queryKey: ["frases-admin"],
        queryFn: async () => {
            const response = await apiClient.get("/frases-del-dia");
            return response.data as FraseDelDia[];
        },
        enabled: open,
    });

    // Crear frase
    const createMutation = useMutation({
        mutationFn: async (frase: Partial<FraseDelDia>) => {
            const response = await apiClient.post("/frases-del-dia", frase);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frases-admin"] });
            queryClient.invalidateQueries({ queryKey: ["frase-del-dia"] });
            setNewFrase({ texto: "", autor: "Equipo de HR" });
            setShowNewForm(false);
            toast({ title: "✅ Frase creada", description: "La frase se agregó correctamente" });
        },
        onError: () => {
            toast({ title: "Error", description: "No se pudo crear la frase", variant: "destructive" });
        }
    });

    // Actualizar frase
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<FraseDelDia> }) => {
            const response = await apiClient.put(`/frases-del-dia/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frases-admin"] });
            queryClient.invalidateQueries({ queryKey: ["frase-del-dia"] });
            setEditingId(null);
            toast({ title: "✅ Frase actualizada" });
        }
    });

    // Eliminar frase
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/frases-del-dia/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frases-admin"] });
            queryClient.invalidateQueries({ queryKey: ["frase-del-dia"] });
            toast({ title: "🗑️ Frase eliminada" });
        }
    });

    // Toggle activa
    const toggleMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await apiClient.patch(`/frases-del-dia/${id}/toggle`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frases-admin"] });
            queryClient.invalidateQueries({ queryKey: ["frase-del-dia"] });
        }
    });

    const startEditing = (frase: FraseDelDia) => {
        setEditingId(frase.id);
        setEditForm({ texto: frase.texto, autor: frase.autor });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ texto: "", autor: "" });
    };

    const saveEdit = () => {
        if (editingId && editForm.texto.trim()) {
            updateMutation.mutate({ id: editingId, data: editForm });
        }
    };

    const handleCreate = () => {
        if (newFrase.texto.trim()) {
            createMutation.mutate(newFrase);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="w-6 h-6 text-emerald-600" />
                        Gestionar Textos del Día
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Agrega versículos, textos motivacionales o mensajes para tu equipo. Un texto diferente se mostrará cada día.
                    </p>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Botón para nueva frase */}
                    {!showNewForm ? (
                        <Button
                            onClick={() => setShowNewForm(true)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Nuevo Texto
                        </Button>
                    ) : (
                        <Card className="border-emerald-200 bg-emerald-50/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    Nuevo Texto
                                </div>
                                <Textarea
                                    placeholder='Ej: "El trabajo en equipo divide el trabajo y multiplica los resultados."'
                                    value={newFrase.texto}
                                    onChange={(e) => setNewFrase({ ...newFrase, texto: e.target.value })}
                                    className="resize-none"
                                    rows={3}
                                />
                                <Input
                                    placeholder="Autor (ej: Proverbios 3:5, Equipo de HR)"
                                    value={newFrase.autor}
                                    onChange={(e) => setNewFrase({ ...newFrase, autor: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleCreate}
                                        disabled={!newFrase.texto.trim() || createMutation.isPending}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <Save className="w-4 h-4 mr-1" />
                                        Guardar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setShowNewForm(false);
                                            setNewFrase({ texto: "", autor: "Equipo de HR" });
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancelar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Lista de textos */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-700">
                                Textos Guardados ({frases?.length || 0})
                            </h3>
                            <Badge variant="outline" className="text-xs">
                                {frases?.filter(f => f.activa).length || 0} activos
                            </Badge>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-8 text-gray-400">Cargando...</div>
                        ) : frases?.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <Quote className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p>No hay textos guardados</p>
                                <p className="text-sm">Agrega tu primer texto arriba</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {frases?.map((frase) => (
                                    <motion.div
                                        key={frase.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Card className={`${!frase.activa ? 'opacity-60 bg-gray-50' : ''} transition-all`}>
                                            <CardContent className="p-4">
                                                {editingId === frase.id ? (
                                                    // Modo edición
                                                    <div className="space-y-3">
                                                        <Textarea
                                                            value={editForm.texto}
                                                            onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                                                            className="resize-none"
                                                            rows={3}
                                                        />
                                                        <Input
                                                            value={editForm.autor}
                                                            onChange={(e) => setEditForm({ ...editForm, autor: e.target.value })}
                                                            placeholder="Autor"
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button size="sm" onClick={saveEdit} className="bg-emerald-600 hover:bg-emerald-700">
                                                                <Save className="w-4 h-4 mr-1" />
                                                                Guardar
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={cancelEditing}>
                                                                <X className="w-4 h-4 mr-1" />
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Modo vista
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-gray-700 italic mb-1">
                                                                "{frase.texto}"
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                — {frase.autor}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8"
                                                                onClick={() => toggleMutation.mutate(frase.id)}
                                                                title={frase.activa ? "Desactivar" : "Activar"}
                                                            >
                                                                {frase.activa ? (
                                                                    <ToggleRight className="w-5 h-5 text-emerald-600" />
                                                                ) : (
                                                                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8"
                                                                onClick={() => startEditing(frase)}
                                                            >
                                                                <Edit2 className="w-4 h-4 text-gray-500" />
                                                            </Button>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                                onClick={() => deleteMutation.mutate(frase.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
