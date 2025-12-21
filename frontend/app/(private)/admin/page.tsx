"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Save,
    Shield,
    Bell,
    Database,
    Clock,
    ToggleLeft,
    BookOpen,
    MessageSquareQuote,
    CheckCircle2,
    Loader2,
    Moon,
    Sun
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { useToast } from "@/src/hooks/use-toast";
import { PushNotificationSettings } from "@/src/components/configuration/push-notification-settings";
import { FrasesManagerDialog } from "@/src/components/dashboard/frases-manager-dialog";
import { configuracionApi } from "@/src/lib/api/configuracion";
import { useTheme } from "@/src/contexts/theme-context";

// Premium Emerald Design Tokens
const THEME = {
    card: "bg-white border text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border-neutral-100",
    buttonPrimary: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20",
    iconBg: "bg-emerald-50 text-emerald-600",
};

export default function AdminPage() {
    const { toast } = useToast();
    const { theme, toggleTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [frasesManagerOpen, setFrasesManagerOpen] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    // Mock settings state for other params (could be connected later)
    const [settings, setSettings] = useState({
        systemName: "Sistema TTHH Reducto",
        emailNotifications: true,
        autoApproval: false,
        vacationDays: 12,
        debugMode: true
    });

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const status = await configuracionApi.getSystemStatus();
                setMaintenanceMode(status.maintenanceMode);
            } catch (error) {
                console.error("Error loading config", error);
                toast({
                    title: "Error de conexión",
                    description: "No se pudo cargar el estado del sistema.",
                    variant: "destructive"
                });
            } finally {
                setIsLoadingConfig(false);
            }
        };
        loadConfig();
    }, [toast]);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call for generic settings
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Configuración guardada",
                description: "Los cambios han sido aplicados correctamente.",
            });
        }, 1000);
    };

    const toggleMaintenanceMode = async () => {
        const newState = !maintenanceMode;
        setMaintenanceMode(newState); // Optimistic update

        try {
            await configuracionApi.setMaintenanceMode(newState);
            toast({
                title: newState ? "Modo Mantenimiento ACTIVADO" : "Modo Mantenimiento DESACTIVADO",
                description: newState
                    ? "El acceso al sistema está restringido a administradores."
                    : "El sistema está disponible para todos los usuarios.",
                variant: newState ? "destructive" : "default"
            });
        } catch (error) {
            setMaintenanceMode(!newState); // Revert
            toast({
                title: "Error",
                description: "No se pudo cambiar el estado de mantenimiento.",
                variant: "destructive"
            });
        }
    }

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

                {/* Automation & Notifications */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`col-span-1 md:col-span-2 ${THEME.card} rounded-2xl overflow-hidden h-fit`}
                >
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-800">Notificaciones y Mensajes</h3>
                            <p className="text-sm text-neutral-500">Gestión de alertas y contenido diario</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-8">
                        {/* Push Notifications Section */}
                        <div className="bg-neutral-50/50 rounded-xl p-4 border border-neutral-100">
                            <PushNotificationSettings />
                        </div>

                        <div className="h-px bg-neutral-100 w-full" />

                        {/* Frases del Día Section */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
                                    <Label className="text-base font-semibold">Frases del Día</Label>
                                </div>
                                <p className="text-sm text-neutral-500 max-w-md">
                                    Gestiona la colección de frases inspiradoras que ven los colaboradores al iniciar sesión.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setFrasesManagerOpen(true)}
                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Gestionar Frases
                            </Button>
                        </div>

                        <div className="h-px bg-neutral-100 w-full" />

                        <div className="flex items-center justify-between opacity-60">
                            <div className="space-y-0.5">
                                <Label className="text-base">Notificaciones Email</Label>
                                <p className="text-sm text-neutral-500">Enviar alertas a empleados</p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(c) => setSettings({ ...settings, emailNotifications: c })}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* General Settings */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`${THEME.card} rounded-2xl overflow-hidden`}
                >
                    <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 dark:bg-neutral-800/50 dark:border-neutral-700 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Parámetros</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Configuración base</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {theme === "dark" ? (
                                        <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <Sun className="w-4 h-4 text-emerald-600" />
                                    )}
                                    <Label className="text-base font-semibold">Modo Oscuro</Label>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    Cambia la apariencia a colores oscuros para reducir la fatiga visual
                                </p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="systemName">Nombre del Sistema</Label>
                            <Input
                                id="systemName"
                                value={settings.systemName}
                                onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                                className="h-11 border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
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
                </motion.div>

                {/* Security Zone */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className={`col-span-1 md:col-span-3 ${THEME.card} rounded-2xl overflow-hidden border-red-100 ring-4 ring-offset-2 ${maintenanceMode ? 'ring-red-100' : 'ring-transparent'}`}
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
                            <div className={`p-3 rounded-full transition-colors ${maintenanceMode ? 'bg-red-100' : 'bg-neutral-100'}`}>
                                <ToggleLeft className={`w-8 h-8 ${maintenanceMode ? 'text-red-600' : 'text-neutral-400'}`} />
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-800 flex items-center gap-2">
                                    Modo Mantenimiento
                                    {maintenanceMode && (
                                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                            ACTIVO
                                        </span>
                                    )}
                                </h4>
                                <p className="text-sm text-neutral-500">Desactiva el acceso a colaboradores temporalmente.</p>
                            </div>
                        </div>
                        <Button
                            variant={maintenanceMode ? "default" : "destructive"}
                            className={`h-11 px-6 rounded-lg font-bold shadow-sm ${maintenanceMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                            onClick={toggleMaintenanceMode}
                            disabled={isLoadingConfig}
                        >
                            {isLoadingConfig ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : maintenanceMode ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Desactivar Mantenimiento
                                </>
                            ) : (
                                "Activar Mantenimiento"
                            )}
                        </Button>
                    </div>
                </motion.div>

            </div>

            <FrasesManagerDialog
                open={frasesManagerOpen}
                onOpenChange={setFrasesManagerOpen}
            />
        </motion.div>
    );
}
