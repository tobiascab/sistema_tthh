"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User, FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import { empleadosApi } from "@/src/lib/api/empleados";
import { DocumentosList } from "@/src/features/documentos/components/documentos-list";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Empleado } from "@/src/types/empleado";

export default function LegajosPage() {
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce manual
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ["empleados-search", debouncedSearch],
        queryFn: () => empleadosApi.search(debouncedSearch),
        enabled: debouncedSearch.length > 0,
    });

    if (selectedEmpleado) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedEmpleado(null)}
                        className="p-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-6 h-6 text-neutral-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-800">
                            Legajo de {selectedEmpleado.nombres} {selectedEmpleado.apellidos}
                        </h1>
                        <p className="text-neutral-600">
                            {selectedEmpleado.numeroDocumento} • {selectedEmpleado.cargo}
                        </p>
                    </div>
                </div>

                <DocumentosList
                    empleadoId={selectedEmpleado.id}
                    empleadoNombre={`${selectedEmpleado.nombres} ${selectedEmpleado.apellidos}`}
                    showHeader={false}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">Legajos Digitales</h1>
                <p className="text-neutral-600 mt-1">
                    Busque un colaborador para gestionar su documentación
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8 mt-12">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <Input
                        placeholder="Buscar por nombre, documento o cargo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 py-6 text-lg rounded-full shadow-sm"
                        autoFocus
                    />
                </div>

                {isLoading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    </div>
                )}

                {!isLoading && debouncedSearch && searchResults?.content && (
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                        {searchResults.content.length > 0 ? (
                            <div className="divide-y divide-neutral-100">
                                {searchResults.content.map((empleado) => (
                                    <button
                                        key={empleado.id}
                                        onClick={() => setSelectedEmpleado(empleado)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-green-700" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900">
                                                {empleado.nombres} {empleado.apellidos}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {empleado.numeroDocumento} • {empleado.cargo || "Sin cargo"}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <FolderOpen className="w-5 h-5 text-neutral-400" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-neutral-500">
                                No se encontraron colaboradores
                            </div>
                        )}
                    </div>
                )}

                {!debouncedSearch && (
                    <div className="text-center py-12">
                        <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FolderOpen className="w-10 h-10 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">
                            Repositorio Centralizado
                        </h3>
                        <p className="text-neutral-500 max-w-md mx-auto">
                            Gestione contratos, certificados, evaluaciones y toda la documentación
                            de sus colaboradores en un solo lugar seguro.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
