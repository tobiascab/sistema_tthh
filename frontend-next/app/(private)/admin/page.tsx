"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Save,
    Shield,
    Bell,
    Database,
    Clock,
    ToggleLeft
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/hooks/use-toast";

// Premium Emerald Design Tokens
const THEME = {
    card: "bg-white border text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border-neutral-100",
    buttonPrimary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20",
    iconBg: "bg-emerald-50 text-emerald-600",
};

export default function AdminPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        systemName: "Sistema TTHH Reducto",
        emailNotifications: true,
        autoApproval: false,
        vacationDays: 12,
        maintenanceMode: false,
        debugMode: true
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Configuración guardada",
                description: "Los cambios han sido aplicados correctamente.",
            });
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <div>
                    <h2 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-emerald-600" />
                        Configuración del Sistema
                    </h2>
                    <p className="text-neutral-500 mt-2 text-lg">
                        Administración global de parámetros y preferencias.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`${THEME.buttonPrimary} h-12 px-8 rounded-xl font-bold`}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin" /> Guardando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save className="w-5 h-5" /> Guardar Cambios
                        </span>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* General Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`col-span-2 ${THEME.card} rounded-2xl overflow-hidden`}
                >
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-800">Parámetros Generales</h3>
                            <p className="text-sm text-neutral-500">Información básica del sistema</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="systemName">Nombre del Sistema</Label>
                            <Input
                                id="systemName"
                                value={settings.systemName}
                                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                className="h-11 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="vacationDays">Días Vacaciones (Base)</Label>
                                <Input
                                    id="vacationDays"
                                    type="number"
                                    value={settings.vacationDays}
                                    onChange={(e) => setSettings({ ...settings, vacationDays: parseInt(e.target.value) })}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Año Fiscal</Label>
                                <Input value="2025" disabled className="bg-neutral-50 h-11" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Automation & Notifications */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`${THEME.card} rounded-2xl overflow-hidden h-fit`}
                >
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-800">Automatización</h3>
                            <p className="text-sm text-neutral-500">Reglas de negocio</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notificaciones Email</Label>
                                <p className="text-sm text-neutral-500">Enviar alertas a empleados</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(c) => setSettings({ ...settings, emailNotifications: c })}
                            />
                        </div>
                        <div className="h-px bg-neutral-100 w-full" />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto-Aprobación</Label>
                                <p className="text-sm text-neutral-500">Vacaciones &lt; 2 días</p>
                            </div>
                            <Switch
                                checked={settings.autoApproval}
                                onCheckedChange={(c) => setSettings({ ...settings, autoApproval: c })}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Security Zone */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`col-span-1 md:col-span-3 ${THEME.card} rounded-2xl overflow-hidden border-red-100`}
                >
                    <div className="p-6 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900">Zona de Peligro</h3>
                            <p className="text-sm text-red-500">Configuraciones avanzadas y mantenimiento</p>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neutral-100 rounded-full">
                                <ToggleLeft className="w-8 h-8 text-neutral-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-800">Modo Mantenimiento</h4>
                                <p className="text-sm text-neutral-500">Desactiva el acceso a colaboradores temporalmente.</p>
                            </div>
                        </div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-10 px-6 rounded-lg">
                            Activar Mantenimiento
                        </Button>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
