"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Stethoscope,
    Users,
    FileText,
    Plus,
    Search,
    Filter,
    ClipboardCheck,
    Briefcase,
    BadgeCheck,
    ExternalLink
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { empleadosApi } from "@/src/lib/api/empleados";
import { Empleado } from "@/src/types/empleado";

import { DetallePrestadorDialog } from "./detalle-prestador-dialog";

export function CMRDashboard() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPrestador, setSelectedPrestador] = useState<Empleado | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const loadCMRData = async () => {
            try {
                // In a real scenario, we would have an API endpoint for CMR or filter by sucursal
                const response = await empleadosApi.getAll({
                    sucursal: "CENTRO MEDICO REDUCTO",
                    size: 100
                });
                setEmpleados(response.content || []);
            } catch (error) {
                console.error("Error loading CMR data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadCMRData();
    }, []);

    const staffInNomina = empleados.filter(e => e.tipoContrato !== "PRESTADOR_SERVICIOS");
    const professionalsExternal = empleados.filter(e => e.tipoContrato === "PRESTADOR_SERVICIOS");

    const filteredNomina = staffInNomina.filter(e =>
        e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredProfessionals = professionalsExternal.filter(e =>
        e.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.apellidos.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDetalle = (prestador: Empleado) => {
        setSelectedPrestador(prestador);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Stethoscope size={160} className="text-emerald-600" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Stethoscope size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Centro Médico Reducto (C.M.R)</h1>
                    </div>
                    <p className="text-neutral-500 max-w-2xl text-lg">
                        Gestión especializada de personal clínico y profesionales prestadores de servicios de salud.
                    </p>
                </div>

                <div className="flex gap-3 relative z-10">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-emerald-600/20 font-bold">
                        <Plus className="w-5 h-5 mr-2" /> Nuevo Profesional
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-neutral-400">Personal en Nómina</CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-700">{staffInNomina.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-neutral-500 font-medium">
                            <Users className="w-3 h-3 mr-1" /> Funcionarios permanentes
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-neutral-400">Prestadores (Factura)</CardDescription>
                        <CardTitle className="text-3xl font-black text-blue-700">{professionalsExternal.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-neutral-500 font-medium">
                            <Briefcase className="w-3 h-3 mr-1" /> Médicos / Terapeutas
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-neutral-400">Facturas Pendientes</CardDescription>
                        <CardTitle className="text-3xl font-black text-amber-600">4</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-neutral-500 font-medium">
                            <FileText className="w-3 h-3 mr-1" /> Por procesar este mes
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-neutral-400">Cumplimiento</CardDescription>
                        <CardTitle className="text-3xl font-black text-emerald-600">98%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-xs text-neutral-500 font-medium">
                            <BadgeCheck className="w-3 h-3 mr-1" /> Indicadores de atención
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Areas */}
            <Tabs defaultValue="nomina" className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-white border border-neutral-100 p-1 rounded-xl h-12 shadow-sm">
                        <TabsTrigger value="nomina" className="rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold px-6">
                            Personal Nómina
                        </TabsTrigger>
                        <TabsTrigger value="prestadores" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6">
                            Prestadores de Servicio
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar en el Centro Médico..."
                            className="bg-white pl-10 h-11 border-neutral-100 rounded-xl focus:border-emerald-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="nomina" className="animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNomina.map((e) => (
                            <motion.div key={e.id} whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-xl border border-emerald-100">
                                        {e.nombres.charAt(0)}{e.apellidos.charAt(0)}
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold">NÓMINA</Badge>
                                </div>
                                <h3 className="font-bold text-neutral-900 text-lg mb-1">{e.nombres} {e.apellidos}</h3>
                                <p className="text-neutral-500 text-sm mb-4 font-medium flex items-center gap-2">
                                    <ClipboardCheck className="w-4 h-4" /> {e.cargo}
                                </p>
                                <div className="h-px bg-neutral-100 w-full mb-4" />
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Estado: <span className="text-emerald-600">{e.estado}</span></div>
                                    <Button variant="ghost" size="sm" className="text-emerald-600 font-bold hover:bg-emerald-50 rounded-lg">
                                        Ver Perfil <ExternalLink className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="prestadores" className="animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfessionals.map((e) => (
                            <motion.div
                                key={e.id}
                                whileHover={{ y: -4 }}
                                onClick={() => handleOpenDetalle(e)}
                                className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-black text-xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {e.nombres.split(" ")[1]?.charAt(0) || "D"}{e.apellidos.charAt(0)}
                                    </div>
                                    <Badge className="bg-blue-50 text-blue-700 border-none px-3 py-1 font-bold">FACTURA</Badge>
                                </div>
                                <h3 className="font-bold text-neutral-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{e.nombres} {e.apellidos}</h3>
                                <p className="text-blue-500 text-sm mb-4 font-medium flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" /> {e.cargo}
                                </p>
                                <div className="h-px bg-neutral-100 w-full mb-4" />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 font-medium">Última Factura:</span>
                                        <span className="text-neutral-900 font-bold">15/12/2024</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-neutral-500 font-medium">Estado Pago:</span>
                                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">PROCESANDO</Badge>
                                    </div>
                                </div>
                                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-11 shadow-lg shadow-blue-600/10">
                                    Ver Detalle y Facturas
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <DetallePrestadorDialog
                empleado={selectedPrestador}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
