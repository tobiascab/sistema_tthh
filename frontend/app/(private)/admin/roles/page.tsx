"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { empleadosApi } from "@/src/lib/api/empleados";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, Search, Shield, Users } from "lucide-react";
import { ModulePermissionsManager } from "@/src/components/admin/module-permissions-manager";
import { Empleado } from "@/src/types/empleado";

export default function RolesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<number | null>(null);

    // Fetch employees with search support
    const { data: response, isLoading } = useQuery({
        queryKey: ['empleados-roles', searchTerm],
        queryFn: () => empleadosApi.getAll({ search: searchTerm, size: 200 }),
    });

    const empleadosFiltrados = response?.content || [];

    const selectedEmpleado = empleadosFiltrados.find((emp: Empleado) => emp.id === selectedEmpleadoId);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                    <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Gestión de Roles y Permisos</h1>
                    <p className="text-neutral-600">Asigna módulos del sistema a cada colaborador de forma granular</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee List */}
                <Card className="lg:col-span-1 p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <Users className="w-5 h-5 text-neutral-500" />
                            <h2 className="text-lg font-semibold">Colaboradores</h2>
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <Label htmlFor="search">Buscar empleado</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Nombre o documento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Employee List */}
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                                </div>
                            ) : empleadosFiltrados.length === 0 ? (
                                <p className="text-sm text-neutral-500 text-center py-8">
                                    No se encontraron empleados
                                </p>
                            ) : (
                                empleadosFiltrados.map((empleado: Empleado) => (
                                    <button
                                        key={empleado.id}
                                        onClick={() => setSelectedEmpleadoId(empleado.id)}
                                        className={`
                                            w-full text-left p-4 rounded-lg border-2 transition-all
                                            ${selectedEmpleadoId === empleado.id
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                            }
                                        `}
                                    >
                                        <p className="font-medium text-sm text-neutral-900">
                                            {empleado.nombres} {empleado.apellidos}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {empleado.cargo || 'Sin cargo'} • {empleado.numeroDocumento}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </Card>

                {/* Module Permissions Manager */}
                <div className="lg:col-span-2">
                    {selectedEmpleadoId && selectedEmpleado ? (
                        <ModulePermissionsManager
                            empleadoId={selectedEmpleadoId}
                            empleadoNombre={`${selectedEmpleado.nombres} ${selectedEmpleado.apellidos}`}
                        />
                    ) : (
                        <Card className="p-12">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                                    <Shield className="w-8 h-8 text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900">
                                        Selecciona un colaborador
                                    </h3>
                                    <p className="text-sm text-neutral-600 mt-2">
                                        Selecciona un empleado de la lista para gestionar sus permisos modulares
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
