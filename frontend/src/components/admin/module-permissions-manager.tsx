"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { modulosApi } from "@/src/lib/api/modulos";
import { Modulo } from "@/src/types/modulo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2, Save, Shield } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface ModulePermissionsManagerProps {
    empleadoId: number;
    empleadoNombre?: string;
}

export function ModulePermissionsManager({ empleadoId, empleadoNombre }: ModulePermissionsManagerProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [modulosSeleccionados, setModulosSeleccionados] = useState<number[]>([]);

    // Fetch todos los módulos disponibles
    const { data: todosModulos, isLoading: loadingModulos } = useQuery({
        queryKey: ['modulos-todos'],
        queryFn: modulosApi.listarActivos,
    });

    // Fetch módulos asignados al empleado
    const { data: modulosAsignados, isLoading: loadingAsignados } = useQuery({
        queryKey: ['modulos-empleado', empleadoId],
        queryFn: () => modulosApi.listarModulosEmpleado(empleadoId),
    });

    // Sincronizar estado cuando se cargan los módulos asignados
    useEffect(() => {
        if (modulosAsignados) {
            setModulosSeleccionados(modulosAsignados.map((m: Modulo) => m.id));
        }
    }, [modulosAsignados]);

    // Mutation para sincronizar módulos
    const sincronizarMutation = useMutation({
        mutationFn: () => modulosApi.sincronizarModulos(empleadoId, modulosSeleccionados),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modulos-empleado', empleadoId] });
            queryClient.invalidateQueries({ queryKey: ['modulos-permisos', empleadoId] });
            toast({
                title: "Permisos actualizados",
                description: "Los permisos de módulos se han sincronizado correctamente.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "No se pudieron actualizar los permisos.",
                variant: "destructive",
            });
        },
    });

    const handleToggle = (moduloId: number, checked: boolean) => {
        setModulosSeleccionados(prev =>
            checked
                ? [...prev, moduloId]
                : prev.filter(id => id !== moduloId)
        );
    };

    const handleGuardar = () => {
        console.log("💾 Guardando módulos para empleado ", empleadoId, ":", modulosSeleccionados);
        sincronizarMutation.mutate();
    };

    if (loadingModulos || loadingAsignados) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </CardContent>
            </Card>
        );
    }

    // Agrupar módulos por categoría
    const modulosColaborador = todosModulos?.filter((m: Modulo) =>
        !m.codigo.startsWith('ADMIN_')
    ) || [];

    const modulosAdmin = todosModulos?.filter((m: Modulo) =>
        m.codigo.startsWith('ADMIN_')
    ) || [];

    const hasChanges = JSON.stringify([...modulosSeleccionados].sort()) !==
        JSON.stringify([...(modulosAsignados?.map((m: Modulo) => m.id) || [])].sort());

    return (
        <Card>
            <CardHeader className="border-b bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <CardTitle>Permisos de Módulos</CardTitle>
                        <CardDescription>
                            {empleadoNombre
                                ? `Configurar acceso a módulos para ${empleadoNombre}`
                                : "Selecciona los módulos a los que este colaborador tendrá acceso"
                            }
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        {modulosSeleccionados.length} / {todosModulos?.length || 0} seleccionados
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Módulos de Colaborador */}
                <div>
                    <h3 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                        Módulos de Colaborador
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {modulosColaborador.map((modulo: Modulo) => {
                            const isSelected = modulosSeleccionados.includes(modulo.id) || modulo.esDefault;
                            const isMandatory = modulo.esDefault;

                            return (
                                <div
                                    key={modulo.id}
                                    className={`
                                        flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                                        ${isSelected
                                            ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                        }
                                        ${isMandatory ? 'opacity-90 cursor-default' : ''}
                                    `}
                                    onClick={() => !isMandatory && handleToggle(modulo.id, !isSelected)}
                                >
                                    <input
                                        type="checkbox"
                                        id={`modulo-${modulo.id}`}
                                        checked={isSelected}
                                        disabled={isMandatory}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            !isMandatory && handleToggle(modulo.id, e.target.checked)
                                        }
                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                        className={`mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${isMandatory ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Label
                                                htmlFor={`modulo-${modulo.id}`}
                                                className={`text-sm font-medium ${isMandatory ? 'cursor-default' : 'cursor-pointer'}`}
                                            >
                                                {modulo.nombre}
                                            </Label>
                                            {isMandatory && (
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-blue-100 text-blue-700 border-blue-200">
                                                    Base
                                                </Badge>
                                            )}
                                        </div>
                                        {modulo.descripcion && (
                                            <p className="text-xs text-neutral-500 mt-1">
                                                {modulo.descripcion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Módulos Administrativos */}
                {modulosAdmin.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                            Módulos Administrativos
                            <Badge variant="secondary" className="text-xs">
                                Requiere perfil Admin/TTHH
                            </Badge>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {modulosAdmin.map((modulo: Modulo) => {
                                const isSelected = modulosSeleccionados.includes(modulo.id) || modulo.esDefault;
                                const isMandatory = modulo.esDefault;

                                return (
                                    <div
                                        key={modulo.id}
                                        className={`
                                            flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                                            ${isSelected
                                                ? 'border-purple-500 bg-purple-50 hover:bg-purple-100'
                                                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                            }
                                            ${isMandatory ? 'opacity-90 cursor-default' : ''}
                                        `}
                                        onClick={() => !isMandatory && handleToggle(modulo.id, !isSelected)}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`modulo-admin-${modulo.id}`}
                                            checked={isSelected}
                                            disabled={isMandatory}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                !isMandatory && handleToggle(modulo.id, e.target.checked)
                                            }
                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                            className={`mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${isMandatory ? 'cursor-not-allowed opacity-50' : ''}`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Label
                                                    htmlFor={`modulo-admin-${modulo.id}`}
                                                    className={`text-sm font-medium ${isMandatory ? 'cursor-default' : 'cursor-pointer'}`}
                                                >
                                                    {modulo.nombre}
                                                </Label>
                                                {isMandatory && (
                                                    <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-purple-100 text-purple-700 border-purple-200">
                                                        Base
                                                    </Badge>
                                                )}
                                            </div>
                                            {modulo.descripcion && (
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {modulo.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Botón de guardar */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-neutral-600">
                        {hasChanges
                            ? "Hay cambios sin guardar"
                            : "No hay cambios pendientes"
                        }
                    </p>
                    <Button
                        onClick={handleGuardar}
                        disabled={!hasChanges || sincronizarMutation.isPending}
                        className="gap-2"
                    >
                        {sincronizarMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
