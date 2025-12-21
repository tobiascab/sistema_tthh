"use client";

import { useAuth } from "@/src/features/auth/context/auth-context";
import { Settings, User, Bell, Lock, Shield, Eye, Globe } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";

export default function ConfiguracionPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
            <div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Configuración</h1>
                <p className="text-neutral-500 mt-1">Gestione sus preferencias de cuenta y del sistema.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <div className="border-b border-neutral-200 mb-6">
                    <TabsList className="bg-transparent h-12 p-0 space-x-6">
                        <TabsTrigger
                            value="general"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="seguridad"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Seguridad
                        </TabsTrigger>
                        <TabsTrigger
                            value="notificaciones"
                            className="h-12 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0"
                        >
                            <Bell className="w-4 h-4 mr-2" />
                            Notificaciones
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="grid gap-6">
                    <TabsContent value="general" className="m-0 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-600" />
                                Preferencias del Sistema
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Modo Oscuro</Label>
                                        <p className="text-sm text-neutral-500">Cambiar la apariencia a colores oscuros.</p>
                                    </div>
                                    <Switch disabled />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Compactar Vista</Label>
                                        <p className="text-sm text-neutral-500">Mostrar más información en menos espacio.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="seguridad" className="m-0 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-emerald-600" />
                                Seguridad de Acceso
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Contraseña</Label>
                                        <p className="text-sm text-neutral-500">Actualizar su contraseña de acceso.</p>
                                    </div>
                                    <Button variant="outline">Cambiar</Button>
                                </div>
                                <div className="flex items-center justify-between border-t pt-6">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Autenticación de Dos Factores</Label>
                                        <p className="text-sm text-neutral-500">Aumentar la seguridad de su cuenta.</p>
                                    </div>
                                    <Button variant="outline" disabled>Configurar</Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="notificaciones" className="m-0 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-emerald-600" />
                                Notificaciones Push y Email
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Notificaciones por Email</Label>
                                        <p className="text-sm text-neutral-500">Recibir alertas de aprobación en su correo.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Notificaciones de Navegador</Label>
                                        <p className="text-sm text-neutral-500">Alertas en tiempo real mientras usa el sistema.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
